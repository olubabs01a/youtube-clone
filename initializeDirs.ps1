param(
    [string[]]
    [Parameter(HelpMessage = 'Destination for pre-reqs to be copied')]
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
    Write-Host "`nInitializing '$rootDir'..."

    # Copy required folders
    $component = $_
    $preReqs | ForEach-Object {Copy-Item -Path $_ -Destination $component -Recurse -Force}

    Write-Host "Done" -ForegroundColor Green
}
