Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = "C:\project\zowasel-multitenancy-admin\Redesign the Zowasel Staff Onboarding page into a modern.docx"
$tempFile = [System.IO.Path]::GetTempFileName() + ".zip"
[System.IO.File]::Copy($docxPath, $tempFile, $true)

$zip = [System.IO.Compression.ZipFile]::OpenRead($tempFile)
$mediaEntries = $zip.Entries | Where-Object { $_.FullName -like "word/media/*" }
New-Item -ItemType Directory -Force -Path "C:\project\zowasel-multitenancy-admin\docx_media" | Out-Null
foreach ($entry in $mediaEntries) {
    $target = Join-Path "C:\project\zowasel-multitenancy-admin\docx_media" $entry.Name
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $target, $true)
    Write-Output "Extracted: $($entry.Name)"
}
$zip.Dispose()
[System.IO.File]::Delete($tempFile)
Write-Output "DONE"

