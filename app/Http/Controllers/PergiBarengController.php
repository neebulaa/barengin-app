<?php

namespace App\Http\Controllers;

use App\Models\PergiBareng;
use App\Models\PergiBarengParticipant;
use App\Models\PergiBarengRating;
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

        // Hitung rata-rata rating trip ini dari tabel PergiBarengRating
        $avgRating = $trip->pergi_bareng_ratings->avg('amount_rating') ?? 0;
        $totalReviews = $trip->pergi_bareng_ratings->count();

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
                'name' => $trip->initiator->name ?? 'Bagus Arya',
                // Cek apakah user punya profil image, jika tidak pakai default
                'avatar' => $trip->initiator->profile_photo_url ?? '/assets/default-avatar.png',
                'rating' => number_format($avgRating, 1), 
                'reviews' => $totalReviews,
                'verified' => true,
            ],
            // Data Partisipan
            'participants' => $trip->pergi_bareng_participants->map(function ($p) {
                return [
                    'name' => $p->full_name,
                    'age' => 20, // Belum ada field umur di DB, kita buat statis dulu
                    'rating' => 5.0, 
                    // Mengambil avatar dari relasi User jika partisipan tersebut memiliki akun
                    'avatar' => $p->user ? ($p->user->profile_photo_url ?? '/assets/default-avatar.png') : '/assets/default-avatar.png',
                    'verified' => $p->user_id ? true : false // Verified jika dia adalah registered user
                ];
            }),
        ];
    }
    
    public function index()
    {
        // 1. Ambil data trip dari database beserta relasinya
        $trips = PergiBareng::with(['initiator', 'pergi_bareng_participants', 'pergi_bareng_ratings'])
            ->latest() // Urutkan dari yang terbaru
            ->get();

        // 2. Format data agar sesuai dengan props yang diminta oleh PergiBarengCard.jsx di React
        $formattedTrips = $trips->map(function ($trip) {
            $parsedDate = $trip->time_appointment;
            
            // Hitung rating
            $avgRating = $trip->pergi_bareng_ratings->avg('amount_rating') ?? 0;
            $totalReviews = $trip->pergi_bareng_ratings->count();
            
            // Hitung kursi
            $joined = $trip->pergi_bareng_participants->count();
            
            // Logika icon transportasi (sesuaikan string 'car' atau 'train')
            $transportIcon = 'car';
            if (str_contains(strtolower($trip->transportation), 'umum')) {
                $transportIcon = 'train';
            }

            return [
                'id' => $trip->id,
                // Jika belum ada gambar upload, gunakan dummy
                'image' => $trip->img_name ? '/storage/' . $trip->img_name : '/assets/terminal-cibubur.jpg', 
                'title' => $trip->name,
                'address' => $trip->departure_loc,
                'date' => $parsedDate->translatedFormat('d M y'), // ex: 31 Jan 26
                'time' => $parsedDate->format('H:i'), // ex: 09:00
                'capacity' => $joined . '/' . $trip->people_amount . ' Orang',
                'remainingSeats' => max(0, $trip->people_amount - $joined),
                'user' => [
                    'name' => $trip->initiator->name ?? 'Penyelenggara',
                    'avatar' => $trip->initiator->profile_photo_url ?? '/assets/default-avatar.png',
                    'rating' => number_format($avgRating, 1),
                    'reviews' => $totalReviews,
                    'verified' => true, // Default true untuk saat ini
                ],
                'transportType' => $trip->transportation,
                'transportIcon' => $transportIcon,
                'href' => '/pergi-bareng/' . $trip->id,
            ];
        });

        // 3. Kirim data ke halaman Index.jsx
        return Inertia::render('PergiBareng/Index', [
            'trips' => $formattedTrips
        ]);
    }

    public function show($id)
    {
        // Load relasi termasuk data 'user' di dalam participants dan 'pergi_bareng_ratings'
        $trip = PergiBareng::with([
            'initiator', 
            'pergi_bareng_participants.user', 
            'pergi_bareng_ratings'
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
            'pergi_bareng_ratings'
        ])->findOrFail($id);
        
        return Inertia::render('PergiBareng/Join', [
            'trip' => $this->formatTripData($trip)
        ]);
    }

    public function store(Request $request, $id)
    {
        // 1. Pastikan trip-nya ada
        $trip = PergiBareng::findOrFail($id);

        // 2. Validasi inputan dari React (Pastikan nama variabel dari React cocok dengan ini)
        // Asumsi dari React mengirim array bernama 'participants'
        $request->validate([
            'participants' => 'required|array',
            'participants.*.nama' => 'required|string', 
            'participants.*.paspor' => 'nullable|string|max:12',
            'participants.*.telepon' => 'required|string|max:15',
            'participants.*.nik' => 'required|string|max:16',
        ]);

        // 3. Looping data peserta dan simpan ke database TANPA user_id
        foreach ($request->participants as $participant) {
            PergiBarengParticipant::create([
                'pergi_bareng_id' => $trip->id,
                
                // Kiri = nama kolom di database Anda | Kanan = nama variabel dari React Anda
                'full_name' => $participant['nama'], 
                'paspor' => $participant['paspor'] ?? null,
                'phone_number' => $participant['telepon'],
                'nik' => $participant['nik'],
            ]);
        }

        // 4. Redirect ke halaman sukses
        return redirect()->route('pergi-bareng.success', $trip->id);
    }

    public function success($id)
    {
        $trip = PergiBareng::with([
            'initiator', 
            'pergi_bareng_participants.user',
            'pergi_bareng_ratings'
        ])->findOrFail($id);
        
        return Inertia::render('PergiBareng/Success', [
            'trip' => $this->formatTripData($trip)
        ]);
    }
}