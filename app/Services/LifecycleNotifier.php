<?php

namespace App\Services;

use App\Models\JastipItem;
use App\Models\PergiBareng;
use App\Models\Trip;
use App\Models\UserNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Kabari pengguna tentang perkembangan perjalanan/jastip yang MEREKA IKUTI:
 *  - Trip Bareng   : mulai berlangsung / selesai
 *  - Pergi Bareng  : mulai berlangsung / selesai
 *  - Jastip        : masa pengambilan (waktu ambil) dibuka / selesai
 *
 * Bisa dipakai DUA cara:
 *  1. Terjadwal (cron)  : jalankan run() untuk semua pengguna — command
 *                         `notifications:lifecycle`.
 *  2. Tanpa cron        : freshenForUser() dipanggil saat pengguna membuka /
 *                         polling notifikasi, dibatasi throttle agar tidak jalan
 *                         tiap request. Sepola dengan MidtransController::syncPendingForUser.
 *
 * Aman dijalankan berulang: tiap notifikasi memakai dedupe_key sehingga hanya
 * terkirim sekali per (entitas × event × pengguna). Jendela waktu (beberapa hari
 * terakhir) mencegah "banjir mundur" saat pertama kali dijalankan.
 */
class LifecycleNotifier
{
    /** Hanya transisi dalam rentang ini yang dikabarkan (hindari backfill lama). */
    private const WINDOW_DAYS = 2;

    /** Jarak minimal antar-pemeriksaan per pengguna pada jalur tanpa-cron. */
    private const THROTTLE_MINUTES = 5;

    /**
     * Jalur TANPA CRON: segarkan notifikasi lifecycle milik satu pengguna,
     * dibatasi agar tak jalan tiap request. Cache::add() bersifat atomik —
     * hanya request pertama dalam jendela throttle yang mengembalikan true.
     */
    public static function freshenForUser(int $userId): void
    {
        if (! $userId) {
            return;
        }

        if (! Cache::add("lifecycle:user:{$userId}", 1, now()->addMinutes(self::THROTTLE_MINUTES))) {
            return; // sudah diperiksa baru-baru ini
        }

        try {
            (new self())->run($userId);
        } catch (\Throwable $e) {
            // Tidak boleh menggagalkan request notifikasi hanya karena penyegaran ini.
            Log::warning('[LIFECYCLE] Gagal menyegarkan untuk user ' . $userId . ': ' . $e->getMessage());
        }
    }

    /**
     * Pindai entitas & kirim notifikasi lifecycle.
     *
     * @param int|null $onlyUserId Bila diisi, hanya kirim ke pengguna itu (jalur
     *                             tanpa-cron); bila null, ke semua peserta (cron).
     * @return int Jumlah notifikasi yang benar-benar terkirim.
     */
    public function run(?int $onlyUserId = null): int
    {
        return $this->tripBareng($onlyUserId)
            + $this->pergiBareng($onlyUserId)
            + $this->jastip($onlyUserId);
    }

    // ── Trip Bareng ──────────────────────────────────────────────────────
    private function tripBareng(?int $onlyUserId): int
    {
        $sent = 0;
        $since = Carbon::today()->subDays(self::WINDOW_DAYS);

        // Berlangsung: baru saja memasuki tanggal mulai.
        Trip::where('status', Trip::STATUS_ONGOING)
            ->whereDate('start_date', '>=', $since)
            ->get()
            ->each(function (Trip $trip) use (&$sent, $onlyUserId) {
                $sent += $this->notifyTripBuyers($trip, 'activity.trip_ongoing', $onlyUserId);
            });

        // Selesai: status done karena tanggal lewat, atau diselesaikan manual.
        Trip::where('status', Trip::STATUS_DONE)
            ->where(function ($q) use ($since) {
                $q->whereDate('end_date', '>=', $since)
                    ->orWhere('finished_at', '>=', $since);
            })
            ->get()
            ->each(function (Trip $trip) use (&$sent, $onlyUserId) {
                $sent += $this->notifyTripBuyers($trip, 'activity.trip_finished', $onlyUserId);
            });

        return $sent;
    }

    /** Kirim ke pembeli (order lunas) pada run trip yang sedang berjalan. */
    private function notifyTripBuyers(Trip $trip, string $type, ?int $onlyUserId): int
    {
        $runKey = optional($trip->current_run_started_at)->timestamp ?? 0;

        $userIds = DB::table('trip_orders')
            ->where('trip_id', $trip->id)
            ->where('order_status', 'paid')
            ->when(
                $trip->current_run_started_at,
                fn ($q) => $q->where('created_at', '>=', $trip->current_run_started_at),
            )
            ->distinct()
            ->pluck('user_id');

        return $this->dispatch(
            $this->filterRecipients($userIds, $onlyUserId),
            $type,
            ['name' => $trip->name],
            '/trip-bareng/' . $trip->id,
            fn ($uid) => $type . ':trip:' . $trip->id . ':run:' . $runKey . ':user:' . $uid,
        );
    }

    // ── Pergi Bareng ─────────────────────────────────────────────────────
    private function pergiBareng(?int $onlyUserId): int
    {
        $sent = 0;
        $since = Carbon::now()->subDays(self::WINDOW_DAYS);

        // Berlangsung: jam janji sudah lewat (baru-baru ini) & belum diselesaikan.
        PergiBareng::with('pergi_bareng_participants')
            ->whereNull('finished_at')
            ->where('time_appointment', '<=', Carbon::now())
            ->where('time_appointment', '>=', $since)
            ->get()
            ->each(function (PergiBareng $pb) use (&$sent, $onlyUserId) {
                $sent += $this->notifyPergiParticipants($pb, 'activity.pergi_bareng_ongoing', $onlyUserId);
            });

        // Selesai: penyelenggara menandai selesai baru-baru ini.
        PergiBareng::with('pergi_bareng_participants')
            ->whereNotNull('finished_at')
            ->where('finished_at', '>=', $since)
            ->get()
            ->each(function (PergiBareng $pb) use (&$sent, $onlyUserId) {
                $sent += $this->notifyPergiParticipants($pb, 'activity.pergi_bareng_finished', $onlyUserId);
            });

        return $sent;
    }

    private function notifyPergiParticipants(PergiBareng $pb, string $type, ?int $onlyUserId): int
    {
        $userIds = $pb->pergi_bareng_participants->pluck('user_id')->filter()->unique();

        return $this->dispatch(
            $this->filterRecipients($userIds, $onlyUserId),
            $type,
            ['name' => $pb->name],
            '/pergi-bareng/' . $pb->id,
            fn ($uid) => $type . ':pb:' . $pb->id . ':user:' . $uid,
        );
    }

    // ── Jastip ───────────────────────────────────────────────────────────
    private function jastip(?int $onlyUserId): int
    {
        $sent = 0;
        $since = Carbon::today()->subDays(self::WINDOW_DAYS);

        // Produk yang jendela pengambilannya baru dibuka atau baru berakhir.
        JastipItem::where('status', JastipItem::STATUS_PUBLISHED)
            ->where(function ($q) use ($since) {
                $q->whereDate('pickup_start_date', '>=', $since)
                    ->orWhereDate('pickup_end_date', '>=', $since);
            })
            ->get()
            ->each(function (JastipItem $item) use (&$sent, $onlyUserId) {
                $status = $item->lifecycleStatus();

                if ($status === 'pickup') {
                    $sent += $this->notifyJastipBuyers($item, 'activity.jastip_pickup', $onlyUserId);
                } elseif ($status === 'finish') {
                    $sent += $this->notifyJastipBuyers($item, 'activity.jastip_finished', $onlyUserId);
                }
            });

        return $sent;
    }

    private function notifyJastipBuyers(JastipItem $item, string $type, ?int $onlyUserId): int
    {
        $userIds = DB::table('jastip_order_items as joi')
            ->join('jastip_orders as jo', 'jo.id', '=', 'joi.jastip_order_id')
            ->join('transactions as t', 't.id', '=', 'jo.transaction_id')
            ->where('joi.jastip_item_id', $item->id)
            ->where('jo.order_status', 'paid')
            ->distinct()
            ->pluck('t.user_id');

        return $this->dispatch(
            $this->filterRecipients($userIds, $onlyUserId),
            $type,
            ['name' => $item->name],
            '/jastip/' . $item->id,
            fn ($uid) => $type . ':jastip:' . $item->id . ':user:' . $uid,
        );
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    /** Pada jalur tanpa-cron, saring penerima ke satu pengguna saja. */
    private function filterRecipients($userIds, ?int $onlyUserId)
    {
        $ids = collect($userIds)->map(fn ($id) => (int) $id)->filter()->unique();

        if ($onlyUserId !== null) {
            return $ids->contains($onlyUserId) ? collect([$onlyUserId]) : collect();
        }

        return $ids;
    }

    private function dispatch($userIds, string $type, array $data, string $url, callable $dedupeKey): int
    {
        $count = 0;
        foreach ($userIds as $uid) {
            $n = UserNotification::send((int) $uid, $type, $data, $url, $dedupeKey($uid));
            if ($n) {
                $count++;
            }
        }

        return $count;
    }
}
