<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'indonesia',
            'landscape indah',
            'jepang',
            'kota maju',
            'pet',
            'malay malay',
            'tempat ajaib dunia',
            'kota keju',
            'kuliner',
            'pantai',
            'gunung',
            'city walk',
            'budget trip',
            'hidden gem',
            'itinerary',
            'transport',
            'tips',
            'staycation',
            'nature',
            'culture',
        ];

        foreach ($tags as $t) {
            Tag::firstOrCreate(['tag_name' => $t, 'tag_key' => mb_strtolower($t)]);
        }
    }
}