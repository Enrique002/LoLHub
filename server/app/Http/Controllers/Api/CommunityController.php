<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $usuario = $request->user();

        $sentPending = $usuario->sentFriendRequests()
            ->where('status', 'pending')
            ->pluck('receiver_id')
            ->toArray();

        $receivedPending = $usuario->receivedFriendRequests()
            ->where('status', 'pending')
            ->pluck('requester_id')
            ->toArray();

        $friendIds = $usuario->friendIds();

        $blockedIds = [];
        try {
            $blockedIds = \App\Models\BlockedUser::where('blocker_id', $usuario->id)
                ->orWhere('blocked_id', $usuario->id)
                ->pluck('blocker_id')
                ->merge(
                    \App\Models\BlockedUser::where('blocker_id', $usuario->id)
                        ->orWhere('blocked_id', $usuario->id)
                        ->pluck('blocked_id')
                )
                ->unique()
                ->filter(fn($id) => $id !== $usuario->id)
                ->toArray();
        } catch (\Illuminate\Database\QueryException $e) {
            $blockedIds = [];
        }

        $usuarios = User::where('id', '<>', $usuario->id)
            ->whereNotIn('id', $blockedIds)
            ->orderBy('nombre')
            ->get()
            ->map(function (User $user) use ($sentPending, $receivedPending, $friendIds) {
                $status = 'none';

                if (in_array($user->id, $friendIds, true)) {
                    $status = 'friend';
                } elseif (in_array($user->id, $sentPending, true)) {
                    $status = 'outgoing';
                } elseif (in_array($user->id, $receivedPending, true)) {
                    $status = 'incoming';
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar_url' => $user->avatar_url,
                    'status' => $status,
                ];
            });

        return response()->json([
            'success' => true,
            'users' => $usuarios,
        ]);
    }
}
