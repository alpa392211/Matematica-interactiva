# ============================================================================
# MATEMÁTICA INTERACTIVA - Servidor Web Local Ligero (.NET TcpListener)
# Funciona sin permisos de Administrador y sin requerir Node.js ni Python.
# ============================================================================

param(
    [int]$Port = 8080,
    [int]$MaxRequests = 0
)

$RootPath = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$Endpoint = New-Object System.Net.IPEndPoint([System.Net.IPAddress]::Loopback, $Port)
$Listener = New-Object System.Net.Sockets.TcpListener($Endpoint)

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
}

$ServedCount = 0

try {
    $Listener.Start()
    Write-Output "=============================================================="
    Write-Output "  MATEMATICA INTERACTIVA - Servidor Educativo Activo"
    Write-Output "  Carpeta raiz: $RootPath"
    Write-Output "  URL en tu navegador: http://localhost:$Port/"
    Write-Output "  Presiona Ctrl + C para detener el servidor."
    Write-Output "=============================================================="

    while ($true) {
        $Client = $Listener.AcceptTcpClient()
        try {
            $Stream = $Client.GetStream()
            $Reader = New-Object System.IO.StreamReader($Stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)

            $RequestLine = $Reader.ReadLine()
            if (-not [string]::IsNullOrEmpty($RequestLine)) {
                while ($true) {
                    $HeaderLine = $Reader.ReadLine()
                    if ([string]::IsNullOrEmpty($HeaderLine)) { break }
                }

                $Parts = $RequestLine.Split(' ')
                $RawUrl = if ($Parts.Length -ge 2) { $Parts[1] } else { "/" }
                $CleanPath = ($RawUrl -split '\?')[0].TrimStart('/')
                $CleanPath = [System.Uri]::UnescapeDataString($CleanPath)

                if ([string]::IsNullOrWhiteSpace($CleanPath)) {
                    $CleanPath = "index.html"
                }

                $FilePath = Join-Path $RootPath ($CleanPath -replace '/', '\')

                if (Test-Path $FilePath -PathType Leaf) {
                    $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
                    $ContentType = $MimeTypes[$Ext]
                    if (-not $ContentType) { $ContentType = "application/octet-stream" }

                    $BodyBytes = [System.IO.File]::ReadAllBytes($FilePath)
                    $HeaderStr = "HTTP/1.1 200 OK`r`nContent-Type: $ContentType`r`nContent-Length: $($BodyBytes.Length)`r`nConnection: close`r`nCache-Control: no-cache`r`n`r`n"
                    $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($HeaderStr)

                    $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
                    $Stream.Write($BodyBytes, 0, $BodyBytes.Length)
                } else {
                    $NotFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - Archivo no encontrado: $CleanPath")
                    $HeaderStr = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($NotFoundBytes.Length)`r`nConnection: close`r`n`r`n"
                    $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($HeaderStr)

                    $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
                    $Stream.Write($NotFoundBytes, 0, $NotFoundBytes.Length)
                }
            }
            $Stream.Flush()
        } catch {
            # Ignorar desconexiones abruptas
        } finally {
            $Client.Close()
        }

        $ServedCount++
        if ($MaxRequests -gt 0 -and $ServedCount -ge $MaxRequests) {
            break
        }
    }
} finally {
    $Listener.Stop()
}
