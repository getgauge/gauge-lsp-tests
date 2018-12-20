param(
    [string]$gauge_env = "js"
)
$env:PATH="$env:PATH;$env:GAUGE_ROOT" 
gauge run --env=$gauge_env --tags='!knownIssue & actions_on_project_load'