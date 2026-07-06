<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\JastipItem;
use App\Models\JastipItemImage;
use App\Models\JastipItemVariant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminJastipController extends Controller
{
    private const CATEGORIES = ['Fashion', 'Skincare', 'Food', 'Merchandise'];

    // ── Manajemen Jastip (list produk + aktivitas penjualan) ─────────────
    public function index(Request $request)
    {
        $userId = Auth::id();

        $items = JastipItem::query()
            ->where('user_id', $userId)
            ->with('jastip_item_images')
            ->leftJoinSub($this->soldSubquery(), 'sold', 'sold.jastip_item_id', '=', 'jastip_items.id')
            ->select('jastip_items.*', DB::raw('COALESCE(sold.sold, 0) as sold_count'))
            ->latest('jastip_items.created_at')
            ->get()
            ->map(fn ($item) => $this->formatCard($item));

        // Aktivitas penjualan — order item milik produk jastiper ini
        $orders = DB::table('jastip_order_items')
            ->join('jastip_items', 'jastip_order_items.jastip_item_id', '=', 'jastip_items.id')
            ->join('jastip_orders', 'jastip_order_items.jastip_order_id', '=', 'jastip_orders.id')
            ->join('transactions', 'jastip_orders.transaction_id', '=', 'transactions.id')
            ->join('users', 'transactions.user_id', '=', 'users.id')
            ->leftJoin('jastip_item_variants', 'jastip_order_items.jastip_item_variant_id', '=', 'jastip_item_variants.id')
            ->where('jastip_items.user_id', $userId)
            ->orderByDesc('jastip_orders.created_at')
            ->select(
                'jastip_order_items.id',
                'jastip_orders.id as order_id',
                'jastip_orders.order_status',
                'jastip_orders.use_shipping',
                'jastip_items.name as item_name',
                'jastip_item_variants.var_value as variant',
                'jastip_order_items.quantity',
                'users.full_name as buyer_name',
                'users.username as buyer_username',
                'users.profile_image as buyer_image',
            )
            ->paginate(5, ['*'], 'orders_page')
            ->withQueryString()
            ->through(fn ($o) => [
                'id'       => $o->id,
                'code'     => 'ORD-' . str_pad($o->order_id, 6, '0', STR_PAD_LEFT),
                'buyer'    => $o->buyer_name,
                'username' => $o->buyer_username,
                'avatar'   => $this->resolveAvatarUrl($o->buyer_image),
                'item'     => $o->item_name . ($o->variant ? ' — ' . $o->variant : ''),
                'qty'      => (int) $o->quantity,
                'shipping' => (bool) $o->use_shipping,
                'status'   => $o->order_status,
            ]);

        return Inertia::render('Admin/Jastip/Index', [
            'items'  => $items,
            'orders' => $orders,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Jastip/Create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateItem($request);
        $item = $this->persistItem(new JastipItem(['user_id' => Auth::id()]), $request, $data);

        ActivityLog::record('Membuat produk jastip: ' . $item->name);

        return redirect()->route('admin.jastip.index')->with('flash', [
            'type' => 'success',
            'message' => $item->isDraft() ? 'Produk jastip disimpan sebagai draft.' : 'Produk jastip berhasil dipublish.',
        ]);
    }

    public function edit($id)
    {
        $item = JastipItem::where('user_id', Auth::id())
            ->with(['jastip_item_variants', 'jastip_item_images'])
            ->findOrFail($id);

        // Kelompokkan varian per var_name menjadi grup + opsi
        $variants = $item->jastip_item_variants
            ->groupBy('var_name')
            ->map(fn ($rows, $name) => [
                'name' => $name,
                'options' => $rows->map(fn ($r) => [
                    'value' => $r->var_value,
                    'price' => (float) $r->additional_price,
                ])->values(),
            ])->values();

        return Inertia::render('Admin/Jastip/Edit', [
            'categories' => self::CATEGORIES,
            'item' => [
                'id'           => $item->id,
                'name'         => $item->name,
                'brand'        => $item->brand,
                'category'     => $item->category,
                'description'  => $item->description,
                'base_price'   => (float) $item->base_price,
                'jastip_fee'   => (float) $item->jastip_fee,
                'max_slot'     => $item->max_slot,
                'min_buy'      => $item->min_buy,
                'start_date'   => optional($item->start_date)->format('Y-m-d'),
                'end_date'     => optional($item->end_date)->format('Y-m-d'),
                'status'       => $item->status,
                'variants'     => $variants,
                'existing_images' => $item->jastip_item_images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $this->resolveImageUrl($img->image_name),
                ])->values(),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = JastipItem::where('user_id', Auth::id())->findOrFail($id);
        $data = $this->validateItem($request);
        $this->persistItem($item, $request, $data);

        ActivityLog::record('Memperbarui produk jastip: ' . $item->name);

        return redirect()->route('admin.jastip.index')->with('flash', [
            'type' => 'success',
            'message' => 'Produk jastip berhasil diperbarui.',
        ]);
    }

    public function destroy($id)
    {
        $item = JastipItem::where('user_id', Auth::id())->findOrFail($id);
        $name = $item->name;

        foreach ($item->jastip_item_images as $img) {
            $this->deleteStoredImage($img->image_name);
        }
        $item->delete();

        ActivityLog::record('Menghapus produk jastip: ' . $name);

        return back()->with('flash', ['type' => 'success', 'message' => 'Produk jastip berhasil dihapus.']);
    }

    public function publish($id)
    {
        $item = JastipItem::where('user_id', Auth::id())->findOrFail($id);
        $item->update(['status' => JastipItem::STATUS_PUBLISHED]);

        ActivityLog::record('Mempublikasikan produk jastip: ' . $item->name);

        return back()->with('flash', ['type' => 'success', 'message' => 'Produk jastip berhasil dipublish.']);
    }

    // ── Analitik Jastip ──────────────────────────────────────────────────
    public function analytics()
    {
        $userId = Auth::id();

        // Baris order item berbayar milik produk jastiper ini
        $paidItems = DB::table('jastip_order_items')
            ->join('jastip_items', 'jastip_order_items.jastip_item_id', '=', 'jastip_items.id')
            ->join('jastip_orders', 'jastip_order_items.jastip_order_id', '=', 'jastip_orders.id')
            ->join('transactions', 'jastip_orders.transaction_id', '=', 'transactions.id')
            ->leftJoin('jastip_item_variants', 'jastip_order_items.jastip_item_variant_id', '=', 'jastip_item_variants.id')
            ->where('jastip_items.user_id', $userId)
            ->where('jastip_orders.order_status', 'paid');

        $rows = (clone $paidItems)->get([
            'jastip_order_items.quantity',
            'jastip_items.base_price',
            'jastip_items.jastip_fee',
            'jastip_item_variants.additional_price',
            'jastip_orders.created_at',
            'transactions.user_id as buyer_id',
        ]);

        $revenue = $rows->sum(fn ($r) => ((float) $r->base_price + (float) $r->jastip_fee + (float) $r->additional_price) * (int) $r->quantity);
        $productsSold = (int) $rows->sum('quantity');
        $customers = $rows->pluck('buyer_id')->unique()->count();

        $rating = $this->accountRating($userId, 'jastiper');

        // Grafik penjualan 6 bulan terakhir (jumlah produk terjual per bulan)
        $monthly = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->startOfMonth()->subMonths($i);
            $qty = $rows
                ->filter(fn ($r) => Carbon::parse($r->created_at)->isSameMonth($month))
                ->sum('quantity');
            $monthly[] = [
                'label' => $month->translatedFormat('M'),
                'value' => (int) $qty,
            ];
        }

        // Produk terlaris
        $best = JastipItem::where('user_id', $userId)
            ->with('jastip_item_images')
            ->leftJoinSub($this->soldSubquery(), 'sold', 'sold.jastip_item_id', '=', 'jastip_items.id')
            ->select('jastip_items.*', DB::raw('COALESCE(sold.sold, 0) as sold_count'))
            ->orderByDesc('sold_count')
            ->first();

        return Inertia::render('Admin/Jastip/Analytics', [
            'stats' => [
                'products_sold' => $productsSold,
                'revenue'       => $revenue,
                'customers'     => $customers,
                'rating'        => $rating['average'],
            ],
            'monthly'    => $monthly,
            'bestSeller' => $best ? $this->formatCard($best) : null,
        ]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private function soldSubquery()
    {
        return DB::table('jastip_order_items')
            ->join('jastip_orders', 'jastip_order_items.jastip_order_id', '=', 'jastip_orders.id')
            ->where('jastip_orders.order_status', 'paid')
            ->groupBy('jastip_item_id')
            ->select('jastip_item_id', DB::raw('SUM(quantity) as sold'));
    }

    private function formatCard(JastipItem $item): array
    {
        $sold = (int) ($item->sold_count ?? 0);
        $isSoldOut = $item->max_slot > 0 && $sold >= $item->max_slot;

        return [
            'id'          => $item->id,
            'name'        => $item->name,
            'brand'       => $item->brand,
            'category'    => $item->category,
            'base_price'  => (float) $item->base_price,
            'jastip_fee'  => (float) $item->jastip_fee,
            'total_price' => $item->totalPrice(),
            'max_slot'    => (int) $item->max_slot,
            'sold'        => $sold,
            'status'      => $isSoldOut ? 'sold_out' : $item->status,
            'is_draft'    => $item->isDraft(),
            'image'       => $item->relationLoaded('jastip_item_images') && $item->jastip_item_images->isNotEmpty()
                ? $this->resolveImageUrl($item->jastip_item_images->first()->image_name)
                : '/assets/default-image.png',
        ];
    }

    private function validateItem(Request $request): array
    {
        return $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'brand'       => ['nullable', 'string', 'max:255'],
            'category'    => ['required', 'string', 'in:' . implode(',', self::CATEGORIES)],
            'description' => ['nullable', 'string'],
            'base_price'  => ['required', 'numeric', 'min:0'],
            'jastip_fee'  => ['nullable', 'numeric', 'min:0'],
            'max_slot'    => ['required', 'integer', 'min:1'],
            'min_buy'     => ['required', 'integer', 'min:1'],
            'start_date'  => ['nullable', 'date'],
            'end_date'    => ['nullable', 'date', 'after_or_equal:start_date'],
            'publish'     => ['sometimes', 'boolean'],
            // Varian opsional — grup/opsi yang kosong diabaikan saat menyimpan.
            'variants'                 => ['nullable', 'array'],
            'variants.*.name'          => ['nullable', 'string', 'max:100'],
            'variants.*.options'       => ['nullable', 'array'],
            'variants.*.options.*.value' => ['nullable', 'string', 'max:100'],
            'variants.*.options.*.price' => ['nullable', 'numeric', 'min:0'],
            'images'      => ['nullable', 'array'],
            'images.*'    => ['image', 'max:4096'],
            'removed_images' => ['nullable', 'array'],
        ]);
    }

    private function persistItem(JastipItem $item, Request $request, array $data): JastipItem
    {
        DB::transaction(function () use ($item, $request, $data) {
            $item->fill([
                'name'        => $data['name'],
                'brand'       => $data['brand'] ?? null,
                'category'    => $data['category'],
                'description' => $data['description'] ?? null,
                'base_price'  => $data['base_price'],
                'jastip_fee'  => $data['jastip_fee'] ?? 0,
                'max_slot'    => $data['max_slot'],
                'min_buy'     => $data['min_buy'],
                'start_date'  => $data['start_date'] ?? null,
                'end_date'    => $data['end_date'] ?? null,
                'status'      => ! empty($data['publish']) ? JastipItem::STATUS_PUBLISHED : JastipItem::STATUS_DRAFT,
            ]);
            $item->save();

            // Varian — ganti seluruhnya (paling sederhana & konsisten).
            // Lewati grup tanpa nama atau opsi tanpa nilai.
            $item->jastip_item_variants()->delete();
            foreach ($data['variants'] ?? [] as $group) {
                $groupName = trim((string) ($group['name'] ?? ''));
                if ($groupName === '') {
                    continue;
                }
                foreach ($group['options'] ?? [] as $opt) {
                    if (trim((string) ($opt['value'] ?? '')) === '') {
                        continue;
                    }
                    JastipItemVariant::create([
                        'jastip_item_id'   => $item->id,
                        'var_name'         => $groupName,
                        'var_value'        => $opt['value'],
                        'additional_price' => $opt['price'] ?? 0,
                    ]);
                }
            }

            // Hapus gambar yang ditandai
            foreach ((array) $request->input('removed_images', []) as $imgId) {
                $img = $item->jastip_item_images()->find($imgId);
                if ($img) {
                    $this->deleteStoredImage($img->image_name);
                    $img->delete();
                }
            }

            // Tambah gambar baru
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store('jastip-images', 'public');
                    JastipItemImage::create([
                        'jastip_item_id' => $item->id,
                        'image_name'     => $path,
                    ]);
                }
            }
        });

        return $item;
    }

    private function resolveImageUrl(?string $path): string
    {
        if (! $path) {
            return '/assets/default-image.png';
        }
        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }
        return asset('storage/' . $path);
    }

    private function deleteStoredImage(?string $path): void
    {
        if ($path && ! Str::startsWith($path, ['http://', 'https://', '/'])) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }
    }
}
