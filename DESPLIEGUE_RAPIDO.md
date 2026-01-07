# 🚀 Despliegue Rápido en Render.com

## ⚡ Pasos Rápidos (5 minutos)

### 1. Crear cuenta en Render
- Ve a https://render.com
- Regístrate con GitHub (1 clic)

### 2. Conectar repositorio
- En Render: "New +" > "Blueprint"
- Conecta: `Enrique002/LoLHub`
- Render detectará `render.yaml` automáticamente

### 3. Esperar despliegue
- Render creará 3 servicios automáticamente
- Tiempo: 5-10 minutos

### 4. Configurar URLs (después del despliegue)

**Frontend:**
- Ve a `lolhub-frontend` > Environment
- Agrega: `VITE_API_BASE_URL` = `https://lolhub-backend.onrender.com/api/v1`

**Backend:**
- Ve a `lolhub-backend` > Environment  
- Agrega: `CORS_ALLOWED_ORIGINS` = `https://lolhub-frontend.onrender.com`
- Agrega: `APP_URL` = `https://lolhub-backend.onrender.com`

### 5. ¡Listo! 🎉
Tu app estará en: `https://lolhub-frontend.onrender.com`

---

## 📝 Notas Importantes

- **Base de datos**: Render usa PostgreSQL (ya configurado)
- **Sleep**: El plan gratuito se duerme después de 15 min de inactividad
- **Despertar**: Se despierta automáticamente en 30 segundos cuando alguien visita
- **Actualizaciones**: Cada push a GitHub despliega automáticamente

---

## 🔧 Si algo falla

1. Revisa los logs en cada servicio
2. Verifica las variables de entorno
3. Asegúrate de que las URLs sean `https://` no `http://`

---

**¡Eso es todo! Tu proyecto estará online en menos de 10 minutos.**

