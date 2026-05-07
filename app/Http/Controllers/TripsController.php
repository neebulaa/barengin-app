<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TripsController extends Controller
{
    public function index()
    {
        // data dummy dulu (nanti bisa diganti dari DB)
        $trips = [
            [
                'id' => 1,
                'title' => 'Trip Gunung Bromo',
                'location' => 'Jawa Timur, Indonesia',
                'date' => '31 Jan 26 - 3 Feb 26 (3 Days)',
                'capacity' => '15/20 orang',
                'rating' => 4.9,
                'reviews' => 120,
                'price' => 8000000,
                'guide' => 'Kings Man',
                'guide_badge' => 'Expert Guide',
                'image' => '/assets/trips/bromo.jpg',
                'liked' => false,
            ],
            [
                'id' => 2,
                'title' => 'Trip Pulau Dewata',
                'location' => 'Bali, Indonesia',
                'date' => '31 Jan 26 - 3 Feb 26 (3 Days)',
                'capacity' => '15/20 orang',
                'rating' => 4.9,
                'reviews' => 120,
                'price' => 12000000,
                'guide' => 'Kings Man',
                'guide_badge' => 'Expert Guide',
                'image' => '/assets/trips/bali.jpg',
                'liked' => false,
            ],
            [
                'id' => 3,
                'title' => 'Trip Candi Borobudur',
                'location' => 'Jawa Tengah, Indonesia',
                'date' => '31 Jan 26 - 3 Feb 26 (3 Days)',
                'capacity' => '15/20 orang',
                'rating' => 4.9,
                'reviews' => 120,
                'price' => 4000000,
                'guide' => 'Kings Man',
                'guide_badge' => 'Expert Guide',
                'image' => '/assets/trips/borobudur.jpg',
                'liked' => false,
            ],
        ];

        return Inertia::render('TripBareng/Index', [
            'trips' => $trips,
        ]);
    }
}
