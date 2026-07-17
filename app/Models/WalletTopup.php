<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Satu permintaan isi saldo lewat Midtrans. Saat lunas, MidtransController
 * mengkredit dompet dengan sumber (wallet_topup, id) sehingga webhook yang
 * datang berkali-kali tidak menambah saldo dua kali.
 */
class WalletTopup extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PAID = 'paid';
    public const STATUS_UNPAID = 'unpaid';

    protected $fillable = ['wallet_id', 'transaction_id', 'amount', 'status'];

    protected function casts()
    {
        return ['amount' => 'decimal:2'];
    }

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
}
