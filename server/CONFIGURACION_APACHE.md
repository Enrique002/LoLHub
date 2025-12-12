# Configuración de Apache (XAMPP) para Laravel

## Opción 1: Usar VirtualHost (Recomendado)

### Paso 1: Editar httpd-vhosts.conf

1. Abre el archivo: `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
2. Agrega al final del archivo el contenido de `apache-vhost.conf` (ya está en este proyecto)
3. Asegúrate de que la ruta del DocumentRoot sea correcta: `C:/xampp/htdocs/tfg/server/public`

### Paso 2: Editar hosts de Windows

1. Abre el archivo hosts como administrador:
   - Ruta: `C:\Windows\System32\drivers\etc\hosts`
   - Click derecho → Ejecutar como administrador → Abrir con Bloc de notas

2. Agrega esta línea al final:
   ```
   127.0.0.1    lol-gg.local
   ```

### Paso 3: Habilitar mod_rewrite

1. Abre: `C:\xampp\apache\conf\httpd.conf`
2. Busca la línea: `#LoadModule rewrite_module modules/mod_rewrite.so`
3. Descomenta (quita el #): `LoadModule rewrite_module modules/mod_rewrite.so`

### Paso 4: Habilitar VirtualHosts

1. En el mismo archivo `httpd.conf`
2. Busca: `#Include conf/extra/httpd-vhosts.conf`
3. Descomenta: `Include conf/extra/httpd-vhosts.conf`

### Paso 5: Reiniciar Apache

1. Abre el Panel de Control de XAMPP
2. Detén Apache
3. Inicia Apache nuevamente

### Paso 6: Probar

Visita: `http://lol-gg.local/api/v1/champions`

---

## Opción 2: Usar localhost directamente (Más simple)

Si no quieres configurar VirtualHost, simplemente:

1. Asegúrate de que mod_rewrite esté habilitado (Paso 3 de arriba)
2. El frontend ya está configurado para usar: `http://localhost/tfg/server/public/api/v1`
3. Reinicia Apache

### Probar

Visita: `http://localhost/tfg/server/public/api/v1/champions`

---

## Verificar que funciona

1. Abre el navegador
2. Ve a: `http://localhost/tfg/server/public/api/v1/champions`
3. Deberías ver una respuesta JSON con los campeones

Si ves un error 404, verifica:
- Que mod_rewrite esté habilitado
- Que el .htaccess esté en `server/public/.htaccess`
- Que AllowOverride esté en "All" en la configuración de Apache

---

## Configuración del Frontend

El frontend ya está configurado para usar:
- `http://localhost/tfg/server/public/api/v1` (por defecto)

Si configuraste el VirtualHost, puedes cambiar en `client/src/config.ts` o crear un `.env` en `client/`:
```
VITE_API_BASE_URL=http://lol-gg.local/api/v1
```

