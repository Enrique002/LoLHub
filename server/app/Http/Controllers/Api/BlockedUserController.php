<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockedUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BlockedUserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $bloqueados = $request->user()
                ->blockedUsers()
                ->with('blocked')
                ->orderByDesc('created_at')
                ->get()
                ->map(function (BlockedUser $block) {
                    return [
                        'id' => $block->id,
                        'user' => [
                            'id' => $block->blocked->id,
                            'name' => $block->blocked->name,
                            'email' => $block->blocked->email,
                            'avatar_url' => $block->blocked->avatar_url,
                        ],
                        'created_at' => $block->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'blocked_users' => $bloqueados,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'blocked_users' => [],
            ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:usuarios,id',
        ]);

        $usuario = $request->user();
        $userId = (int) $validated['user_id'];

        if ($userId === $usuario->id) {
            throw ValidationException::withMessages([
                'user_id' => ['No puedes bloquearte a ti mismo.'],
            ]);
        }

        try {
            $yaBloqueado = BlockedUser::where('blocker_id', $usuario->id)
                ->where('blocked_id', $userId)
                ->exists();

            if ($yaBloqueado) {
                throw ValidationException::withMessages([
                    'user_id' => ['Este usuario ya está bloqueado.'],
                ]);
            }
        } catch (\Illuminate\Database\QueryException $e) {
        }

        $friendRequest = \App\Models\FriendRequest::where('status', 'accepted')
            ->where(function ($query) use ($usuario, $userId) {
                $query->where(function ($sub) use ($usuario, $userId) {
                    $sub->where('requester_id', $usuario->id)
                        ->where('receiver_id', $userId);
                })->orWhere(function ($sub) use ($usuario, $userId) {
                    $sub->where('requester_id', $userId)
                        ->where('receiver_id', $usuario->id);
                });
            })
            ->first();

        if ($friendRequest) {
            \App\Models\FriendMessage::where(function ($query) use ($usuario, $userId) {
                $query->where('sender_id', $usuario->id)
                    ->where('receiver_id', $userId);
            })->orWhere(function ($query) use ($usuario, $userId) {
                $query->where('sender_id', $userId)
                    ->where('receiver_id', $usuario->id);
            })->delete();

            $friendRequest->delete();
        }

        \App\Models\FriendRequest::where(function ($query) use ($usuario, $userId) {
            $query->where('requester_id', $usuario->id)
                ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($usuario, $userId) {
            $query->where('requester_id', $userId)
                ->where('receiver_id', $usuario->id);
        })->delete();

        try {
            BlockedUser::create([
                'blocker_id' => $usuario->id,
                'blocked_id' => $userId,
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
        }

        return response()->json([
            'success' => true,
            'message' => 'Usuario bloqueado correctamente',
        ], 201);
    }

    public function destroy(Request $request, int $blockedUserId)
    {
        $usuario = $request->user();

        try {
            $blocked = BlockedUser::where('blocker_id', $usuario->id)
                ->where('blocked_id', $blockedUserId)
                ->first();

            if (!$blocked) {
                throw ValidationException::withMessages([
                    'user_id' => ['Este usuario no está bloqueado.'],
                ]);
            }

            $blocked->delete();
        } catch (\Illuminate\Database\QueryException $e) {
        }

        return response()->json([
            'success' => true,
            'message' => 'Usuario desbloqueado correctamente',
        ]);
    }
}

