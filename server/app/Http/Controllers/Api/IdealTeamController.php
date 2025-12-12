<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipoIdeal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class IdealTeamController extends Controller
{
    /**
     * Obtener el equipo ideal del usuario autenticado
     */
    public function show(Request $request)
    {
        $usuario = $request->user();
        
        $equipo = EquipoIdeal::where('id_usuario', $usuario->id)
            ->with(['usuario'])
            ->first();

        if (!$equipo) {
            return response()->json([
                'success' => true,
                'team' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'team' => $this->transformTeam($equipo, 5),
        ]);
    }

    /**
     * Obtener equipos ideales de amigos
     */
    public function indexFriends(Request $request)
    {
        $usuario = $request->user();
        $friendIds = $usuario->friendIds();

        $equipos = EquipoIdeal::whereIn('id_usuario', $friendIds)
            ->with(['usuario'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'teams' => $equipos->map(fn ($equipo) => $this->transformTeam($equipo, 5)),
        ]);
    }

    /**
     * Obtener equipo ideal de un amigo específico
     */
    public function showFriend(Request $request, int $friendId)
    {
        $usuario = $request->user();
        
        // Verificar que son amigos
        if (!$usuario->isFriendWith($friendId)) {
            return response()->json([
                'success' => false,
                'message' => 'Solo puedes ver equipos de tus amigos',
            ], 403);
        }

        $equipo = EquipoIdeal::where('id_usuario', $friendId)
            ->with(['usuario'])
            ->first();

        if (!$equipo) {
            return response()->json([
                'success' => true,
                'team' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'team' => $this->transformTeam($equipo, 5),
        ]);
    }

    /**
     * Crear o actualizar equipo ideal
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'campeones' => 'required|array|min:1|max:5',
            'campeones.*' => 'required|string',
            'objetos' => 'nullable|array',
            'runas' => 'nullable|array',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        $usuario = $request->user();

        $equipo = EquipoIdeal::updateOrCreate(
            ['id_usuario' => $usuario->id],
            [
                'nombre' => $validated['nombre'],
                'campeones' => $validated['campeones'],
                'objetos' => $validated['objetos'] ?? null,
                'runas' => $validated['runas'] ?? null,
                'descripcion' => $validated['descripcion'] ?? null,
            ]
        );

        $equipo->load(['usuario']);

        return response()->json([
            'success' => true,
            'message' => 'Equipo ideal guardado exitosamente',
            'team' => $this->transformTeam($equipo, 5),
        ], 201);
    }

    /**
     * Eliminar equipo ideal
     */
    public function destroy(Request $request)
    {
        $usuario = $request->user();
        
        $equipo = EquipoIdeal::where('id_usuario', $usuario->id)->first();
        
        if ($equipo) {
            $equipo->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Equipo ideal eliminado exitosamente',
        ]);
    }

    /**
     * Obtener comentarios de un equipo con paginación
     */
    public function getComments(Request $request, int $teamId)
    {
        $validated = $request->validate([
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:50',
        ]);

        $page = $validated['page'] ?? 1;
        $perPage = $validated['per_page'] ?? 5;
        $offset = ($page - 1) * $perPage;

        $equipo = EquipoIdeal::findOrFail($teamId);
        $usuario = $request->user();

        // Verificar que son amigos O que es el dueño del equipo
        if ($usuario->id !== $equipo->id_usuario && !$usuario->isFriendWith($equipo->id_usuario)) {
            return response()->json([
                'success' => false,
                'message' => 'Solo puedes ver comentarios de equipos de tus amigos o de tus propios equipos',
            ], 403);
        }

        $totalComentarios = $equipo->comentarios()->count();
        $comentarios = $equipo->comentarios()
            ->with('usuario')
            ->orderByDesc('created_at')
            ->offset($offset)
            ->limit($perPage)
            ->get();

        return response()->json([
            'success' => true,
            'comments' => $comentarios->map(function ($comentario) {
                return [
                    'id' => $comentario->id,
                    'comentario' => $comentario->comentario,
                    'created_at' => $comentario->created_at,
                    'usuario' => [
                        'id' => $comentario->usuario->id,
                        'name' => $comentario->usuario->name,
                        'email' => $comentario->usuario->email,
                        'avatar_url' => $comentario->usuario->avatar_url,
                    ],
                ];
            }),
            'total' => $totalComentarios,
            'page' => $page,
            'per_page' => $perPage,
            'has_more' => ($offset + $perPage) < $totalComentarios,
        ]);
    }

    /**
     * Transformar equipo para respuesta JSON
     */
    private function transformTeam(EquipoIdeal $equipo, int $commentsLimit = 5): array
    {
        // Cargar solo los primeros comentarios (más recientes primero)
        $comentarios = $equipo->comentarios()
            ->with('usuario')
            ->orderByDesc('created_at')
            ->limit($commentsLimit)
            ->get();

        return [
            'id' => $equipo->id,
            'nombre' => $equipo->nombre,
            'campeones' => $equipo->campeones,
            'objetos' => $equipo->objetos,
            'runas' => $equipo->runas,
            'descripcion' => $equipo->descripcion,
            'usuario' => [
                'id' => $equipo->usuario->id,
                'name' => $equipo->usuario->name,
                'email' => $equipo->usuario->email,
                'avatar_url' => $equipo->usuario->avatar_url,
            ],
            'comentarios' => $comentarios->map(function ($comentario) {
                return [
                    'id' => $comentario->id,
                    'comentario' => $comentario->comentario,
                    'created_at' => $comentario->created_at,
                    'usuario' => [
                        'id' => $comentario->usuario->id,
                        'name' => $comentario->usuario->name,
                        'email' => $comentario->usuario->email,
                        'avatar_url' => $comentario->usuario->avatar_url,
                    ],
                ];
            }),
            'total_comentarios' => $equipo->comentarios()->count(),
            'created_at' => $equipo->created_at,
            'updated_at' => $equipo->updated_at,
        ];
    }
}

