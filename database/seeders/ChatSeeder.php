<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::query()->take(3)->get();

        if ($users->count() < 3) {
            User::factory()->count(3 - $users->count())->create();
            $users = User::query()->take(3)->get();
        }

        [$u1, $u2, $u3] = $users->values();

        // 1) Personal conversation u1 <-> u2
        $personal = Conversation::create([
            'trip_id' => null,
            'pergi_bareng_id' => null,
            'is_group' => false,
        ]);

        $personal->participants()->attach($u1->id, ['last_read_at' => now()->subMinutes(30)]);
        $personal->participants()->attach($u2->id, ['last_read_at' => now()->subMinutes(5)]);

        Message::create([
            'conversation_id' => $personal->id,
            'sender_id' => $u2->id,
            'message_text' => 'Halo, ini pesan dari u2 ke u1 (harusnya unread untuk u1).',
            'created_at' => now()->subMinutes(10),
            'updated_at' => now()->subMinutes(10),
        ]);

        Message::create([
            'conversation_id' => $personal->id,
            'sender_id' => $u1->id,
            'message_text' => 'Balasan dari u1 ke u2.',
            'created_at' => now()->subMinutes(8),
            'updated_at' => now()->subMinutes(8),
        ]);

        Message::create([
            'conversation_id' => $personal->id,
            'sender_id' => $u2->id,
            'message_text' => 'Pesan terbaru dari u2, harusnya unread untuk u1 kalau last_read_at u1 lebih lama.',
            'created_at' => now()->subMinutes(2),
            'updated_at' => now()->subMinutes(2),
        ]);

        $group = Conversation::create([
            'trip_id' => null,
            'pergi_bareng_id' => null,
            'is_group' => true,
        ]);

        $group->participants()->attach($u1->id, ['last_read_at' => now()->subMinutes(60)]);
        $group->participants()->attach($u2->id, ['last_read_at' => now()->subMinutes(1)]);
        $group->participants()->attach($u3->id, ['last_read_at' => null]);

        Message::create([
            'conversation_id' => $group->id,
            'sender_id' => $u3->id,
            'message_text' => 'Halo group! (unread untuk u1 jika last_read_at lama).',
            'created_at' => now()->subMinutes(20),
            'updated_at' => now()->subMinutes(20),
        ]);

        Message::create([
            'conversation_id' => $group->id,
            'sender_id' => $u2->id,
            'message_text' => 'Info terbaru group.',
            'created_at' => now()->subMinutes(3),
            'updated_at' => now()->subMinutes(3),
        ]);
    
    }
}
