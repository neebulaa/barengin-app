<?php

namespace App\Models;

use App\Exceptions\InsufficientBalanceException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Wallet extends Model
{
    protected $fillable = ['user_id', 'balance'];

    protected function casts()
    {
        return ['balance' => 'decimal:2'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wallet_transactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function wallet_topups()
    {
        return $this->hasMany(WalletTopup::class);
    }

    /** Dompet milik user, dibuat saat pertama kali dibutuhkan. */
    public static function forUser(int $userId): self
    {
        return self::firstOrCreate(['user_id' => $userId], ['balance' => 0]);
    }

    public function hasSufficientBalance(float $amount): bool
    {
        return (float) $this->balance >= $amount;
    }

    /**
     * Tambah saldo sekaligus mencatat mutasinya. Idempotent terhadap
     * (source_type, source_id): webhook Midtrans bisa datang berkali-kali untuk
     * pembayaran yang sama, dan saldo tidak boleh bertambah dua kali.
     * Mengembalikan true bila saldo benar-benar bertambah.
     */
    public function credit(float $amount, string $description, ?string $sourceType = null, ?int $sourceId = null): bool
    {
        return DB::transaction(function () use ($amount, $description, $sourceType, $sourceId) {
            if ($sourceType && $sourceId) {
                $exists = WalletTransaction::where('source_type', $sourceType)
                    ->where('source_id', $sourceId)
                    ->where('type', 'credit')
                    ->lockForUpdate()
                    ->exists();

                if ($exists) {
                    return false;
                }
            }

            WalletTransaction::create([
                'wallet_id' => $this->id,
                'type' => 'credit',
                'amount' => $amount,
                'description' => $description,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
            ]);

            $this->newQuery()->whereKey($this->id)->increment('balance', $amount);
            $this->refresh();

            $this->notifyBalanceChange('wallet.credited', $amount, $description, $sourceType, $sourceId);

            return true;
        });
    }

    /**
     * Kurangi saldo untuk sebuah pembelian, sekaligus mencatat mutasinya.
     *
     * Idempotent terhadap (source_type, source_id) seperti credit(), sehingga
     * percobaan bayar ulang atas pesanan yang sama tidak memotong saldo dua kali
     * (mengembalikan false). Saldo dibaca ulang di dalam kunci baris agar dua
     * permintaan yang datang bersamaan tidak bisa membelanjakan saldo yang sama.
     *
     * @throws InsufficientBalanceException bila saldo tidak mencukupi.
     */
    public function debit(float $amount, string $description, ?string $sourceType = null, ?int $sourceId = null): bool
    {
        return DB::transaction(function () use ($amount, $description, $sourceType, $sourceId) {
            if ($sourceType && $sourceId) {
                $exists = WalletTransaction::where('source_type', $sourceType)
                    ->where('source_id', $sourceId)
                    ->where('type', 'debit')
                    ->lockForUpdate()
                    ->exists();

                if ($exists) {
                    return false;
                }
            }

            // Kunci baris dompet: saldo yang dipakai untuk memutuskan harus saldo
            // yang sama dengan yang dikurangi, bukan hasil baca sebelum menunggu.
            $fresh = self::whereKey($this->id)->lockForUpdate()->first();

            if (! $fresh || (float) $fresh->balance < $amount) {
                throw new InsufficientBalanceException(
                    'Saldo dompet tidak mencukupi.',
                    (float) ($fresh->balance ?? 0),
                    $amount,
                );
            }

            WalletTransaction::create([
                'wallet_id' => $this->id,
                'type' => 'debit',
                'amount' => $amount,
                'description' => $description,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
            ]);

            $this->newQuery()->whereKey($this->id)->decrement('balance', $amount);
            $this->refresh();

            $this->notifyBalanceChange('wallet.debited', $amount, $description, $sourceType, $sourceId);

            return true;
        });
    }

    /**
     * Kabari pemilik dompet bahwa saldonya berubah.
     *
     * Dipanggil dari credit()/debit() — bukan dari masing-masing pemanggil —
     * supaya setiap perubahan saldo dari sumber mana pun pasti terkabarkan, dan
     * tepat sekali: keduanya sudah menjaga agar mutasi dari sumber yang sama
     * tidak dibuat dua kali, sehingga baris ini hanya tercapai saat saldo benar-
     * benar berubah. Kunci dedupe tetap dipasang sebagai jaring pengaman untuk
     * webhook Midtrans yang datang bersamaan.
     */
    private function notifyBalanceChange(
        string $type,
        float $amount,
        string $description,
        ?string $sourceType,
        ?int $sourceId,
    ): void {
        UserNotification::send(
            (int) $this->user_id,
            $type,
            [
                'amount' => $amount,
                'name' => $description,
                'balance' => (float) $this->balance,
            ],
            '/profile-history',
            $sourceType && $sourceId
                ? $type . ':' . $sourceType . ':' . $sourceId
                : null,
        );
    }
}
