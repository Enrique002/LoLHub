<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuarios,correo',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',  // Al menos una mayúscula
                'regex:/[0-9]/',  // Al menos un número
                'regex:/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/',  // Al menos un símbolo
            ],
        ], [
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.regex' => 'La contraseña debe contener al menos una mayúscula, un número y un símbolo.',
        ]);

        // Verificar si ya existe un usuario con el mismo nombre (case-insensitive)
        $nombreNormalizado = strtolower(trim($request->name));
        $usuarioExistente = User::whereRaw('LOWER(TRIM(nombre)) = ?', [$nombreNormalizado])->first();
        
        if ($usuarioExistente) {
            throw ValidationException::withMessages([
                'name' => ['Este nombre de usuario ya está en uso. Por favor, elige otro.'],
            ]);
        }

        $usuario = User::create([
            'nombre' => $request->name,
            'correo' => $request->email,
            'contrasenya' => Hash::make($request->password),
        ]);

        $token = $usuario->createToken('token_autenticacion')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'user' => $usuario,
            'token' => $token
        ], 201);
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $usuario = User::where('correo', $request->email)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->contrasenya)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $usuario->createToken('token_autenticacion')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'user' => $usuario,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }
}
