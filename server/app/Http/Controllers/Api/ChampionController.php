<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Champion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChampionController extends Controller
{
    private const DATA_DRAGON_VERSION = '15.21.1';
    private const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';

    public function index(Request $request)
    {
        try {
            $champions = Champion::all();
            
            if ($champions->isEmpty()) {
                $response = Http::get(
                    self::DATA_DRAGON_BASE . '/' . self::DATA_DRAGON_VERSION . '/data/en_US/champion.json'
                );

                if ($response->successful()) {
                    $data = $response->json();
                    $championsData = array_values($data['data'] ?? []);
                    
                    return response()->json([
                        'success' => true,
                        'data' => $championsData,
                        'source' => 'data_dragon'
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'data' => $champions,
                'source' => 'database'
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching champions: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los campeones'
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $champion = Champion::where('id_campeon', $id)->first();
            
            if (!$champion) {
                $response = Http::get(
                    self::DATA_DRAGON_BASE . '/' . self::DATA_DRAGON_VERSION . '/data/en_US/champion/' . $id . '.json'
                );

                if ($response->successful()) {
                    $data = $response->json();
                    $championData = $data['data'][$id] ?? null;
                    
                    if ($championData) {
                        return response()->json([
                            'success' => true,
                            'data' => $championData,
                            'source' => 'data_dragon'
                        ]);
                    }
                }
                
                return response()->json([
                    'success' => false,
                    'message' => 'Campeón no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $champion,
                'source' => 'database'
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching champion: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el campeón'
            ], 500);
        }
    }
}
