<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Devuelve la información del perfil del usuario autenticado
     */
    public function show(Request $request)
    {
        $usuario = $request->user()->fresh();

        return response()->json([
            'success' => true,
            'user' => $usuario,
        ]);
    }

    /**
     * Actualiza la información del perfil
     */
    public function update(Request $request)
    {
        $usuario = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'avatar' => 'sometimes|image|max:2048',
            'banner' => 'sometimes|image|max:4096',
            'favorite_items' => 'sometimes|array',
            'favorite_items.*' => 'string',
            'favorite_runes' => 'sometimes|array',
            'favorite_runes.*' => 'string',
        ]);

        if (isset($validated['name'])) {
            $usuario->nombre = $validated['name'];
        }

        if ($request->hasFile('avatar')) {
            $this->deleteFile($usuario->avatar_path);
            $path = $request->file('avatar')->store('avatars', 'public');
            $usuario->avatar_path = $path;
        }

        if ($request->hasFile('banner')) {
            $this->deleteFile($usuario->banner_path);
            $path = $request->file('banner')->store('banners', 'public');
            $usuario->banner_path = $path;
        }

        if (isset($validated['favorite_items'])) {
            $usuario->favorite_items = $validated['favorite_items'];
        }

        if (isset($validated['favorite_runes'])) {
            $usuario->favorite_runes = $validated['favorite_runes'];
        }

        $usuario->save();

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'user' => $usuario->fresh(),
        ]);
    }

    /**
     * Elimina un archivo del almacenamiento público
     */
    private function deleteFile(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}

