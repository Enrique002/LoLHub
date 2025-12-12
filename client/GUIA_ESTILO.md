# Guía de Estilo - LoL Hub

Sistema de diseño completo para mantener coherencia visual

--

## 1. Identidad de Marca

### Misión

Crear la comunidad definitiva de League of Legends en español, donde los jugadores puedan descubrir campeones, conectar con otros invocadores y mejorar su experiencia de juego a través de herramientas intuitivas y contenido de calidad.

### Valores

- **Excelencia**: Calidad en cada detalle
- **Comunidad**: Conectar a los jugadores
- **Competitividad**: Fomentar la mejora continua

### Logo y Uso

**LoL Hub** - Versión principal

**LoL Hub** - Monocromático

**LoL Hub** - Colores incorrectos

**Reglas de uso:**

✓ Tamaño mínimo: 100px de ancho  
✓ Espacio libre alrededor: mínimo 20px  
✓ Usar siempre dorado (#F0B429) para "LoL"  
✗ No cambiar los colores del logo  
✗ No rotar o distorsionar  
✗ No usar sobre fondos que dificulten la lectura

---

## 2. Paleta de Colores

### Primary (Gold)

- **HSL**: 43 96% 56%
- **HEX**: #F0B429
- **RGB**: 240, 180, 41
- **Uso**: Botones principales, acentos, elementos destacados

### Gold Light

- **HSL**: 43 96% 70%
- **HEX**: #F5CF6B
- **RGB**: 245, 207, 107
- **Uso**: Hover states, degradados, brillos

### Gold Dark

- **HSL**: 43 96% 40%
- **HEX**: #CC9300
- **RGB**: 204, 147, 0
- **Uso**: Sombras doradas, degradados oscuros

### Blue Magic (Accent)

- **HSL**: 195 95% 60%
- **HEX**: #36C5F0
- **RGB**: 54, 197, 240
- **Uso**: Elementos mágicos, efectos hextech, acentos secundarios

### Background

- **HSL**: 220 30% 8%
- **HEX**: #0F1419
- **RGB**: 15, 20, 25
- **Uso**: Fondo principal, superficies oscuras

### Card

- **HSL**: 220 25% 12%
- **HEX**: #1A1F29
- **RGB**: 26, 31, 41
- **Uso**: Tarjetas, superficies elevadas

### Secondary

- **HSL**: 220 40% 20%
- **HEX**: #1F2937
- **RGB**: 31, 41, 55
- **Uso**: Botones secundarios, fondos sutiles

### Foreground

- **HSL**: 48 100% 96%
- **HEX**: #FFF9E6
- **RGB**: 255, 249, 230
- **Uso**: Texto principal, contenido legible

### Muted

- **HSL**: 220 20% 18%
- **HEX**: #252A33
- **RGB**: 37, 42, 51
- **Uso**: Elementos sutiles, fondos de sección

### Destructive

- **HSL**: 0 84.2% 60.2%
- **HEX**: #EF4444
- **RGB**: 239, 68, 68
- **Uso**: Errores, advertencias, acciones destructivas

### Combinaciones Recomendadas

- **Gradiente Dorado**
- **Dorado sobre Fondo Oscuro**
- **Azul Mágico + Contraste**

---

## 3. Tipografía

### Jerarquía Tipográfica

#### H1 Hero
- `text-6xl md:text-8xl font-extrabold tracking-tight`
- **Ejemplo**: LoL Hub

#### H2 Section
- `text-4xl md:text-5xl font-extrabold tracking-tight`
- **Ejemplo**: Explora Campeones

#### H3 Card Title
- `text-xl font-bold tracking-tight`
- **Ejemplo**: Título de Tarjeta

#### H4 Subtitle
- `text-lg font-bold`
- **Ejemplo**: Subtítulo

#### Body Large
- `text-xl text-muted-foreground`
- **Ejemplo**: Texto descriptivo principal

#### Body
- `text-base text-foreground`
- **Ejemplo**: Texto de cuerpo estándar

#### Small
- `text-sm text-muted-foreground`
- **Ejemplo**: Texto pequeño y secundario

#### Button Text
- `text-sm font-bold tracking-wide uppercase`
- **Ejemplo**: Comenzar Ahora

### Reglas tipográficas:

- Fuente principal: System UI (font-sans)
- Peso para títulos: 700-800 (Bold/ExtraBold)
- Peso para cuerpo: 400-500 (Regular/Medium)
- Line height títulos: 1.1 (tracking-tight)
- Line height cuerpo: 1.5-1.7
- Usar glow-gold o glow-blue solo en títulos hero

---

## 4. Iconografía e Ilustraciones

### Librería de Iconos: Lucide React

### Estilo Visual

- Estilo: Lineales (outline)
- Grosor: 2px (strokeWidth)
- Esquinas: Redondeadas

### Tamaños

- Pequeño: 16px (w-4 h-4)
- Mediano: 20px (w-5 h-5)
- Grande: 24px (w-6 h-6)
- Hero: 32-40px (w-8/10)

### Colores

- Dorado (destacados)
- Azul (secundarios)
- Foreground (general)

---

## 5. Fotografía e Imágenes

### Estilo Visual de Imágenes

#### Estilo Recomendado

✓ Imágenes épicas y cinematográficas  
✓ Paleta de colores: azules profundos y dorados  
✓ Iluminación dramática con efectos de brillo  
✓ Temática de fantasía y magia (hextech)  
✓ Alta resolución (mínimo 1920px ancho)  
✓ Formato: JPG/WebP optimizado

#### Evitar

✗ Imágenes pixeladas o de baja calidad  
✗ Colores brillantes no relacionados (rosa, verde lima)  
✗ Imágenes genéricas sin relación con LoL  
✗ Fotografías realistas que rompan la estética  
✗ Fondos blancos o muy claros  
✗ Marcas de agua visibles

### Formatos y Resoluciones

#### Hero Banners
- 1920x1080px (16:9)
- JPG/WebP < 300KB

#### Thumbnails
- 512x512px (1:1)
- JPG/WebP < 100KB

#### Iconos/Patterns
- 512x512px
- PNG transparente

---

## 6. Componentes de Interfaz (UI)

### Botones

#### Variantes de Botones

**Default** - Botón Principal
- `variant="default"`

**Hero (Gradiente Épico)**
- `variant="hero"`
- **Ejemplo**: Comenzar Ahora

**Magic (Azul)**
- `variant="magic"`
- **Ejemplo**: Acción Mágica

**Outline**
- `variant="outline"`
- **Ejemplo**: Ver Más

#### Tamaños

- **Small**: `size="sm"` - Pequeño
- **Large**: `size="lg"` - Grande
- **XL**: `size="xl"` - Extra Grande

#### Con Icono
- Usar `leftIcon` o `rightIcon` según corresponda

#### Estados de Botones

- **Normal**: Color base, sombra sutil
- **Hover**: `scale-105`, `shadow-2xl`
- **Disabled**: `opacity-50`, no pointer

### Cards

#### Card Estándar
Con efecto hover dorado, backdrop blur y scale animation
- `bg-card/80 backdrop-blur hover:border-gold hover:scale-105`

#### Card Mágica
Con efecto hover azul y sombra mágica
- `bg-card/60 backdrop-blur hover:shadow-blue`

### Formularios

Usar variante `outline` para inputs con bordes visibles.

### Badges

- Variante `gold` para elementos destacados
- Variante `magic` para elementos mágicos

---

## 7. Espaciado y Layout

### Sistema de Grid

Tailwind Grid (12 columnas)

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
```

**Ejemplo**: grid de 4 columnas en desktop, 2 en tablet, 1 en móvil

### Escala de Espaciado

- **4px**: `gap-1`, `p-1`, `m-1`
- **8px**: `gap-2`, `p-2`, `m-2`
- **16px**: `gap-4`, `p-4`, `m-4`
- **24px**: `gap-6`, `p-6`, `m-6`
- **32px**: `gap-8`, `p-8`, `m-8`

Usar escala consistente: 4, 8, 16, 24, 32, 48, 64px

### Breakpoints Responsive

- **Mobile**: < 640px - `base`
- **SM**: ≥ 640px - `sm:`
- **MD**: ≥ 768px - `md:`
- **LG**: ≥ 1024px - `lg:`
- **XL**: ≥ 1280px - `xl:`

---

## 8. Textos y Tono de Contenido

### Personalidad de la Marca

- **Competitivo pero Accesible**: Inspirador sin ser intimidante
- **Cercano y Comunitario**: Tono conversacional, inclusivo
- **Épico y Motivador**: Lenguaje que evoca grandeza

### Reglas de Redacción

✓ Usar "tú" en lugar de "usted"  
✓ Terminología de LoL correcta (Grieta del Invocador, etc.)  
✓ CTAs claros y directos  
✓ Evitar jerga técnica innecesaria  
✓ Frases cortas y escaneables  
✗ No usar lenguaje tóxico o negativo  
✗ No hacer promesas que no podamos cumplir

### Ejemplos de CTAs (Llamados a la Acción)

#### ✓ Recomendado

- "Comenzar ahora"
- "Explorar campeones"
- "Únete a la comunidad"
- "Descubre tu main"

#### ~ Neutral

- "Ver más"
- "Leer más"
- "Continuar"
- "Siguiente"

#### ✗ Evitar

- "Click aquí"
- "Enviar"
- "Aceptar"
- "OK"

---

## 9. Accesibilidad

### Contraste de Colores

**Dorado sobre Fondo Oscuro**
- ✓ Ratio: 8.2:1 (AAA)

**Texto Oscuro sobre Dorado**
- ✓ Ratio: 7.1:1 (AAA)

### Requisitos WCAG

- Nivel AA: mínimo 4.5:1 para texto normal
- Nivel AA: mínimo 3:1 para texto grande
- Nivel AAA: mínimo 7:1 (objetivo)

### Normas de Accesibilidad

- **Textos Alternativos**: Todas las imágenes deben tener alt descriptivo
- **Navegación por Teclado**: Tab order lógico, focus visible
- **Tamaño de Texto**: Mínimo 16px para cuerpo, escalable
- **ARIA Labels**: Usar en iconos y controles interactivos

---

## 10. Ejemplos de Aplicación

### Ejemplo de Buen Uso

**Descubre tu Campeón**

Explora más de 160 campeones únicos y encuentra tu estilo de juego perfecto

**Comenzar ahora**

✓ Colores correctos • ✓ Tipografía consistente • ✓ CTA claro • ✓ Espaciado adecuado

### Ejemplo de Mal Uso

**Descubre tu Campeón**

Haz click aquí para ver los campeones disponibles en nuestra base de datos

**Click aquí**

✗ Colores incorrectos • ✗ Fondo blanco • ✗ Tipografía inconsistente • ✗ CTA genérico

--

**Última actualización: 2025**

