<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // ambil semua conversation milik user + last message
        $conversations = $user->conversations()
            ->with([
                'participants:id,name,profile_image',
                'trip:id,title',
                'pergi_bareng:id,title',
            ])
            ->withMax('messages', 'created_at')
            ->get()
            ->map(function ($c) use ($user) {
                $lastMessage = $c->messages()
                    ->latest()
                    ->with('sender:id,name,profile_image')
                    ->first();

                $title = $c->is_group
                    ? ($c->trip?->title ?? $c->pergi_bareng?->title ?? 'Group')
                    : optional($c->participants->firstWhere('id', '!=', $user->id))->name;

                return [
                    'id' => $c->id,
                    'is_group' => (bool) $c->is_group,
                    'title' => $title ?? 'Chat',
                    'participants' => $c->participants->map(fn ($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'avatar' => $p->public_profile_image ?? asset('assets/default-profile.png'),
                    ]),
                    'last_message' => $lastMessage ? [
                        'id' => $lastMessage->id,
                        'text' => $lastMessage->message_text,
                        'created_at' => $lastMessage->created_at?->toISOString(),
                        'sender' => [
                            'id' => $lastMessage->sender?->id,
                            'name' => $lastMessage->sender?->name,
                        ]
                    ] : null,
                    'last_message_at' => optional($lastMessage?->created_at)->toISOString(),
                ];
            })
            ->sortByDesc(fn ($c) => $c['last_message_at'])
            ->values();

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
            'activeConversation' => null,
            'messages' => [],
        ]);
    }

    public function show(Conversation $conversation)
    {
        $user = Auth::user();

        abort_unless(
            $conversation->participants()->where('users.id', $user->id)->exists(),
            403,
            'You are not a participant of this conversation.'
        );

        $conversations = $this->sidebarConversations($user);

        $conversation->load([
            'participants:id,name,profile_image',
            'trip:id,title',
            'pergi_bareng:id,title',
        ]);

        $messages = $conversation->messages()
            ->with('sender:id,name,profile_image')
            ->orderBy('created_at')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'conversation_id' => $m->conversation_id,
                'sender_id' => $m->sender_id,
                'text' => $m->message_text,
                'created_at' => $m->created_at?->toISOString(),
                'sender' => [
                    'id' => $m->sender?->id,
                    'name' => $m->sender?->name,
                    'avatar' => $m->sender?->public_profile_image ?? asset('assets/default-profile.png'),
                ],
            ]);

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
            'activeConversation' => [
                'id' => $conversation->id,
                'is_group' => (bool) $conversation->is_group,
                'title' => $conversation->is_group
                    ? ($conversation->trip?->title ?? $conversation->pergi_bareng?->title ?? 'Group')
                    : optional($conversation->participants->firstWhere('id', '!=', $user->id))->name,
                'participants' => $conversation->participants->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'avatar' => $p->public_profile_image ?? asset('assets/default-profile.png'),
                ]),
            ],
            'messages' => $messages,
        ]);
    }

    public function storeMessage(Request $request, Conversation $conversation)
    {
        $user = Auth::user();

        abort_unless(
            $conversation->participants()->where('users.id', $user->id)->exists(),
            403,
            'You are not a participant of this conversation.'
        );

        $data = $request->validate([
            'message_text' => ['required', 'string', 'max:5000'],
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'message_text' => $data['message_text'],
        ]);

        $message->load('sender:id,name,profile_image');

        // broadcast realtime ke semua participant kecuali pengirim
        broadcast(new MessageSent($message))->toOthers();

        return back()->with('success', 'Message sent');
    }

    private function sidebarConversations($user)
    {
        return $user->conversations()
            ->with(['participants:id,name,profile_image', 'trip:id,title', 'pergi_bareng:id,title'])
            ->get()
            ->map(function ($c) use ($user) {
                $lastMessage = $c->messages()->latest()->with('sender:id,name')->first();

                $title = $c->is_group
                    ? ($c->trip?->title ?? $c->pergi_bareng?->title ?? 'Group')
                    : optional($c->participants->firstWhere('id', '!=', $user->id))->name;

                return [
                    'id' => $c->id,
                    'is_group' => (bool) $c->is_group,
                    'title' => $title ?? 'Chat',
                    'participants' => $c->participants->map(fn ($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'avatar' => $p->public_profile_image ?? asset('assets/default-profile.png'),
                    ]),
                    'last_message' => $lastMessage ? [
                        'id' => $lastMessage->id,
                        'text' => $lastMessage->message_text,
                    ] : null,
                    'last_message_at' => optional($lastMessage?->created_at)->toISOString(),
                ];
            })
            ->sortByDesc(fn ($c) => $c['last_message_at'])
            ->values();
    }
}