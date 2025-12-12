# Solución para el Problema de Versión de PHP

## Problema
Laravel 12 requiere PHP >= 8.2.0, pero tu XAMPP tiene PHP 8.0.30.

## Soluciones

### Opción 1: Actualizar XAMPP (Recomendado)

1. Descarga la última versión de XAMPP con PHP 8.2+ desde: https://www.apachefriends.org/
2. Instala la nueva versión
3. Copia tus proyectos a la nueva instalación
4. Ejecuta las migraciones normalmente

### Opción 2: Instalar PHP 8.2+ Manualmente

1. Descarga PHP 8.2+ desde: https://windows.php.net/download/
2. Extrae PHP a una carpeta (ej: `C:\php82`)
3. Agrega PHP al PATH del sistema
4. Actualiza la configuración de Apache en XAMPP para usar la nueva versión

### Opción 3: Usar el Script SQL Directo (Temporal)

Si necesitas crear las tablas ahora mismo sin actualizar PHP:

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Selecciona la base de datos `lol_gg`
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido de `database/migraciones_sql_directas.sql`
5. Haz clic en "Continuar" o "Ejecutar"

O desde línea de comandos:

```bash
C:\xampp\mysql\bin\mysql.exe -u root lol_gg < database\migraciones_sql_directas.sql
```

**Nota:** Este método crea las tablas pero no registra las migraciones en Laravel. Después de actualizar PHP, ejecuta `php artisan migrate` para sincronizar.

### Opción 4: Usar Laravel Sail (Docker)

Si tienes Docker instalado:

```bash
cd server
php artisan sail:install
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
```

## Verificar Versión de PHP

Para verificar qué versión de PHP estás usando:

```bash
php -v
```

O desde el navegador, crea un archivo `info.php`:

```php
<?php phpinfo(); ?>
```

## Recomendación

La mejor opción es **actualizar XAMPP** a una versión con PHP 8.2+, ya que:
- Es la solución más limpia
- Mantiene todo sincronizado
- Permite usar todas las características de Laravel 12
- Evita problemas de compatibilidad futuros

