<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /** Pemetaan nama role -> kolom boolean di tabel users */
    private const ROLE_COLUMNS = [
        'admin' => 'is_admin',
        'guider' => 'is_guider',
    ];

    /**
     * Izinkan akses bila user memiliki salah satu dari role yang diminta.
     *
     * Pemakaian: ->middleware('role:admin') atau ->middleware('role:admin,guider')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403, 'Silakan login terlebih dahulu.');
        }

        foreach ($roles as $role) {
            $column = self::ROLE_COLUMNS[$role] ?? null;
            if ($column && $user->{$column}) {
                return $next($request);
            }
        }

        abort(403, 'Anda tidak memiliki akses ke halaman ini.');
    }
}
