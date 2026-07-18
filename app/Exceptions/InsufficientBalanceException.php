<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Dilempar saat saldo dompet tidak cukup untuk sebuah pembayaran.
 *
 * Membawa saldo & nominal yang dibutuhkan agar pemanggil bisa menyusun pesan
 * yang berguna ("kurang Rp20.000") tanpa membaca ulang dompet.
 */
class InsufficientBalanceException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly float $balance = 0,
        public readonly float $required = 0,
    ) {
        parent::__construct($message);
    }

    public function shortfall(): float
    {
        return max(0, $this->required - $this->balance);
    }
}
