<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas públicas de la API
Route::prefix('v1')->group(function () {
    // Ruta de prueba en la raíz
    Route::get('/', function () {
        return response()->json([
            'success' => true,
            'message' => 'API funcionando correctamente',
            'version' => 'v1',
            'endpoints' => [
                'GET /api/v1/champions' => 'Listar campeones',
                'POST /api/v1/register' => 'Registrar usuario',
                'POST /api/v1/login' => 'Iniciar sesión',
            ]
        ]);
    });
    
    // Manejar peticiones OPTIONS (preflight) para todas las rutas
    Route::options('{any}', function () {
        return response('', 200);
    })->where('any', '.*');
    
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
        Route::get('/profile', [App\Http\Controllers\Api\ProfileController::class, 'show']);
        Route::post('/profile', [App\Http\Controllers\Api\ProfileController::class, 'update']);
        Route::get('/community/users', [App\Http\Controllers\Api\CommunityController::class, 'index']);
        Route::get('/community/requests', [App\Http\Controllers\Api\FriendRequestController::class, 'index']);
        Route::post('/community/requests', [App\Http\Controllers\Api\FriendRequestController::class, 'store']);
        Route::post('/community/requests/{friendRequest}/accept', [App\Http\Controllers\Api\FriendRequestController::class, 'accept']);
        Route::post('/community/requests/{friendRequest}/reject', [App\Http\Controllers\Api\FriendRequestController::class, 'reject']);
        Route::get('/community/messages/{friend}', [App\Http\Controllers\Api\FriendMessageController::class, 'index']);
        Route::post('/community/messages', [App\Http\Controllers\Api\FriendMessageController::class, 'store']);
        Route::delete('/community/friends/{friendId}', [App\Http\Controllers\Api\FriendRequestController::class, 'remove']);
        Route::get('/community/blocked', [App\Http\Controllers\Api\BlockedUserController::class, 'index']);
        Route::post('/community/block', [App\Http\Controllers\Api\BlockedUserController::class, 'store']);
        Route::delete('/community/block/{blockedUserId}', [App\Http\Controllers\Api\BlockedUserController::class, 'destroy']);
        Route::post('/suggestions', [App\Http\Controllers\Api\SuggestionController::class, 'store']);
        
        // Rutas de favoritos
        Route::get('/favorites', [App\Http\Controllers\Api\FavoriteChampionController::class, 'index']);
        Route::post('/favorites', [App\Http\Controllers\Api\FavoriteChampionController::class, 'store']);
        Route::delete('/favorites/{championId}', [App\Http\Controllers\Api\FavoriteChampionController::class, 'destroy']);
        Route::get('/favorites/check/{championId}', [App\Http\Controllers\Api\FavoriteChampionController::class, 'check']);
    });
});

