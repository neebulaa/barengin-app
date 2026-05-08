<?php

namespace App\Http\Controllers;

use App\Models\Trip;
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
                'image' => '/assets/default-image.png',
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
                'image' => '/assets/default-image.png',
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
                'image' => '/assets/default-image.png',
                'liked' => false,
            ],
            [
                'id' => 4,
                'title' => 'Trip Candi Borobudur',
                'location' => 'Jawa Tengah, Indonesia',
                'date' => '31 Jan 26 - 3 Feb 26 (3 Days)',
                'capacity' => '15/20 orang',
                'rating' => 4.9,
                'reviews' => 120,
                'price' => 4000000,
                'guide' => 'Kings Man',
                'guide_badge' => 'Expert Guide',
                'image' => '/assets/default-image.png',
                'liked' => false,
            ],
            [
                'id' => 5,
                'title' => 'Trip Candi Borobudur',
                'location' => 'Jawa Tengah, Indonesia',
                'date' => '31 Jan 26 - 3 Feb 26 (3 Days)',
                'capacity' => '15/20 orang',
                'rating' => 4.9,
                'reviews' => 120,
                'price' => 4000000,
                'guide' => 'Kings Man',
                'guide_badge' => 'Expert Guide',
                'image' => '/assets/default-image.png',
                'liked' => false,
            ],
            [
                'id' => 6,
                'title' => 'Trip Candi Borobudur',
                'location' => 'Jawa Tengah, Indonesia',
                'date' => '31 Jan 26 - 3 Feb 26 (3 Days)',
                'capacity' => '15/20 orang',
                'rating' => 4.9,
                'reviews' => 120,
                'price' => 4000000,
                'guide' => 'Kings Man',
                'guide_badge' => 'Expert Guide',
                'image' => '/assets/default-image.png',
                'liked' => false,
            ],
            [
                'id' => 7,
                'title' => 'Trip Candi Borobudur',
                'location' => 'Jawa Tengah, Indonesia',
                'date' => '31 Jan 26 - 3 Feb 26 (3 Days)',
                'capacity' => '15/20 orang',
                'rating' => 4.9,
                'reviews' => 120,
                'price' => 4000000,
                'guide' => 'Kings Man',
                'guide_badge' => 'Expert Guide',
                'image' => '/assets/default-image.png',
                'liked' => false,
            ],
        ];

        $all_trips = Trip::all();
        
        return inertia('TripBareng/Index', [
            'trips' => $trips,
            'all_trips' => $all_trips,
        ]);
    }

    public function show($id)
    {
        // Data dummy untuk detail trip
        $trip = [
            'id' => $id,
            'title' => 'Gunung Bromo',
            'location' => 'Jawa Timur, Indonesia',
            'duration' => '5 Hari 4 Malam',
            'date_range' => '1 Januari 2026 00:00 hingga 2 Januari 2026 18:00',
            'joined_count' => 15,
            'capacity' => 20,
            'price' => 3800000,
            'description' => 'Gunung Bromo merupakan gunung berapi aktif setinggi 2.329 mdpl yang mempesona dengan kawah megah berdiameter 800 meter, dikelilingi oleh hamparan Lautan Pasir atau "Pasir Berbisik" seluas 10 kilometer persegi yang unik karena suara desisan anginnya. Kontras dengan lanskap vulkaniknya, sisi selatan kawasan ini menyuguhkan pemandangan asri berupa Padang Savana dan Bukit Teletubbies yang bergelombang hijau, menciptakan perpaduan alam yang dramatis dalam satu kawasan kaldera.',
            'host' => [
                'name' => "King's Man",
                'role' => 'Pemilik',
                'badge' => 'Expert Guide - 50 trip',
                'avatar' => '/assets/default-avatar.png'
            ],
            'itinerary' => [
            [
                'step' => 1,
                'title' => "Penjemputan & Perjalanan Menuju Bromo",
                'time' => "1 Januari 2026, Jam 10:00 - 18:00",
                'desc' => "Tim akan menjemput kamu di titik pertemuan (Bandara/Stasiun di Malang atau Surabaya). Perjalanan dilanjutkan menuju desa terakhir di kaki Gunung Bromo (Cemoro Lawang atau Wonokitri) (Kurang lebih 2 - 3 jam).",
                'images' => [
                    "https://images.unsplash.com/photo-1596825205469-80fb2228a4da?q=80&w=600&auto=format&fit=crop", 
                    "https://images.unsplash.com/photo-1628189679198-4660ebcf8e51?q=80&w=600&auto=format&fit=crop"
                ] 
            ],
            [ 
                'step' => 2, 
                'title' => "Check-in & Makan Malam Lokal", 
                'time' => "1 Januari 2026, Jam 18:00 - 02:00", 
                'desc' => "Tiba di penginapan Hotel Bawangan untuk proses administrasi dan istirahat sejenak sebelum petualangan dini hari dimulai.", 
                'images' => [
                    "https://images.unsplash.com/photo-1551882547-ff40c0d124ba?q=80&w=600&auto=format&fit=crop", 
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                ] 
            ],
            [ 
                'step' => 3, 
                'title' => "Midnight Jeep Adventure", // Diperbaiki dari typo gambar asli agar UI bagus
                'time' => "2 Januari 2026, Jam 02:00 - 05:00", 
                'desc' => "Petualangan dimulai! Kamu akan dibangunkan tengah malam untuk memulai perjalanan menggunakan Jeep 4WD menembus kabut Bromo.", 
                'images' => [
                    "https://images.unsplash.com/photo-1520641151610-c08170e3049b?q=80&w=600&auto=format&fit=crop", 
                    "https://images.unsplash.com/photo-1506016766781-8153ad6c1eec?q=80&w=600&auto=format&fit=crop"
                ] 
            ],
            [
                'step' => 4, 
                'title' => "The Magical Sunrise (Penanjakan)", 
                'time' => "2 Januari 2026, Jam 05:00 - 07:00", 
                'desc' => "Momen paling ikonik! Menunggu matahari terbit dari salah satu titik pandang tertinggi.\n• Spot: Penanjakan 1, Bukit Kedaluh (Kingkong Hill), atau Bukit Cinta.\n• Momen: Melihat gradasi warna langit dan siluet Gunung Bromo yang legendaris.\n• Fotografi: Sesi foto dengan latar belakang Sea of Sand dan Gunung Semeru yang mengeluarkan asap.", 
                'images' => [
                    "https://images.unsplash.com/photo-1605336691456-11f81d8da0d2?q=80&w=600&auto=format&fit=crop", 
                    "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=600&auto=format&fit=crop"
                ] 
            ],
            [
                'step' => 5, 
                'title' => "Pendakian Kawah Bromo & Pura Luhur Poten", 
                'time' => "2 Januari 2026, Jam 07:00 - 09:00", 
                'desc' => "Turun dari puncak menuju Lautan Pasir. Di sini kamu akan merasakan sensasi berdiri di tengah kaldera raksasa dengan menunggangi kuda.", 
                'images' => [
                    "https://images.unsplash.com/photo-1544715568-7b98d27931c8?q=80&w=600&auto=format&fit=crop", 
                    "https://images.unsplash.com/photo-1517529452835-f481c4e16d43?q=80&w=600&auto=format&fit=crop"
                ] 
            ],
            [ 
                'step' => 6, 
                'title' => "Savana & Bukit Teletubbies", 
                'time' => "2 Januari 2026, Jam 09:00 - 10:30", 
                'desc' => "Beralih dari pemandangan gersang ke area hijau yang menyejukkan mata di balik kawah.", 
                'images' => [
                    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600&auto=format&fit=crop", 
                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop"
                ] 
            ],
            [
                'step' => 7, 
                'title' => "Pasir Berbisik", 
                'time' => "2 Januari 2026, Jam 10:30 - 12:00", 
                'desc' => "Destinasi terakhir sebelum meninggalkan kawasan Taman Nasional, tempat di mana angin menciptakan suara unik saat menerpa butiran pasir.", 
                'images' => [
                    "https://images.unsplash.com/photo-1547631317-062e7f33d59e?q=80&w=600&auto=format&fit=crop", 
                    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop"
                ] 
            ],
            [ 
                'step' => 8, 
                'title' => "Check-out & Perjalanan Pulang", 
                'time' => "2 Januari 2026, Jam 12:00 - 16:00", 
                'desc' => "Kembali ke penginapan untuk membersihkan diri dan mengisi energi sebelum perjalanan berakhir.", 
                'images' => [] // Tidak ada gambar di step 8 pada desain
            ]
        ],
            "included" => [
                "Perjalanan bandara",
                "Hotel Bawangan", 
                "Sarapan setiap hari dan makan malam"
            ]
        ];

        return Inertia('TripBareng/Detail', [
            'trip' => $trip,
        ]);
    }

    public function checkout($id)
    {
        // Mock data trip
        $trip_check_out = [
            'id' => $id,
            'title' => 'Trip Gunung Bromo',
            'price' => 3800000,
            'joined_count' => 15,
            'capacity' => 20,
            'remaining_quota' => 4,
            'image' => '/assets/trips/bromo.jpg', // akan ada fallback jika image ga ada
        ];

        return Inertia('TripBareng/Checkout', [
            'trip' => $trip_check_out,
        ]);
    }

    public function payment($id)
    {
        // Mock data pembayaran
        $paymentData = [
            'trip_id' => $id,
            'total_amount' => 199000,
            'due_date' => '14 April 2026, 22:08',
            'bank_name' => 'BCA Virtual Account',
            'va_number' => '123 456 789 123',
        ];

        return Inertia('TripBareng/WaitingPayment', [
            'paymentData' => $paymentData,
        ]);
    }

    public function success($id)
    {
        // Mock data transaksi berhasil
        $order = [
            'transaction_id' => 'OTRIP-000001',
            'trip_title' => 'Trip Gunung Bromo',
            'date_range' => '12 Okt - 17 Okt',
            'quantity' => 1,
            'image' => '/assets/trips/bromo.jpg',
            'friends_waiting' => 7,
        ];

        return Inertia('TripBareng/Success', [
            'order' => $order,
        ]);
    }
    
}
