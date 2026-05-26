<?php

namespace App\Http\Controllers;

use App\Models\PergiBareng;
use App\Models\PergiBarengParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PergiBarengController extends Controller
{
    /**
     * Helper untuk memformat data DB agar pas dengan UI React
     */
    private function formatTripData($trip)
    {
        $parsedDate = $trip->time_appointment;

        // KARENA RATING MILIK USER, KITA BUAT STATIS DULU SEMENTARA
        $avgRating = 5.0; 
        $totalReviews = 10;

        return [
            'id' => $trip->id,
            'trip_id' => 'PERBAR-' . str_pad($trip->id, 6, '0', STR_PAD_LEFT),
            'title' => $trip->name,
            'date' => $parsedDate->translatedFormat('d M Y'),
            'time' => $parsedDate->format('H:i'),
            'capacity' => $trip->people_amount,
            'joined' => $trip->pergi_bareng_participants->count(),
            'description' => $trip->description,
            'details' => [
                'titik_kumpul' => $trip->departure_loc,
                'titik_tujuan' => $trip->destination_loc,
                'transportasi' => $trip->transportation,
                'jam_kumpul' => $parsedDate->format('H:i'),
            ],
            // Data Penyelenggara / Initiator
            'organizer' => [
                // PERBAIKAN: Gunakan full_name
                'name' => $trip->initiator->full_name ?? 'Bagus Arya',
                'avatar' => $trip->initiator->profile_photo_url ?? '/assets/default-avatar.png',
                'rating' => number_format($avgRating, 1), 
                'reviews' => $totalReviews,
                'verified' => true,
            ],
            // Data Partisipan
            'participants' => $trip->pergi_bareng_participants->map(function ($p) {
                return [
                    'name' => $p->full_name,
                    'age' => 20, 
                    'rating' => 5.0, 
                    'avatar' => $p->user ? ($p->user->profile_photo_url ?? '/assets/default-avatar.png') : '/assets/default-avatar.png',
                    'verified' => $p->user_id ? true : false 
                ];
            }),
        ];
    }
    
    public function index()
    {   
        
        // 1. Ambil data trip dari database beserta relasinya (TANPA pergi_bareng_ratings)
        $trips = PergiBareng::with(['initiator', 'pergi_bareng_participants'])
            ->latest() 
            ->get();
        
        // 2. Format data
        $formattedTrips = $trips->map(function ($trip) {
            $parsedDate = $trip->time_appointment;
            
            // Rating statis sementara
            $avgRating = 5.0;
            $totalReviews = 10;
            
            // Hitung kursi
            $joined = $trip->pergi_bareng_participants->count();
            
            // Logika icon transportasi
            $transportIcon = 'car';
            if (str_contains(strtolower($trip->transportation), 'umum')) {
                $transportIcon = 'train';
            }

            return [
                'id' => $trip->id,
                'image' => $trip->img_name ? '/storage/' . $trip->img_name : '/assets/terminal-cibubur.jpg', 
                'title' => $trip->name,
                'address' => $trip->departure_loc,
                'date' => $parsedDate->translatedFormat('d M y'), 
                'time' => $parsedDate->format('H:i'), 
                'capacity' => $joined . '/' . $trip->people_amount . ' Orang',
                'remainingSeats' => max(0, $trip->people_amount - $joined),
                'user' => [
                    // PERBAIKAN: Gunakan full_name
                    'name' => $trip->initiator->full_name ?? 'Penyelenggara',
                    'avatar' => $trip->initiator->profile_photo_url ?? '/assets/default-avatar.png',
                    'rating' => number_format($avgRating,1),
                    'reviews' => $totalReviews,
                    'verified' => true, 
                ],
                'transportType' => $trip->transportation,
                'transportIcon' => $transportIcon,
                'href' => '/pergi-bareng/' . $trip->id,
            ];
        });
        
        // 3. Kirim data ke halaman Index.jsx
       return Inertia::render('PergiBareng/Index', [
            // Tambahkan ->values()->toArray() di sini!
            'trips' => $formattedTrips->values()->toArray() 
        ]);
    }

    public function show($id)
    {
        $trip = PergiBareng::with([
            'initiator', 
            'pergi_bareng_participants.user', 
        ])->findOrFail($id);
        
        return Inertia::render('PergiBareng/Show', [
            'trip' => $this->formatTripData($trip)
        ]);
    }

    public function join($id)
    {
        $trip = PergiBareng::with([
            'initiator', 
            'pergi_bareng_participants.user',
        ])->findOrFail($id);
        
        return Inertia::render('PergiBareng/Join', [
            'trip' => $this->formatTripData($trip)
        ]);
    }

    public function store(Request $request, $id)
    {
        $trip = PergiBareng::findOrFail($id);

        $request->validate([
            'participants' => 'required|array',
            'participants.*.nama' => 'required|string', 
            'participants.*.paspor' => 'nullable|string|max:12',
            'participants.*.telepon' => 'required|string|max:15',
            'participants.*.nik' => 'required|string|max:16',
        ]);

        foreach ($request->participants as $participant) {
            PergiBarengParticipant::create([
                'pergi_bareng_id' => $trip->id,
                'full_name' => $participant['nama'], 
                'paspor' => $participant['paspor'] ?? null,
                'phone_number' => $participant['telepon'],
                'nik' => $participant['nik'],
            ]);
        }

        return redirect()->route('pergi-bareng.success', $trip->id);
    }

    public function success($id)
    {
        $trip = PergiBareng::with([
            'initiator', 
            'pergi_bareng_participants.user',
        ])->findOrFail($id);
        
        return Inertia::render('PergiBareng/Success', [
            'trip' => $this->formatTripData($trip)
        ]);
    }
}