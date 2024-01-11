param(
    [CmdletBinding()]
    [string]
    [Parameter(Mandatory, HelpMessage = "Available options: '.\video-processing-service\src', '.\youtube-web-client'")]
    [ValidateSet('.\video-processing-service\src', '.\youtube-web-client', IgnoreCase = $false)]
    [ArgumentCompleter({
        [OutputType([System.Management.Automation.CompletionResult])]
        param(
            [string] $CommandName,
            [string] $ParameterName,
            [string] $WordToComplete,
            [System.Management.Automation.Language.CommandAst] $CommandAst,
            [System.Collections.IDictionary] $FakeBoundParameters
        )
        
        $possibleValues = @('.\video-processing-service\src', '.\youtube-web-client')

        if ($fakeBoundParameters.ContainsKey('Component')) {
            $possibleValues | Where-Object {
                $_ -like "$wordToComplete*"
            }
        } else {
            $possibleValues.Values | ForEach-Object {$_}
        }
    })]
    $Component,
    [string]
    [ValidateNotNullOrEmpty()]
    [Parameter(Mandatory, HelpMessage = "Image destination, e.g. 'remote repo/image name'")]
    $TargetImageName,
    [bool]
    $ShouldPush = $false,
    [bool]
    $CleanupConfigDirs = $false
)

$ErrorActionPreference = 'STOP'

# Initialize directories with pre-req config folders
. ".\initializeDirs.ps1" $Component

$lastSlash = getLastSlashIndex $Component
$rootDir = $Component.substring(0, $lastSlash)
Write-Host "`nBuilding '$rootDir'..."

Push-Location $rootDir

try {
    & docker build -t $TargetImageName .

    if ($ShouldPush -eq $TRUE) {
        & docker push $TargetImageName
    }
}
finally {
    $ErrorActionPreference = 'Continue'

    if ($CleanupConfigDirs -eq $TRUE) {
        # Clean up config folders
        . ".\cleanupDirs.ps1" $Component
    }

    Pop-Location
}
