<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $userID = Auth::id();

        $conversations = Conversation::whereHas('conversation_participants', function($q) use ($userID){
            $q->where('user_id', $userID);
        })->with([
            'conversation_participants',
            'trip',
            'pergi_bareng', 
            'messages' => function ($q){
            $q->latest()->limit(1);
        }])->get();

        $activeConversation = null;
        if($request->has('id')){
            $activeConversation = Conversation::with([
                'messages.sender', 
                'conversation_participants',
                'trip',
                'pergi_bareng'
            ])->findOrFail($request->id);
        }

        return inertia::render('Chat/Index', [
            'conversations' => $conversations,
            'activeConversation' => $activeConversation
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
