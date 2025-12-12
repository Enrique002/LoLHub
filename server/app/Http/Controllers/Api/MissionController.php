<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MissionService;
use Illuminate\Http\Request;

class MissionController extends Controller
{
    public function __construct(
        private readonly MissionService $missionService
    ) {
    }

    public function progress(Request $request)
    {
        $user = $request->user()->loadCount('campeonesFavoritos');
        $missions = $this->missionService->progressFor($user);

        return response()->json([
            'success' => true,
            'missions' => $missions,
            'summary' => $this->missionService->summary($missions),
        ]);
    }

    public function ranking(Request $request)
    {
        $limit = (int) $request->query('limit', 20);
        $limit = max(5, min($limit, 50));

        $users = User::query()
            ->select(['id', 'nombre', 'correo', 'avatar_path', 'banner_path', 'favorite_items', 'favorite_runes', 'created_at'])
            ->withCount('campeonesFavoritos')
            ->get();

        $entries = $users->map(function (User $user) {
            $missions = $this->missionService->progressFor($user);
            $summary = $this->missionService->summary($missions);

            return [
                'user' => $user,
                'summary' => $summary,
            ];
        });

        $sorted = $entries
            ->sort(function (array $a, array $b) {
                return $b['summary']['completed'] <=> $a['summary']['completed']
                    ?: strcmp($a['user']->name ?? '', $b['user']->name ?? '');
            })
            ->values();

        $ranking = $sorted->take($limit)->values()->map(function (array $entry, int $index) {
            $user = $entry['user'];

            return [
                'position' => $index + 1,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar_url' => $user->avatar_url,
                    'banner_url' => $user->banner_url,
                    'selected_decoration' => $user->selected_decoration,
                ],
                'completed' => $entry['summary']['completed'],
                'decorations' => $entry['summary']['decorations'],
            ];
        });

        $you = null;
        $authUser = $request->user();

        if ($authUser) {
            $index = $sorted->search(fn (array $entry) => $entry['user']->id === $authUser->id);

            if ($index !== false) {
                $you = [
                    'position' => $index + 1,
                    'completed' => $sorted[$index]['summary']['completed'],
                    'decorations' => $sorted[$index]['summary']['decorations'],
                ];
            }
        }

        return response()->json([
            'success' => true,
            'ranking' => $ranking,
            'you' => $you,
            'total_missions' => count($this->missionService->definitions()),
        ]);
    }
}
