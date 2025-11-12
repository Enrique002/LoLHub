<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FavoriteChampion;
use App\Models\CampeonFavorito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FavoriteChampionController extends Controller
{
    private const DATA_DRAGON_VERSION = '15.21.1';
    private const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';

    /**
     * Obtener todos los favoritos del usuario autenticado
     */
    /**
     * Obtiene todos los favoritos del usuario autenticado
     */
    public function index(Request $request)
    {
        $favoritos = $request->user()->campeonesFavoritos()->get();
        
        // Obtener información completa de los campeones desde Data Dragon
        $datosCampeones = [];
        foreach ($favoritos as $favorito) {
            try {
                $respuesta = Http::get(
                    self::DATA_DRAGON_BASE . '/' . self::DATA_DRAGON_VERSION . '/data/en_US/champion/' . $favorito->id_campeon . '.json'
                );
                
                if ($respuesta->successful()) {
                    $datos = $respuesta->json();
                    $datosCampeon = $datos['data'][$favorito->id_campeon] ?? null;
                    if ($datosCampeon) {
                        $datosCampeones[] = $datosCampeon;
                    }
                }
            } catch (\Exception $e) {
                // Continuar con el siguiente campeón si hay error
                continue;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $datosCampeones,
        ]);
    }

    /**
     * Agregar un campeón a favoritos
     */
    /**
     * Agrega un campeón a favoritos
     */
    public function store(Request $request)
    {
        $request->validate([
            'champion_id' => 'required|string',
        ]);

        $usuario = $request->user();
        $idCampeon = $request->champion_id;

        // Verificar si ya existe
        $existente = FavoriteChampion::where('id_usuario', $usuario->id)
            ->where('id_campeon', $idCampeon)
            ->first();

        if ($existente) {
            return response()->json([
                'success' => false,
                'message' => 'Este campeón ya está en tus favoritos',
            ], 400);
        }

        $favorito = FavoriteChampion::create([
            'id_usuario' => $usuario->id,
            'id_campeon' => $idCampeon,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Campeón agregado a favoritos',
            'data' => $favorito,
        ], 201);
    }

    /**
     * Eliminar un campeón de favoritos
     */
    /**
     * Elimina un campeón de favoritos
     */
    public function destroy(Request $request, string $championId)
    {
        $usuario = $request->user();

        $favorito = FavoriteChampion::where('id_usuario', $usuario->id)
            ->where('id_campeon', $championId)
            ->first();

        if (!$favorito) {
            return response()->json([
                'success' => false,
                'message' => 'Este campeón no está en tus favoritos',
            ], 404);
        }

        $favorito->delete();

        return response()->json([
            'success' => true,
            'message' => 'Campeón eliminado de favoritos',
        ]);
    }

    /**
     * Verifica si un campeón es favorito
     */
    public function check(Request $request, string $championId)
    {
        $usuario = $request->user();

        $esFavorito = FavoriteChampion::where('id_usuario', $usuario->id)
            ->where('id_campeon', $championId)
            ->exists();

        return response()->json([
            'success' => true,
            'is_favorite' => $esFavorito,
        ]);
    }
}
