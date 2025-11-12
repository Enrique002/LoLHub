<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas públicas de la API
Route::prefix('v1')->group(function () {
    // Rutas de campeones
    Route::get('/champions', [App\Http\Controllers\Api\ChampionController::class, 'index']);
    Route::get('/champions/{id}', [App\Http\Controllers\Api\ChampionController::class, 'show']);
    
    // Rutas de objetos
    Route::get('/items', [App\Http\Controllers\Api\ItemController::class, 'index']);
    Route::get('/items/{id}', [App\Http\Controllers\Api\ItemController::class, 'show']);
    
    // Rutas de autenticación
    Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
    
    // Rutas protegidas
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
        Route::get('/me', [App\Http\Controllers\Api\AuthController::class, 'me']);
        
        // Rutas de favoritos
        Route::get('/favorites', [App\Http\Controllers\Api\FavoriteChampionController::class, 'index']);
        Route::post('/favorites', [App\Http\Controllers\Api\FavoriteChampionController::class, 'store']);
        Route::delete('/favorites/{championId}', [App\Http\Controllers\Api\FavoriteChampionController::class, 'destroy']);
        Route::get('/favorites/check/{championId}', [App\Http\Controllers\Api\FavoriteChampionController::class, 'check']);
    });
});

