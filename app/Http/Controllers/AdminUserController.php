<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    // 1. Tampilkan halaman daftar user
    public function index()
    {
        return Inertia::render('Admin/ManagementUser', [
            'users' => User::all()
        ]);
    }

    // 2. Tampilkan halaman edit role user
    public function edit($id)
    {
        $user = User::findOrFail($id);
        
        return Inertia::render('Admin/EditUser', [
            'user' => $user
        ]);
    }

    // 3. Simpan perubahan (Update role & verifikasi)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // Update role & verified status langsung ke kolom is_verified
        $user->update([
            'is_admin' => $request->is_admin,
            'is_guider' => $request->is_guider,
            'is_verified' => $request->verified,
        ]);

        ActivityLog::record('Mengubah izin pengguna: ' . $user->full_name);

        return redirect()->route('management-user')->with('success_message', 'Pengguna berhasil diperbarui!');
    }

    // 4. Hapus user
    public function destroy($id)
    {
        $user = User::find($id);
        User::destroy($id);

        ActivityLog::record('Menghapus pengguna: ' . ($user?->full_name ?? "#$id"));
        
        return redirect()->back()->with('success_message', 'Pengguna berhasil dihapus!');
    }
}