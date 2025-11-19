<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FriendRequestController extends Controller
{
    public function index(Request $request)
    {
        $solicitudes = $request->user()
            ->receivedFriendRequests()
            ->where('status', 'pending')
            ->with('requester')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (FriendRequest $request) {
                return [
                    'id' => $request->id,
                    'requester' => [
                        'id' => $request->requester->id,
                        'name' => $request->requester->name,
                        'email' => $request->requester->email,
                        'avatar_url' => $request->requester->avatar_url,
                    ],
                    'created_at' => $request->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'requests' => $solicitudes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:usuarios,id',
        ]);

        $usuario = $request->user();
        $receiverId = (int) $validated['receiver_id'];

        if ($receiverId === $usuario->id) {
            throw ValidationException::withMessages([
                'receiver_id' => ['No puedes enviarte una solicitud a ti mismo.'],
            ]);
        }

        // Verificar si el usuario está bloqueado
        $estaBloqueado = \App\Models\BlockedUser::where(function ($query) use ($usuario, $receiverId) {
            $query->where('blocker_id', $usuario->id)
                ->where('blocked_id', $receiverId);
        })->orWhere(function ($query) use ($usuario, $receiverId) {
            $query->where('blocker_id', $receiverId)
                ->where('blocked_id', $usuario->id);
        })->exists();

        if ($estaBloqueado) {
            throw ValidationException::withMessages([
                'receiver_id' => ['No puedes enviar solicitudes a este usuario.'],
            ]);
        }

        $existe = FriendRequest::where(function ($query) use ($usuario, $receiverId) {
            $query->where('requester_id', $usuario->id)
                ->where('receiver_id', $receiverId);
        })->orWhere(function ($query) use ($usuario, $receiverId) {
            $query->where('requester_id', $receiverId)
                ->where('receiver_id', $usuario->id);
        })->first();

        if ($existe) {
            if ($existe->status === 'pending') {
                throw ValidationException::withMessages([
                    'receiver_id' => ['Ya existe una solicitud pendiente con este usuario.'],
                ]);
            }

            if ($existe->status === 'accepted') {
                throw ValidationException::withMessages([
                    'receiver_id' => ['Ya son amigos.'],
                ]);
            }

            $existe->delete();
        }

        FriendRequest::create([
            'requester_id' => $usuario->id,
            'receiver_id' => $receiverId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Solicitud enviada',
        ], 201);
    }

    public function accept(FriendRequest $friendRequest, Request $request)
    {
        $this->authorizeRequest($friendRequest, $request->user()->id);

        $friendRequest->update([
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Solicitud aceptada',
        ]);
    }

    public function reject(FriendRequest $friendRequest, Request $request)
    {
        $this->authorizeRequest($friendRequest, $request->user()->id);

        $friendRequest->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Solicitud rechazada',
        ]);
    }

    public function remove(Request $request, int $friendId)
    {
        $usuario = $request->user();

        if ($friendId === $usuario->id) {
            throw ValidationException::withMessages([
                'friend_id' => ['No puedes eliminar tu propia amistad.'],
            ]);
        }

        $friendRequest = FriendRequest::where('status', 'accepted')
            ->where(function ($query) use ($usuario, $friendId) {
                $query->where(function ($sub) use ($usuario, $friendId) {
                    $sub->where('requester_id', $usuario->id)
                        ->where('receiver_id', $friendId);
                })->orWhere(function ($sub) use ($usuario, $friendId) {
                    $sub->where('requester_id', $friendId)
                        ->where('receiver_id', $usuario->id);
                });
            })
            ->first();

        if (!$friendRequest) {
            throw ValidationException::withMessages([
                'friend_id' => ['No son amigos.'],
            ]);
        }

        // Eliminar también los mensajes entre ellos
        \App\Models\FriendMessage::where(function ($query) use ($usuario, $friendId) {
            $query->where('sender_id', $usuario->id)
                ->where('receiver_id', $friendId);
        })->orWhere(function ($query) use ($usuario, $friendId) {
            $query->where('sender_id', $friendId)
                ->where('receiver_id', $usuario->id);
        })->delete();

        $friendRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Amigo eliminado correctamente',
        ]);
    }

    protected function authorizeRequest(FriendRequest $friendRequest, int $userId): void
    {
        if ($friendRequest->receiver_id !== $userId) {
            abort(403, 'No puedes modificar esta solicitud');
        }
    }
}

