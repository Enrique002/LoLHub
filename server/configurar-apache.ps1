# Script para configurar Apache en XAMPP para Laravel
# Ejecutar como Administrador

Write-Host "=== Configuración de Apache para Laravel ===" -ForegroundColor Cyan
Write-Host ""

$apacheConf = "C:\xampp\apache\conf\httpd.conf"
$vhostsConf = "C:\xampp\apache\conf\extra\httpd-vhosts.conf"
$hostsFile = "C:\Windows\System32\drivers\etc\hosts"

# Verificar que los archivos existan
if (-not (Test-Path $apacheConf)) {
    Write-Host "ERROR: No se encontró $apacheConf" -ForegroundColor Red
    Write-Host "Asegúrate de que XAMPP esté instalado en C:\xampp" -ForegroundColor Yellow
    exit 1
}

Write-Host "1. Verificando mod_rewrite..." -ForegroundColor Yellow
$httpdContent = Get-Content $apacheConf -Raw
if ($httpdContent -match "#LoadModule rewrite_module") {
    Write-Host "   mod_rewrite está comentado. Descomentando..." -ForegroundColor Yellow
    $httpdContent = $httpdContent -replace "#LoadModule rewrite_module", "LoadModule rewrite_module"
    Set-Content -Path $apacheConf -Value $httpdContent -NoNewline
    Write-Host "   ✓ mod_rewrite habilitado" -ForegroundColor Green
} elseif ($httpdContent -match "LoadModule rewrite_module") {
    Write-Host "   ✓ mod_rewrite ya está habilitado" -ForegroundColor Green
} else {
    Write-Host "   ⚠ No se encontró mod_rewrite en la configuración" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. Verificando VirtualHosts..." -ForegroundColor Yellow
if ($httpdContent -match "#Include conf/extra/httpd-vhosts.conf") {
    Write-Host "   VirtualHosts está comentado. Descomentando..." -ForegroundColor Yellow
    $httpdContent = $httpdContent -replace "#Include conf/extra/httpd-vhosts.conf", "Include conf/extra/httpd-vhosts.conf"
    Set-Content -Path $apacheConf -Value $httpdContent -NoNewline
    Write-Host "   ✓ VirtualHosts habilitado" -ForegroundColor Green
} elseif ($httpdContent -match "Include conf/extra/httpd-vhosts.conf") {
    Write-Host "   ✓ VirtualHosts ya está habilitado" -ForegroundColor Green
}

Write-Host ""
Write-Host "3. Configurando VirtualHost..." -ForegroundColor Yellow
$vhostConfig = @"

# Configuración para LoL.GG Laravel
<VirtualHost *:80>
    ServerName lol-gg.local
    ServerAlias www.lol-gg.local
    DocumentRoot "C:/xampp/htdocs/tfg/server/public"
    
    <Directory "C:/xampp/htdocs/tfg/server/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog "C:/xampp/apache/logs/lol-gg-error.log"
    CustomLog "C:/xampp/apache/logs/lol-gg-access.log" common
</VirtualHost>
"@

if (Test-Path $vhostsConf) {
    $vhostsContent = Get-Content $vhostsConf -Raw
    if ($vhostsContent -notmatch "lol-gg.local") {
        Add-Content -Path $vhostsConf -Value "`n$vhostConfig"
        Write-Host "   ✓ VirtualHost agregado" -ForegroundColor Green
    } else {
        Write-Host "   ✓ VirtualHost ya existe" -ForegroundColor Green
    }
} else {
    Set-Content -Path $vhostsConf -Value $vhostConfig
    Write-Host "   ✓ Archivo de VirtualHosts creado" -ForegroundColor Green
}

Write-Host ""
Write-Host "4. Configurando hosts de Windows..." -ForegroundColor Yellow
try {
    $hostsContent = Get-Content $hostsFile -ErrorAction Stop
    if ($hostsContent -notmatch "lol-gg.local") {
        Add-Content -Path $hostsFile -Value "`n127.0.0.1    lol-gg.local"
        Write-Host "   ✓ Entrada agregada a hosts" -ForegroundColor Green
    } else {
        Write-Host "   ✓ Entrada ya existe en hosts" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ No se pudo modificar hosts. Ejecuta como Administrador o agrega manualmente:" -ForegroundColor Yellow
    Write-Host "     127.0.0.1    lol-gg.local" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Configuración completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Reinicia Apache desde el Panel de Control de XAMPP" -ForegroundColor White
Write-Host "2. Prueba visitando: http://localhost/tfg/server/public/api/v1/champions" -ForegroundColor White
Write-Host "   O si configuraste el VirtualHost: http://lol-gg.local/api/v1/champions" -ForegroundColor White
Write-Host ""
Write-Host "El frontend está configurado para usar: http://localhost/tfg/server/public/api/v1" -ForegroundColor Cyan

