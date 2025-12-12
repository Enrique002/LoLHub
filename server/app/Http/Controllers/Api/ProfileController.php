<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ProfileController extends Controller
{
    public function __construct(
        private readonly MissionService $missionService
    ) {
    }
    public function show(Request $request)
    {
        $usuario = $request->user()->fresh();

        return response()->json([
            'success' => true,
            'user' => $usuario,
        ]);
    }

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
            'selected_decoration_key' => 'sometimes|nullable|string',
        ]);

        if (isset($validated['name'])) {
            // Verificar si ya existe otro usuario con el mismo nombre (case-insensitive)
            $nombreNormalizado = strtolower(trim($validated['name']));
            $usuarioExistente = \App\Models\User::whereRaw('LOWER(TRIM(nombre)) = ?', [$nombreNormalizado])
                ->where('id', '!=', $usuario->id)
                ->first();
            
            if ($usuarioExistente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este nombre de usuario ya está en uso. Por favor, elige otro.',
                ], 422);
            }
            
            $usuario->nombre = $validated['name'];
        }

        if ($request->hasFile('avatar')) {
            $this->deleteFile($usuario->avatar_path);
            $path = $this->storeFile($request->file('avatar'), 'avatars');
            $usuario->avatar_path = $path;
        }

        if ($request->hasFile('banner')) {
            $this->deleteFile($usuario->banner_path);
            $path = $this->storeFile($request->file('banner'), 'banners');
            $usuario->banner_path = $path;
        }

        if (isset($validated['favorite_items'])) {
            $usuario->favorite_items = $validated['favorite_items'];
        }

        if (isset($validated['favorite_runes'])) {
            $usuario->favorite_runes = $validated['favorite_runes'];
        }

        if (array_key_exists('selected_decoration_key', $validated)) {
            $decorationKey = $validated['selected_decoration_key'];

            if ($decorationKey === null) {
                $usuario->selected_decoration_key = null;
            } else {
                $missions = $this->missionService->progressFor($usuario);
                $mission = $missions->firstWhere('key', $decorationKey);

                if (!$mission || !$mission['completed']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Aún no has desbloqueado esta decoración.',
                    ], 422);
                }

                $usuario->selected_decoration_key = $decorationKey;
            }
        }

        $usuario->save();

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'user' => $usuario->fresh(),
        ]);
    }

    /**
     * Almacena un archivo directamente en public/storage sin necesidad de symlink
     */
    private function storeFile($file, string $directory): string
    {
        // Crear el directorio si no existe
        $publicPath = public_path('storage/' . $directory);
        if (!File::exists($publicPath)) {
            File::makeDirectory($publicPath, 0755, true);
        }

        // Generar un nombre único para el archivo
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        
        // Mover el archivo a public/storage/{directory}
        $file->move($publicPath, $filename);
        
        // Retornar la ruta relativa (sin 'public/storage' porque se accede directamente desde /storage)
        return $directory . '/' . $filename;
    }

    /**
     * Elimina un archivo de public/storage
     */
    private function deleteFile(?string $path): void
    {
        if (!$path) {
            return;
        }

        // Intentar eliminar de public/storage (nueva ubicación)
        $filePath = public_path('storage/' . $path);
        if (File::exists($filePath)) {
            File::delete($filePath);
        }
        
        // También intentar eliminar si está en storage/app/public (para compatibilidad con archivos antiguos)
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
