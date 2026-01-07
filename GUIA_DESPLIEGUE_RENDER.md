# Guía de Despliegue en Render.com

Esta guía te explica cómo desplegar tu proyecto LoLHub en Render.com de forma completamente automática.

## ¿Por qué Render.com?

✅ **Gratis** - Plan gratuito disponible  
✅ **Soporta Docker** - Funciona con tus Dockerfiles  
✅ **Base de datos incluida** - MySQL gratuito  
✅ **Despliegue automático** - Desde GitHub  
✅ **Sin tarjeta de crédito** - Para el plan gratuito  
✅ **URL pública** - Acceso como página web normal  

## Requisitos Previos

1. Cuenta en GitHub (tu código ya está ahí)
2. Cuenta en Render.com (gratis, se crea en 2 minutos)
3. 10 minutos de tu tiempo

## Pasos para Desplegar

### Paso 1: Crear cuenta en Render

1. Ve a https://render.com
2. Haz clic en "Get Started for Free"
3. Regístrate con tu cuenta de GitHub (es lo más fácil)

### Paso 2: Conectar tu repositorio

1. En el dashboard de Render, haz clic en "New +"
2. Selecciona "Blueprint" (para desplegar todo de una vez)
3. Conecta tu repositorio de GitHub: `Enrique002/LoLHub`
4. Render detectará automáticamente el archivo `render.yaml`

### Paso 3: Configurar Variables de Entorno

Render configurará automáticamente la mayoría de variables, pero necesitas:

1. **Para el Backend:**
   - `APP_URL` - Se configurará automáticamente con la URL de Render
   - `CORS_ALLOWED_ORIGINS` - Debes poner la URL del frontend (se te dará después)

2. **Para el Frontend:**
   - `VITE_API_BASE_URL` - Debes poner la URL del backend (se te dará después)

### Paso 4: Desplegar

1. Render creará 3 servicios automáticamente:
   - **Base de datos MySQL** (lolhub-database)
   - **Backend Laravel** (lolhub-backend)
   - **Frontend React** (lolhub-frontend)

2. El despliegue tomará 5-10 minutos la primera vez

3. Una vez completado, obtendrás 3 URLs:
   - Frontend: `https://lolhub-frontend.onrender.com`
   - Backend: `https://lolhub-backend.onrender.com`
   - Base de datos: (solo accesible internamente)

### Paso 5: Configurar URLs

Una vez que tengas las URLs:

1. Ve a la configuración del **Frontend** en Render
2. Agrega/actualiza la variable de entorno:
   - `VITE_API_BASE_URL` = `https://lolhub-backend.onrender.com/api/v1`
3. Guarda y espera a que se redespliegue (2-3 minutos)

4. Ve a la configuración del **Backend** en Render
5. Agrega/actualiza la variable de entorno:
   - `CORS_ALLOWED_ORIGINS` = `https://lolhub-frontend.onrender.com`
   - `APP_URL` = `https://lolhub-backend.onrender.com`
6. Guarda y espera a que se redespliegue

### Paso 6: ¡Listo!

Tu aplicación estará disponible en:
- **Frontend**: `https://lolhub-frontend.onrender.com`
- **Backend API**: `https://lolhub-backend.onrender.com/api/v1`

## Configuración Automática con render.yaml

El archivo `render.yaml` ya está configurado y hace todo automáticamente:

```yaml
services:
  - type: pspg          # Base de datos PostgreSQL (Render usa PostgreSQL, no MySQL)
  - type: web           # Backend Laravel
  - type: web           # Frontend React
```

**Nota importante**: Render usa PostgreSQL por defecto, no MySQL. He configurado todo para que funcione con PostgreSQL.

## Actualizar el Proyecto

Cada vez que hagas push a GitHub, Render desplegará automáticamente los cambios.

## Límites del Plan Gratuito

- ⏱️ **Sleep después de 15 minutos** de inactividad (se despierta en 30 segundos)
- 💾 **512 MB RAM** por servicio
- 📊 **Base de datos limitada** pero suficiente para desarrollo
- 🚀 **Despliegues ilimitados**

## Solución de Problemas

### El frontend no se conecta al backend
- Verifica que `VITE_API_BASE_URL` tenga la URL correcta del backend
- Asegúrate de incluir `/api/v1` al final

### Error de CORS
- Verifica que `CORS_ALLOWED_ORIGINS` tenga la URL exacta del frontend
- Debe ser `https://...` no `http://...`

### La base de datos no conecta
- Render configura automáticamente las variables de conexión
- Verifica los logs del backend en Render

### Ver logs
- Ve a cada servicio en Render
- Haz clic en "Logs" para ver los logs en tiempo real

## Alternativa: Despliegue Manual

Si prefieres desplegar cada servicio manualmente:

1. **Base de datos:**
   - New > PostgreSQL
   - Nombre: `lolhub-database`
   - Plan: Free

2. **Backend:**
   - New > Web Service
   - Conecta tu repositorio
   - Dockerfile path: `server/Dockerfile.render`
   - Environment: Docker
   - Agrega las variables de entorno de la base de datos

3. **Frontend:**
   - New > Web Service
   - Conecta tu repositorio
   - Dockerfile path: `client/Dockerfile.render`
   - Environment: Docker
   - Agrega `VITE_API_BASE_URL`

## Costos

**Plan Gratuito:**
- $0/mes
- Perfecto para proyectos personales y desarrollo
- Sleep después de inactividad (se despierta automáticamente)

**Plan Starter ($7/mes):**
- Sin sleep
- Más recursos
- Mejor para producción

## Siguiente Paso

Una vez desplegado, tu aplicación estará disponible públicamente en internet. ¡Comparte la URL con quien quieras!


