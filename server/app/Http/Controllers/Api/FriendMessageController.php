<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FriendMessage;
use App\Models\User;
use Illuminate\Http\Request;

class FriendMessageController extends Controller
{
    public function index(Request $request, int $friendId)
    {
        $usuario = $request->user();
        $friend = User::findOrFail($friendId);
        $this->ensureFriendship($usuario, $friend);

        $messages = FriendMessage::query()
            ->where(function ($query) use ($usuario, $friend): void {
                $query->where('sender_id', $usuario->id)
                    ->where('receiver_id', $friend->id);
            })
            ->orWhere(function ($query) use ($usuario, $friend): void {
                $query->where('sender_id', $friend->id)
                    ->where('receiver_id', $usuario->id);
            })
            ->orderBy('created_at')
            ->get()
            ->map(fn (FriendMessage $message) => $this->transformMessage($message));

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:usuarios,id',
            'message' => 'required|string|max:2000',
        ]);

        $usuario = $request->user();
        $friend = User::findOrFail((int) $data['receiver_id']);
        $this->ensureFriendship($usuario, $friend);

        $message = FriendMessage::create([
            'sender_id' => $usuario->id,
            'receiver_id' => $friend->id,
            'message' => $data['message'],
        ]);

        return response()->json([
            'success' => true,
            'message' => $this->transformMessage($message),
        ], 201);
    }

    protected function ensureFriendship(User $usuario, User $friend): void
    {
        if (!$usuario->isFriendWith($friend->id)) {
            abort(403, 'Solo puedes enviar mensajes a tus amigos.');
        }
    }

    protected function transformMessage(FriendMessage $message): array
    {
        return [
            'id' => $message->id,
            'sender_id' => $message->sender_id,
            'receiver_id' => $message->receiver_id,
            'message' => $message->message,
            'read_at' => $message->read_at,
            'created_at' => $message->created_at,
        ];
    }
}

