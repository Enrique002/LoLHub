# LoLHub - League of Legends Champions Guide

Aplicación web para explorar información detallada sobre los campeones de League of Legends, incluyendo sus habilidades, builds recomendadas y más.

## Características

- **Lista de Campeones**: Explora todos los campeones disponibles con búsqueda y filtrado
- **Detalles de Campeones**: Información detallada sobre cada campeón:
  - Habilidades con descripciones limpias
  - Videos oficiales de habilidades
  - Builds recomendadas organizadas por posición (Top, Jungle, Mid, ADC, Support)
  - Historia y lore del campeón
- **Catálogo de Items**: Explora todos los items disponibles con filtros por rol y estadísticas
- **Interfaz Moderna**: Diseño oscuro con UI responsive y accesible

## Tecnologías

- **Frontend**: React + TypeScript
- **UI Framework**: Chakra UI
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **APIs**:
  - Data Dragon API (Riot Games)
  - CommunityDragon API

## Instalación

```bash
# Instalar dependencias
cd client
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
LoLHub/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── services/         # Servicios de API
│   │   ├── contexts/         # Contextos de React
│   │   ├── utilidades/       # Funciones de utilidad
│   │   └── assets/           # Recursos estáticos
│   └── package.json
│
└── server/                    # Backend Laravel
    ├── app/
    │   ├── Http/Controllers/  # Controladores API
    │   ├── Models/            # Modelos Eloquent
    │   ├── Services/          # Servicios de negocio
    │   └── Providers/         # Service Providers
    ├── database/
    │   ├── migrations/        # Migraciones
    │   └── seeders/           # Seeders
    ├── routes/                # Rutas API
    └── config/                # Configuración
```

## Características Técnicas

- ✅ Código modular y organizado
- ✅ Uso de `'use strict'` en todos los archivos
- ✅ Nombres de variables y funciones en español (lowerCamelCase)
- ✅ Comentarios JSDoc en todas las funciones
- ✅ Estilos CSS organizados en archivos separados
- ✅ Sin estilos inline en el código
- ✅ Limpieza automática de etiquetas HTML en descripciones de habilidades

## Licencia

Este proyecto es parte de un Trabajo de Fin de Grado.

## Autor

Enrique Navarrete-Amado Sánchez

