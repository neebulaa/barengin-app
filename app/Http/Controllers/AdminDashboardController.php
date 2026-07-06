<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Jastip;
use App\Models\PergiBareng;
use App\Models\Trip;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'users' => User::count(),
            'trips' => Trip::count(),
            'jastip' => Jastip::count(),
            'pergi_bareng' => PergiBareng::count(),
        ];

        // 3 trip terbaru dibuat (format sama dengan TripCard)
        $latestTrips = Trip::query()
            ->join('users', 'trips.guider_id', '=', 'users.id')
            ->select('trips.*', 'users.id as host_id', 'users.full_name as guide_name', 'users.profile_image')
            ->orderByDesc('trips.created_at')
            ->orderByDesc('trips.id')
            ->limit(3)
            ->get()
            ->map(fn ($trip) => $this->formatTripCard($trip));

        // Log kegiatan — paginasi 5 per halaman
        $logs = ActivityLog::with('user:id,full_name,profile_image')
            ->latest()
            ->paginate(5, ['*'], 'logs_page')
            ->withQueryString()
            ->through(fn ($log) => [
                'id' => $log->id,
                'time' => Carbon::parse($log->created_at)->translatedFormat('d M Y H:i:s'),
                'actor' => $log->user?->full_name ?? $log->actor_name ?? 'Sistem',
                'initials' => $this->initials($log->user?->full_name ?? $log->actor_name ?? 'S'),
                'avatar' => $log->user?->public_profile_image,
                'action' => $log->action,
                'ip' => $log->ip_address ?? '-',
            ]);

        return Inertia::render('Admin/Beranda', [
            'stats' => $stats,
            'latestTrips' => $latestTrips,
            'logs' => $logs,
        ]);
    }

    public function exportLogs(): StreamedResponse
    {
        ActivityLog::record('Mengekspor log kegiatan');

        $filename = 'log-kegiatan-' . now()->format('Ymd-His') . '.csv';

        return response()->streamDownload(function () {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Waktu', 'Aktor', 'Aksi', 'Alamat IP']);

            ActivityLog::with('user:id,full_name')
                ->latest()
                ->chunk(200, function ($logs) use ($out) {
                    foreach ($logs as $log) {
                        fputcsv($out, [
                            Carbon::parse($log->created_at)->format('Y-m-d H:i:s'),
                            $log->user?->full_name ?? $log->actor_name ?? 'Sistem',
                            $log->action,
                            $log->ip_address ?? '-',
                        ]);
                    }
                });

            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    private function initials(?string $name): string
    {
        if (! $name) return 'S';
        $words = preg_split('/\s+/', trim($name));
        if (count($words) >= 2) {
            return Str::upper(Str::substr($words[0], 0, 1) . Str::substr($words[1], 0, 1));
        }
        return Str::upper(Str::substr($name, 0, 2));
    }

    private function formatTripCard($trip): array
    {
        $startDate = Carbon::parse($trip->start_date);
        $endDate = Carbon::parse($trip->end_date);
        $duration = (int) $startDate->diffInDays($endDate);

        $joined = (int) DB::table('trip_orders')
            ->where('trip_id', $trip->id)
            ->where('order_status', 'paid')
            ->distinct()
            ->count('user_id');

        $guiderRating = DB::table('user_ratings')
            ->where('rated_user_id', $trip->host_id)
            ->where('type', 'trip_bareng')
            ->avg('rating_amount');
        $guiderReviews = DB::table('user_ratings')
            ->where('rated_user_id', $trip->host_id)
            ->where('type', 'trip_bareng')
            ->count();

        $image = $trip->image;
        if ($image && ! Str::startsWith($image, ['http://', 'https://', '/'])) {
            $image = '/storage/' . $image;
        }

        return [
            'id' => $trip->id,
            'title' => $trip->name,
            'location' => $trip->location,
            'date' => $startDate->format('d M y') . ' - ' . $endDate->format('d M y') . ' (' . $duration . ' Hari)',
            'capacity' => (int) $trip->people_amount,
            'joined_count' => $joined,
            'remaining_seats' => max(0, $trip->people_amount - $joined),
            'rating' => (float) $trip->rating,
            'price' => (float) $trip->price,
            'guide_id' => $trip->guider_id,
            'guide' => $trip->guide_name,
            'guide_avatar' => $trip->profile_image
                ? (Str::startsWith($trip->profile_image, ['http', '/']) ? $trip->profile_image : '/storage/' . $trip->profile_image)
                : '/assets/default-profile.png',
            'guide_rating' => $guiderRating ? number_format($guiderRating, 1) : '0',
            'guide_reviews' => (int) $guiderReviews,
            'guide_badge' => 'Pemandu Ahli',
            'image' => $image ?: '/assets/trip-bareng/list-trip/gunung_bromo/trip_bareng-gunung_bromo-1.jpg',
            'liked' => false,
        ];
    }
}
