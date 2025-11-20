<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;

class MissionService
{
    /**
     * Devuelve las definiciones de misiones configuradas
     */
    public function definitions(): array
    {
        return config('missions', []);
    }

    /**
     * Genera el progreso detallado de todas las misiones para un usuario
     */
    public function progressFor(User $user): Collection
    {
        $missions = collect($this->definitions());

        return $missions->map(function (array $definition, string $key) use ($user) {
            $progress = $this->resolveProgress($user, $definition);
            $completed = $progress['current'] >= $progress['target'];

            return [
                'key' => $key,
                'title' => $definition['title'],
                'description' => $definition['description'],
                'reward' => $this->formatReward($key, $definition),
                'progress' => $progress,
                'completed' => $completed,
            ];
        })->values();
    }

    /**
     * Devuelve un resumen con total de misiones, completadas y decoraciones obtenidas
     *
     * @param Collection<int, array> $missions
     */
    public function summary(Collection $missions): array
    {
        $completed = $missions->where('completed', true);

        return [
            'total' => $missions->count(),
            'completed' => $completed->count(),
            'decorations' => $completed
                ->map(fn (array $mission) => $mission['reward'])
                ->values(),
        ];
    }

    /**
     * Calcula el progreso de una misión según el usuario
     *
     * @param array{metric: string, target: int} $definition
     */
    private function resolveProgress(User $user, array $definition): array
    {
        $metric = $definition['metric'] ?? '';
        $target = (int) ($definition['target'] ?? 1);

        $current = match ($metric) {
            'favorite_champions' => $this->favoriteChampionsCount($user),
            'favorite_items' => $this->favoriteItemsCount($user),
            'avatar' => $user->avatar_path ? 1 : 0,
            'banner' => $user->banner_path ? 1 : 0,
            default => 0,
        };

        $percentage = $target > 0
            ? (int) min(100, round(($current / $target) * 100))
            : 0;

        return [
            'current' => $current,
            'target' => $target,
            'percentage' => $percentage,
        ];
    }

    /**
     * Normaliza la información de la recompensa para enviarla al frontend
     *
     * @param array{reward?: array<string, mixed>, title?: string, description?: string} $definition
     */
    private function formatReward(string $key, array $definition): array
    {
        $reward = $definition['reward'] ?? [];

        return [
            'key' => $key,
            'title' => $reward['title'] ?? ($definition['title'] ?? 'Recompensa'),
            'description' => $reward['description'] ?? ($definition['description'] ?? null),
            'icon' => $reward['icon'] ?? 'sparkles',
            'color' => $reward['color'] ?? '#FACC15',
        ];
    }

    private function favoriteChampionsCount(User $user): int
    {
        if ($user->relationLoaded('campeonesFavoritos')) {
            return $user->campeonesFavoritos->count();
        }

        if ($user->offsetExists('campeones_favoritos_count')) {
            return (int) $user->getAttribute('campeones_favoritos_count');
        }

        return (int) $user->campeonesFavoritos()->count();
    }

    private function favoriteItemsCount(User $user): int
    {
        $items = $user->favorite_items;

        if (is_array($items)) {
            return count($items);
        }

        return 0;
    }
}

