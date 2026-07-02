<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        Language::updateOrCreate(
            ['code' => 'id'],
            ['name' => 'Indonesia', 'native_name' => 'Bahasa Indonesia', 'is_active' => true, 'is_default' => true, 'sort_order' => 1]
        );

        Language::updateOrCreate(
            ['code' => 'en'],
            ['name' => 'English', 'native_name' => 'English', 'is_active' => true, 'is_default' => false, 'sort_order' => 2]
        );

        Language::updateOrCreate(
            ['code' => 'ms'],
            ['name' => 'Malaysia', 'native_name' => 'Bahasa Melayu', 'is_active' => true, 'is_default' => false, 'sort_order' => 3]
        );
    }
}
