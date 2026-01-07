# 🔧 Solución del Problema de Registro

## ✅ Cambios Realizados

He mejorado el manejo de errores y agregado timeout para que el registro funcione correctamente:

1. **Timeout de 30 segundos** en las peticiones API
2. **Mejor manejo de errores** con mensajes más claros
3. **Logging en consola** para debugging

## 🔍 Verificar Configuración en Render

### Paso 1: Verificar URL del Backend en Frontend

1. Ve a Render Dashboard: https://dashboard.render.com
2. Haz clic en el servicio `lolhub-frontend`
3. Ve a la pestaña **"Environment"**
4. Busca la variable `VITE_API_BASE_URL`
5. Debe tener el valor: `https://lolhub-backend.onrender.com/api/v1`
   - (Reemplaza con la URL real de tu backend)
6. Si no existe o está mal, agrégalo/corrígela
7. Guarda (se redesplegará automáticamente)

### Paso 2: Verificar CORS en Backend

1. Ve al servicio `lolhub-backend` en Render
2. Ve a la pestaña **"Environment"**
3. Busca la variable `CORS_ALLOWED_ORIGINS`
4. Debe tener el valor: `https://lolhub-frontend.onrender.com`
   - (Reemplaza con la URL real de tu frontend)
   - **IMPORTANTE:** Debe ser `https://` no `http://`
   - **SIN barra al final**
5. Si no existe, agrégalo
6. Guarda (se redesplegará automáticamente)

### Paso 3: Verificar que el Backend esté Activo

1. Ve al servicio `lolhub-backend`
2. Verifica que el estado sea **"Live"** (no "Sleeping")
3. Si está "Sleeping", haz clic en "Manual Deploy" > "Deploy latest commit"
4. Espera a que termine el despliegue

### Paso 4: Probar la Conexión

1. Abre tu aplicación en el navegador
2. Abre la consola del navegador (F12)
3. Ve a la pestaña "Console"
4. Intenta registrarte
5. Revisa los mensajes en la consola:
   - Si ves errores de CORS: el problema es la configuración de CORS
   - Si ves "timeout": el backend está dormido o la URL es incorrecta
   - Si ves errores 404: la URL del backend es incorrecta

## 🐛 Errores Comunes y Soluciones

### Error: "No se pudo conectar con el servidor"
**Causa:** La URL del backend es incorrecta o el backend está dormido
**Solución:**
- Verifica `VITE_API_BASE_URL` en el frontend
- Asegúrate de que la URL sea `https://` no `http://`
- Incluye `/api/v1` al final
- Espera 30-60 segundos si el backend estaba dormido

### Error: "CORS policy"
**Causa:** CORS no está configurado correctamente
**Solución:**
- Verifica `CORS_ALLOWED_ORIGINS` en el backend
- Debe ser la URL exacta del frontend (sin barra al final)
- Debe ser `https://` no `http://`
- Guarda y espera a que se redespliegue

### Error: "La petición tardó demasiado"
**Causa:** El backend está dormido (plan gratuito)
**Solución:**
- Espera 30-60 segundos y vuelve a intentar
- La primera petición después de dormir tarda más
- Las siguientes peticiones serán rápidas

### El formulario se queda "pensando"
**Causa:** La petición no está llegando al backend
**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Intenta registrarte
4. Busca la petición a `/register`
5. Revisa:
   - Si no aparece: el frontend no está haciendo la petición
   - Si aparece en rojo: hay un error (CORS, timeout, etc.)
   - Si aparece en amarillo: está pendiente (timeout)

## ✅ Verificación Final

Después de configurar todo:

1. **Frontend:**
   - URL: `https://lolhub-frontend.onrender.com` (o la tuya)
   - Variable `VITE_API_BASE_URL` = `https://lolhub-backend.onrender.com/api/v1`

2. **Backend:**
   - URL: `https://lolhub-backend.onrender.com` (o la tuya)
   - Variable `CORS_ALLOWED_ORIGINS` = `https://lolhub-frontend.onrender.com`
   - Variable `APP_URL` = `https://lolhub-backend.onrender.com`

3. **Probar:**
   - Abre el frontend
   - Intenta registrarte
   - Revisa la consola para ver errores
   - Si hay errores, compártelos y te ayudo a solucionarlos

## 📝 Nota Importante

Los cambios de código ya están en GitHub, pero **Render necesita que configures las variables de entorno manualmente** porque tienen `sync: false` en el render.yaml.

¡Sigue los pasos arriba y debería funcionar!

