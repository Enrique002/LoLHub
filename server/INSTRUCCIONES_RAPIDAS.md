# Instrucciones Rápidas - Configurar Apache

## Método Rápido (Recomendado)

### 1. Ejecutar Script de Configuración

Abre PowerShell **como Administrador** y ejecuta:

```powershell
cd C:\xampp\htdocs\tfg\server
.\configurar-apache.ps1
```

Este script:
- ✅ Habilita mod_rewrite
- ✅ Habilita VirtualHosts
- ✅ Configura el VirtualHost para Laravel
- ✅ Agrega la entrada al archivo hosts

### 2. Reiniciar Apache

1. Abre el Panel de Control de XAMPP
2. Detén Apache
3. Inicia Apache nuevamente

### 3. Probar

Abre el navegador y visita:
```
http://localhost/tfg/server/public/api/v1/champions
```

Deberías ver una respuesta JSON.

---

## Método Manual

Si prefieres hacerlo manualmente:

### Paso 1: Habilitar mod_rewrite

1. Abre: `C:\xampp\apache\conf\httpd.conf`
2. Busca: `#LoadModule rewrite_module modules/mod_rewrite.so`
3. Quita el `#` para que quede: `LoadModule rewrite_module modules/mod_rewrite.so`

### Paso 2: Habilitar VirtualHosts

1. En el mismo archivo `httpd.conf`
2. Busca: `#Include conf/extra/httpd-vhosts.conf`
3. Quita el `#`: `Include conf/extra/httpd-vhosts.conf`

### Paso 3: Reiniciar Apache

Desde el Panel de Control de XAMPP.

---

## Verificar que funciona

1. Visita: `http://localhost/tfg/server/public/api/v1/champions`
2. Deberías ver JSON con los campeones
3. Si ves un error 404, verifica que mod_rewrite esté habilitado

---

## Frontend

El frontend ya está configurado para usar:
- `http://localhost/tfg/server/public/api/v1`

No necesitas cambiar nada en el frontend. Solo reinicia el servidor de Vite si ya estaba corriendo.

