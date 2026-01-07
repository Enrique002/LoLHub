# 🚀 Despliegue Automático en Render.com

## ✅ Todo está listo para desplegar

He configurado todo lo necesario para que puedas desplegar tu proyecto en Render.com **sin ayuda**.

## 📋 Archivos Creados

✅ `render.yaml` - Configuración automática de todos los servicios  
✅ `server/Dockerfile.render` - Dockerfile optimizado para Render  
✅ `client/Dockerfile.render` - Dockerfile optimizado para Render  
✅ `server/docker-entrypoint-render.sh` - Script de inicio para Render  
✅ `GUIA_DESPLIEGUE_RENDER.md` - Guía completa paso a paso  
✅ `DESPLIEGUE_RAPIDO.md` - Guía rápida de 5 minutos  

## 🎯 Pasos para Desplegar (SIN AYUDA)

### Opción 1: Despliegue Automático (Recomendado)

1. **Crear cuenta en Render:**
   - Ve a https://render.com
   - Haz clic en "Get Started for Free"
   - Regístrate con GitHub

2. **Conectar repositorio:**
   - En Render: "New +" > "Blueprint"
   - Selecciona tu repositorio: `Enrique002/LoLHub`
   - Render detectará automáticamente el archivo `render.yaml`

3. **Esperar:**
   - Render creará automáticamente:
     - Base de datos PostgreSQL
     - Backend Laravel
     - Frontend React
   - Tiempo: 5-10 minutos

4. **Configurar URLs (después del despliegue):**
   
   **Frontend:**
   - Ve a `lolhub-frontend` > Environment
   - Agrega: `VITE_API_BASE_URL` = `https://lolhub-backend.onrender.com/api/v1`
   - Guarda (se redesplegará automáticamente)
   
   **Backend:**
   - Ve a `lolhub-backend` > Environment
   - Agrega: `CORS_ALLOWED_ORIGINS` = `https://lolhub-frontend.onrender.com`
   - Agrega: `APP_URL` = `https://lolhub-backend.onrender.com`
   - Guarda (se redesplegará automáticamente)

5. **¡Listo!** 🎉
   - Tu app estará en: `https://lolhub-frontend.onrender.com`

### Opción 2: Despliegue Manual (Si prefieres más control)

Sigue la guía completa en `GUIA_DESPLIEGUE_RENDER.md`

## 🔧 Lo que Render hace automáticamente

- ✅ Crea la base de datos PostgreSQL
- ✅ Configura las variables de entorno de la base de datos
- ✅ Construye las imágenes Docker
- ✅ Despliega el backend y frontend
- ✅ Configura HTTPS automáticamente
- ✅ Asigna URLs públicas

## 📝 Notas Importantes

- **Base de datos**: Render usa PostgreSQL (ya configurado en los Dockerfiles)
- **Sleep**: El plan gratuito se duerme después de 15 min de inactividad
- **Despertar**: Se despierta automáticamente en 30 segundos
- **Actualizaciones**: Cada push a GitHub despliega automáticamente
- **URLs**: Todas las URLs serán `https://` automáticamente

## 🆘 Si algo falla

1. Revisa los logs en cada servicio en Render
2. Verifica que las variables de entorno estén correctas
3. Asegúrate de que las URLs usen `https://` no `http://`
4. Lee `GUIA_DESPLIEGUE_RENDER.md` para más detalles

## 💰 Costos

**Plan Gratuito:**
- $0/mes
- Perfecto para proyectos personales
- Sleep después de inactividad (se despierta automáticamente)

**Plan Starter ($7/mes):**
- Sin sleep
- Más recursos
- Mejor para producción

## 🎉 Resultado Final

Una vez desplegado, tendrás:
- ✅ Frontend público: `https://lolhub-frontend.onrender.com`
- ✅ Backend API: `https://lolhub-backend.onrender.com/api/v1`
- ✅ Base de datos PostgreSQL (accesible solo internamente)
- ✅ HTTPS automático
- ✅ Despliegue automático desde GitHub

**¡Tu proyecto estará online y accesible como una página web normal!**

