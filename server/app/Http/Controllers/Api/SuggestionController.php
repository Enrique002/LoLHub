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

        return response()->json([
            'success' => true,
            'message' => 'Sugerencia enviada correctamente. ¡Gracias por tu feedback!',
        ], 201);
    }
}
