<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PergiBareng;

class PergiBarengSeeder extends Seeder
{
    public function run(): void
    {
        
        $user = User::where('username', 'budibareng')->first();
        
        if ($user) {
            PergiBareng::create([
                'initiator_id' => $user->id,
                'name' => 'Bandara Soekarno Hatta',
                'description' => 'Halo guys! Aku sedang mencari teman barengan untuk perjalanan ke kota bogor. Kondisi mobil bersih dan nyaman.',
                'time_appointment' => '2026-07-31 09:00:00',
                'transportation' => 'Mobil Pribadi',
                'people_amount' => 5,
                'departure_loc' => 'Jl. Pakuan No.3, Sumur Batu, Kec. Babakan Madang, Kabupaten Bogor, Jawa Barat 16810, Indonesia',
                'destination_loc' => 'Bandara Soekarno Hatta'
            ]);
        }
    }
}