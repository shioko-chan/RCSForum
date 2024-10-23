param (
    [string]$Path,
    [string]$newName
)
$exts = @("ttss", "ttml", "js", "json")
Get-ChildItem -Path . -Recurse | Where-Object {
    $ext = $_.Extension.TrimStart(".")
    $exts -contains $ext
} | ForEach-Object {
    $name = $newName + $_.Extension
    Rename-Item -Path $_.FullName -NewName $name
}
Rename-Item -Path $Path -NewName $newName