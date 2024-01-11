param(
    [string[]]
    [Parameter(HelpMessage = 'Destination for pre-reqs to be removed')]
    $components = @('.\video-processing-service\src', '.\youtube-api-service\functions', '.\youtube-web-client')
)

$ErrorActionPreference = 'STOP'

function getLastSlashIndex ([string] $str){
    $lastSlash = $str.LastIndexOf('\')

    if ($lastSlash -eq 1) {
        $lastSlash = $str.ToString().Length
    }

    return $lastSlash
}

$preReqs = @('.\configuration', '.\types', '.\utils')

[array]$components | ForEach-Object {
    $lastSlash = getLastSlashIndex $_
    $rootDir = $_.substring(0, $lastSlash)
    Write-Host "`nCleaning '$rootDir'..."

    # Remove required folders
    Push-Location $_
    $preReqs | ForEach-Object { Remove-Item -Path $_ -Recurse -Force -ErrorAction SilentlyContinue }
    Pop-Location

    Write-Host "Done" -ForegroundColor Green
}
