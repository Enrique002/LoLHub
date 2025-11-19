<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'message' => 'required|string|min:10|max:5000',
        ]);

        // Simulación: solo validar, no guardar en BD
        // Si quieres guardar en BD, descomenta las líneas siguientes:
        /*
        try {
            Suggestion::create([
                'name' => $validated['name'] ?? 'Anónimo',
                'message' => $validated['message'],
            ]);
        } catch (\Exception $e) {
            // Si la tabla no existe, simplemente simular éxito
        }
        */

        return response()->json([
            'success' => true,
            'message' => 'Sugerencia enviada correctamente. ¡Gracias por tu feedback!',
        ], 201);
    }
}

