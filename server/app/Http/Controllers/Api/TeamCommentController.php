<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ComentarioEquipo;
use App\Models\EquipoIdeal;
use Illuminate\Http\Request;

class TeamCommentController extends Controller
{
    /**
     * Agregar comentario a un equipo
     */
    public function store(Request $request, int $teamId)
    {
        $validated = $request->validate([
            'comentario' => 'required|string|max:500',
        ]);

        $usuario = $request->user();
        $equipo = EquipoIdeal::findOrFail($teamId);

        // Verificar que son amigos
        if (!$usuario->isFriendWith($equipo->id_usuario)) {
            return response()->json([
                'success' => false,
                'message' => 'Solo puedes comentar en equipos de tus amigos',
            ], 403);
        }

        $comentario = ComentarioEquipo::create([
            'id_equipo' => $equipo->id,
            'id_usuario' => $usuario->id,
            'comentario' => $validated['comentario'],
        ]);

        $comentario->load('usuario');

        return response()->json([
            'success' => true,
            'message' => 'Comentario agregado exitosamente',
            'comment' => [
                'id' => $comentario->id,
                'comentario' => $comentario->comentario,
                'created_at' => $comentario->created_at,
                'usuario' => [
                    'id' => $comentario->usuario->id,
                    'name' => $comentario->usuario->name,
                    'email' => $comentario->usuario->email,
                    'avatar_url' => $comentario->usuario->avatar_url,
                ],
            ],
        ], 201);
    }

    /**
     * Eliminar comentario
     */
    public function destroy(Request $request, int $commentId)
    {
        $usuario = $request->user();
        $comentario = ComentarioEquipo::findOrFail($commentId);
        $equipo = $comentario->equipo;

        // El autor puede eliminar su comentario O el dueño del equipo puede eliminar cualquier comentario
        $puedeEliminar = $comentario->id_usuario === $usuario->id || 
                        ($equipo && $equipo->id_usuario === $usuario->id);

        if (!$puedeEliminar) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para eliminar este comentario',
            ], 403);
        }

        $comentario->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comentario eliminado exitosamente',
        ]);
    }
}

