<?php

namespace App\Http\Controllers\Chat;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class ChatController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->forceFill(['last_seen_at' => now()])->save();

        $conversations = $this->sidebarConversations($user);

        return Inertia::render('Chat/Index', [
            'conversations' => $conversations,
        ]);
    }

    public function show(Conversation $conversation)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->forceFill(['last_seen_at' => now()])->save();

        abort_unless(
            $conversation->participants()->where('users.id', $user->id)->exists(),
            403,
            'Kamu bukan partisipan pada percakapan ini'
        );

        $conversations = $this->sidebarConversations($user);

        $conversation->load([
            'participants:id,full_name,profile_image',
            'trip:id,title',
            'pergi_bareng:id,title',
        ]);

        $peer = $conversation->participants->firstWhere('id', '!=', $user->id);
        $peerLastReadAt = $peer?->pivot?->last_read_at
            ? Carbon::parse($peer->pivot->last_read_at)->toISOString()
            : null;

        $title = $conversation->is_group
            ? ($conversation->trip?->title ?? $conversation->pergi_bareng?->title ?? 'Group')
            : optional($conversation->participants->firstWhere('id', '!=', $user->id))->full_name;

        $messages = $conversation->messages()
            ->with('sender:id,full_name,profile_image')
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
                    'name' => $m->sender?->full_name,
                    'avatar' => $m->sender?->public_profile_image ?? asset('assets/default-profile.png'),
                ],
            ]);

        return Inertia::render('Chat/Show', [
            'conversations' => $conversations,
            'conversation' => [
                'id' => $conversation->id,
                'is_group' => (bool) $conversation->is_group,
                'title' => $title ?? 'Chat',
                'peer_last_read_at' => $peerLastReadAt,
                'participants' => $conversation->participants->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->full_name,
                    'avatar' => $p->public_profile_image ?? asset('assets/default-profile.png'),
                    'last_seen_at' => $p->last_seen_at
                        ? Carbon::parse($p->last_seen_at)->toISOString()
                        : null,
                ])->values(),
            ],
            'messages' => $messages,
        ]);
    }

    public function storeMessage(Request $request, Conversation $conversation)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->forceFill(['last_seen_at' => now()])->save();

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

        broadcast(new MessageSent($message))->toOthers();

        return back();
    }

    private function sidebarConversations($user)
    {
        return $user->conversations()
            ->with([
                'participants:id,full_name,profile_image',
                'trip:id,title',
                'pergi_bareng:id,title'
            ])
            ->get()
            ->map(function ($c) use ($user) {
                $lastMessage = $c->messages()->latest()->with('sender:id,full_name')->first();

                $title = $c->is_group
                    ? ($c->trip?->title ?? $c->pergi_bareng?->title ?? 'Group')
                    : optional($c->participants->firstWhere('id', '!=', $user->id))->full_name;

                $avatar = $c->is_group
                    ? asset('assets/default-profile.png')
                    : ($c->participants->firstWhere('id', '!=', $user->id)?->public_profile_image ?? asset('assets/default-profile.png'));

                return [
                    'id' => $c->id,
                    'is_group' => (bool) $c->is_group,
                    'title' => $title ?? 'Chat',
                    'avatar' => $avatar,
                    'subtitle' => $lastMessage?->message_text ?? '',
                    'time' => $lastMessage?->created_at?->format('H:i') ?? '',
                    'unread' => 0,
                    'last_message_at' => optional($lastMessage?->created_at)->timestamp ?? 0,
                ];
            })
            ->sortByDesc('last_message_at')
            ->values();
    }
}