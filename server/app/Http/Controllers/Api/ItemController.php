<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ItemController extends Controller
{
    private const DATA_DRAGON_VERSION = '15.21.1';
    private const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Intentar obtener desde la base de datos primero
            $items = Item::where('comprable', true)->get();
            
            if ($items->isEmpty()) {
                // Si no hay datos, obtener de Data Dragon
                $response = Http::get(
                    self::DATA_DRAGON_BASE . '/' . self::DATA_DRAGON_VERSION . '/data/en_US/item.json'
                );

                if ($response->successful()) {
                    $data = $response->json();
                    $itemsData = $data['data'] ?? [];
                    
                    // Filtrar solo items comprables
                    $purchasableItems = array_filter($itemsData, function ($item) {
                        return ($item['inStore'] ?? true) !== false && !isset($item['requiredChampion']);
                    });
                    
                    return response()->json([
                        'success' => true,
                        'data' => array_values($purchasableItems),
                        'source' => 'data_dragon'
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'data' => $items,
                'source' => 'database'
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching items: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los objetos'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Intentar obtener desde la base de datos
            $item = Item::where('id_objeto', $id)->first();
            
            if (!$item) {
                // Si no existe, obtener de Data Dragon
                $response = Http::get(
                    self::DATA_DRAGON_BASE . '/' . self::DATA_DRAGON_VERSION . '/data/en_US/item.json'
                );

                if ($response->successful()) {
                    $data = $response->json();
                    $itemData = $data['data'][$id] ?? null;
                    
                    if ($itemData) {
                        return response()->json([
                            'success' => true,
                            'data' => $itemData,
                            'source' => 'data_dragon'
                        ]);
                    }
                }
                
                return response()->json([
                    'success' => false,
                    'message' => 'Objeto no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $item,
                'source' => 'database'
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el objeto'
            ], 500);
        }
    }
}
