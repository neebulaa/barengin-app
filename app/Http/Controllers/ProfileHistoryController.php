<?php

namespace App\Http\Controllers;

use App\Models\Jastip;
use App\Models\PergiBareng;
use App\Models\Transaction;
use App\Models\Trip;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileHistoryController extends Controller
{
    /**
     * Halaman riwayat & profil pengguna.
     *
     * Catatan: skema database belum punya tabel "favorit/like" untuk trip & jastip,
     * jadi tab "Kesukaan" menampilkan item yang berkaitan dengan user
     * (trip & jastip yang pernah dipesan, pergi bareng yang diikuti/dibuat).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Sinkronkan status transaksi yang masih pending langsung dari Midtrans
        $this->syncPendingTransactions($user);

        return inertia('ProfileHistory/Index', [
            'profile'           => $this->profilePayload($user),
            'transactions'      => $this->transactions($user),
            'trip_favorites'    => $this->tripFavorites($user),
            'pergi_barengs'     => $this->pergiBarengs($user),
            'jastip_favorites'  => $this->jastipFavorites($user),
            'tab'               => $request->query('tab', 'transactions'),
            'midtrans_client_key' => config('midtrans.client_key'),
        ]);
    }

    /**
     * Cek ulang ke Midtrans untuk transaksi yang ordernya masih pending/unpaid,
     * lalu update status di DB (agar hasil simulasi pembayaran ter-refleksi).
     */
    private function syncPendingTransactions(User $user): void
    {
        $pendingIds = DB::table('transactions as t')
            ->where('t.user_id', $user->id)
            ->where(function ($q) {
                $q->whereIn('t.id', DB::table('trip_orders')
                        ->whereIn('order_status', ['pending', 'unpaid'])
                        ->select('transaction_id'))
                    ->orWhereIn('t.id', DB::table('jastip_orders')
                        ->whereIn('order_status', ['pending', 'unpaid'])
                        ->select('transaction_id'));
            })
            ->pluck('t.id');

        foreach ($pendingIds as $id) {
            MidtransController::syncTransaction($id);
        }
    }

    /* ===================== DATA BUILDERS ===================== */

    private function profilePayload(User $user): array
    {
        return [
            'id'             => $user->id,
            'full_name'      => $user->full_name,
            'username'       => $user->username,
            'email'          => $user->email,
            'phone'          => $user->phone,
            'gender'         => $user->gender,
            'pronouns'       => $this->pronouns($user->gender),
            'bio'            => $user->bio,
            'birth_date'     => $user->birth_date
                ? Carbon::parse($user->birth_date)->format('Y-m-d')
                : null,
            'birth_date_label' => $user->birth_date
                ? Carbon::parse($user->birth_date)->format('d/m/Y')
                : null,
            'avatar'         => $user->public_profile_image,
            'has_custom_avatar' => (bool) $user->profile_image,
            'followers_count' => $user->followers()->count(),
            'following_count' => $user->followings()->count(),
        ];
    }

    private function pronouns(?string $gender): ?string
    {
        return match ($gender) {
            'male'   => 'he/him',
            'female' => 'she/her',
            default  => null,
        };
    }

    /**
     * Riwayat transaksi (trip & jastip) milik user, terpaginasi.
     */
    private function transactions(User $user)
    {
        $transactions = Transaction::query()
            ->where('user_id', $user->id)
            ->with([
                'trip_order.trip',
                'jastip_order.jastip_order_items.jastip_item.jastip_item_images',
            ])
            ->latest()
            ->paginate(4, ['*'], 'tx_page')
            ->withQueryString();

        $transactions->getCollection()->transform(function (Transaction $t) {
            if ($t->type === 'trip') {
                return $this->mapTripTransaction($t);
            }

            return $this->mapJastipTransaction($t);
        });

        return $transactions;
    }

    private function mapTripTransaction(Transaction $t): array
    {
        $order = $t->trip_order;
        $trip  = $order?->trip;
        $status = $this->normalizeStatus('trip', $order?->order_status);

        return [
            'id'         => $t->id,
            'kind'       => 'trip',
            'type_label' => 'Pembelian Trip',
            'date_label' => Carbon::parse($t->created_at)->translatedFormat('d M Y'),
            'item_name'  => $trip?->name ?? 'Trip',
            'image'      => $this->resolveImage($trip?->image, '/assets/trip-bareng/list-trip/gunung_bromo/trip_bareng-gunung_bromo-1.jpg'),
            'slot'       => (int) ($order?->quantity ?? 1),
            'total'      => (float) $t->total_amount,
            'status'     => $status,
            'snap_token' => $t->snap_token,
            'detail_url' => $trip ? '/trip-bareng/' . $trip->id : null,
        ];
    }

    private function mapJastipTransaction(Transaction $t): array
    {
        $order      = $t->jastip_order;
        $firstItem  = $order?->jastip_order_items?->first()?->jastip_item;
        $firstImage = $firstItem?->jastip_item_images?->first()?->image_name;
        $itemCount  = $order?->jastip_order_items?->count() ?? 1;
        $status     = $this->normalizeStatus('jastip', $order?->order_status);

        return [
            'id'         => $t->id,
            'kind'       => 'jastip',
            'type_label' => 'Pembelian Jastip',
            'date_label' => Carbon::parse($t->created_at)->translatedFormat('d M Y'),
            'item_name'  => $firstItem?->name ?? 'Jastip',
            'image'      => $this->resolveImage($firstImage, '/assets/default-image.png'),
            'slot'       => (int) $itemCount,
            'total'      => (float) $t->total_amount,
            'status'     => $status,
            'snap_token' => $t->snap_token,
            'detail_url' => null,
        ];
    }

    /**
     * Status ternormalisasi untuk UI:
     * completed | waiting_payment | in_progress
     */
    private function normalizeStatus(string $kind, ?string $orderStatus): string
    {
        if ($orderStatus === 'paid') {
            return $kind === 'jastip' ? 'in_progress' : 'completed';
        }

        // pending / unpaid / null
        return 'waiting_payment';
    }

    /**
     * Trip "kesukaan" -> trip yang di-like user (tabel favorites).
     * Bentuk data disesuaikan dengan props TripCard.
     */
    private function tripFavorites(User $user)
    {
        $tripIds = DB::table('favorites')
            ->where('user_id', $user->id)
            ->where('favoritable_type', 'trip')
            ->pluck('favoritable_id')
            ->unique()
            ->values();

        $trips = DB::table('trips')
            ->join('users', 'trips.guider_id', '=', 'users.id')
            ->select('trips.*', 'users.id as host_id', 'users.full_name as guide_name', 'users.profile_image as guide_image')
            ->whereIn('trips.id', $tripIds)
            ->orderByDesc('trips.created_at')
            ->paginate(6, ['*'], 'trip_page')
            ->withQueryString();

        $trips->getCollection()->transform(function ($trip) {
            $startDate = Carbon::parse($trip->start_date);
            $endDate   = Carbon::parse($trip->end_date);
            $duration  = (int) $startDate->diffInDays($endDate) . ' Days';

            $joined    = DB::table('trip_participants')->where('trip_id', $trip->id)->count();
            $remaining = max(0, $trip->people_amount - $joined);

            $guideRating = DB::table('user_ratings')
                ->where('rated_user_id', $trip->host_id)
                ->avg('rating_amount');

            $guideReviews = DB::table('user_ratings')
                ->where('rated_user_id', $trip->host_id)
                ->count();

            return [
                'id'             => $trip->id,
                'title'          => $trip->name,
                'location'       => $trip->location ?? 'Indonesia',
                'date'           => $startDate->format('d M y') . ' - ' . $endDate->format('d M y') . ' (' . $duration . ')',
                'capacity'       => $trip->people_amount,
                'joined_count'   => $joined,
                'remaining_seats' => $remaining,
                'rating'         => (float) $trip->rating,
                'price'          => (float) $trip->price,
                'guide_id'       => $trip->host_id,
                'guide'          => $trip->guide_name,
                'guide_avatar'   => $this->resolveImage($trip->guide_image, '/assets/default-profile.png'),
                'guide_rating'   => $guideRating ? number_format($guideRating, 1) : '0',
                'guide_reviews'  => $guideReviews,
                'guide_badge'    => 'Expert Guide',
                'image'          => $this->resolveImage($trip->image, '/assets/trip-bareng/list-trip/gunung_bromo/trip_bareng-gunung_bromo-1.jpg'),
                'liked'          => true,
            ];
        });

        return $trips;
    }

    /**
     * Pergi bareng yang di-like user (tabel favorites).
     * Bentuk data disesuaikan dengan props PergiBarengCard.
     */
    private function pergiBarengs(User $user)
    {
        $likedIds = DB::table('favorites')
            ->where('user_id', $user->id)
            ->where('favoritable_type', 'pergi_bareng')
            ->pluck('favoritable_id');

        $items = PergiBareng::query()
            ->with(['initiator.user_ratings', 'pergi_bareng_participants'])
            ->whereIn('id', $likedIds)
            ->latest()
            ->paginate(6, ['*'], 'pb_page')
            ->withQueryString();

        $items->getCollection()->transform(function (PergiBareng $trip) {
            $date     = $trip->time_appointment;
            $joined   = $trip->pergi_bareng_participants->count();
            $avgRate  = $trip->initiator?->allRating() ?? 0;
            $reviews  = $trip->initiator?->user_ratings?->count() ?? 0;

            $transportIcon = 'car';
            if (str_contains(strtolower($trip->transportation), 'umum')) {
                $transportIcon = 'train';
            }

            return [
                'id'             => $trip->id,
                'image'          => $this->resolveImage($trip->img_name, '/assets/pergi-bareng/PergiBarengHeader.avif'),
                'title'          => $trip->name,
                'address'        => $trip->departure_loc,
                'date'           => $date?->translatedFormat('d M y'),
                'time'           => $date?->format('H:i'),
                'capacity'       => $joined . '/' . $trip->people_amount . ' Orang',
                'remainingSeats' => max(0, $trip->people_amount - $joined),
                'user'           => [
                    'id'       => $trip->initiator?->id,
                    'name'     => $trip->initiator?->full_name ?? 'Penyelenggara',
                    'avatar'   => $trip->initiator?->public_profile_image ?? asset('assets/default-profile.png'),
                    'rating'   => number_format($avgRate, 1),
                    'reviews'  => (int) $reviews,
                    'verified' => true,
                ],
                'transportType' => $trip->transportation,
                'transportIcon' => $transportIcon,
                'href'          => '/pergi-bareng/' . $trip->id,
                'liked'         => true,
            ];
        });

        return $items;
    }

    /**
     * Jastip "kesukaan" -> item jastip yang pernah dipesan user.
     */
    private function jastipFavorites(User $user)
    {
        $items = DB::table('jastip_order_items')
            ->join('jastip_orders', 'jastip_order_items.jastip_order_id', '=', 'jastip_orders.id')
            ->join('transactions', 'jastip_orders.transaction_id', '=', 'transactions.id')
            ->join('jastip_items', 'jastip_order_items.jastip_item_id', '=', 'jastip_items.id')
            ->join('jastips', 'jastip_items.jastip_id', '=', 'jastips.id')
            ->where('transactions.user_id', $user->id)
            ->select(
                'jastip_items.id',
                'jastip_items.name',
                'jastip_items.category',
                'jastip_items.base_price',
                'jastips.origin_city',
                'jastips.destination_city',
            )
            ->distinct()
            ->orderByDesc('jastip_items.id')
            ->paginate(6, ['*'], 'jastip_page')
            ->withQueryString();

        $items->getCollection()->transform(function ($item) {
            $image = DB::table('jastip_item_images')
                ->where('jastip_item_id', $item->id)
                ->value('image_name');

            return [
                'id'       => $item->id,
                'name'     => $item->name,
                'category' => $item->category,
                'price'    => (float) $item->base_price,
                'from'     => $item->origin_city,
                'to'       => $item->destination_city,
                'image'    => $this->resolveImage($image, '/assets/default-image.png'),
            ];
        });

        return $items;
    }

    private function resolveImage(?string $path, string $fallback): string
    {
        if (! $path) {
            return $fallback;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return $path;
        }

        return asset('storage/' . $path);
    }

    /* ===================== PROFILE MUTATIONS ===================== */

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'full_name'  => ['required', 'string', 'max:50'],
            'username'   => ['required', 'string', 'max:30', 'regex:/^[A-Za-z0-9_.]+$/', Rule::unique('users', 'username')->ignore($user->id)],
            'email'      => ['required', 'email', 'max:100', Rule::unique('users', 'email')->ignore($user->id)],
            'phone'      => ['nullable', 'string', 'max:20'],
            'gender'     => ['nullable', 'in:male,female,silent'],
            'bio'        => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date', 'before:today'],
        ]);

        $validated['phone'] = $this->normalizePhone($validated['phone'] ?? null);

        $user->update($validated);

        return redirect()->route('profile-history')->with('flash', [
            'type'    => 'success',
            'message' => 'Profil berhasil diperbarui.',
        ]);
    }

    public function updateProfileImage(Request $request)
    {
        $request->validate([
            'profile_image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:4096'],
        ]);

        $user = $request->user();

        // Hapus gambar lama (hanya file lokal, bukan URL google)
        if ($user->profile_image && ! str_starts_with($user->profile_image, 'http')) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $request->file('profile_image')->store('profile-images', 'public');

        $user->update(['profile_image' => $path]);

        return redirect()->route('profile-history')->with('flash', [
            'type'    => 'success',
            'message' => 'Foto profil berhasil diperbarui.',
        ]);
    }

    public function removeProfileImage(Request $request)
    {
        $user = $request->user();

        if ($user->profile_image && ! str_starts_with($user->profile_image, 'http')) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $user->update(['profile_image' => null]);

        return redirect()->route('profile-history')->with('flash', [
            'type'    => 'success',
            'message' => 'Foto profil berhasil dihapus.',
        ]);
    }

    private function normalizePhone(?string $phone): ?string
    {
        if (! $phone) {
            return null;
        }

        $phone = preg_replace('/[^\d+]/', '', $phone);
        $phone = preg_replace('/^(?:\+62|62|0)/', '', $phone);

        if (! $phone) {
            return null;
        }

        return '+62' . $phone;
    }
}
