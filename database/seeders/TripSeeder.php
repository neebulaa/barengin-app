<?php

namespace Database\Seeders;

use App\Models\Trip;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TripSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Trip::create([
            "name" => "Trip Gunung Bromo",
            "description" => "Explore the stunning landscapes of Mount Bromo with our guided tour.",
            "people_amount" => 20,
            "start_date" => "2023-01-02",
            "end_date" => "2023-01-07",
            "rating" => 4.5,
            "price" => 3800000,
            "image" => "/assets/default-image.png"
        ]);

        Trip::create([
            "name" => "Trip Gunung Bromo",
            "description" => "Explore the stunning landscapes of Mount Bromo with our guided tour.",
            "people_amount" => 20,
            "start_date" => "2023-01-02",
            "end_date" => "2023-01-07",
            "rating" => 4.5,
            "price" => 3800000,
            "image" => "/assets/default-image.png"
        ]);

        Trip::factory()->count(100)->create();
    }
}
