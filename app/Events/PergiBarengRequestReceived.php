<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Lencana "ada permintaan gabung" di halaman managemen memerah seketika, tanpa
// menunggu tick polling 15 detik.
//
// Disiarkan ke channel pribadi penyelenggara (user.{id}) yang otorisasinya sudah
// ada di routes/channels.php - tidak perlu channel baru. ShouldBroadcastNow
// (bukan ShouldBroadcast) karena app ini tidak menjalankan queue worker.
class PergiBarengRequestReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $initiatorId,
        public int $pergiBarengId,
        public int $pending,
    ) {
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->initiatorId)];
    }

    public function broadcastAs(): string
    {
        return 'pergi.request.received';
    }

    public function broadcastWith(): array
    {
        return [
            'pergi_bareng_id' => $this->pergiBarengId,
            // Jumlah terkini, bukan sekadar "+1", supaya beberapa permintaan yang
            // datang bersamaan tidak membuat lencana salah hitung.
            'pending' => $this->pending,
        ];
    }
}
