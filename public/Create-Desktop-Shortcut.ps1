# PowerShell script to create Bluey Windows Desktop App shortcut
$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Bluey.lnk")
$Shortcut.TargetPath = "msedge.exe"
$Shortcut.Arguments = "--app=https://ais-pre-i2ejhtnfja2hequjcpfrjz-209220523134.europe-west2.run.app --window-size=1280,820"
$Shortcut.Description = "Bluey - Googly Eyes Desktop & Phone Companion"
$Shortcut.Save()
Write-Host "Created Bluey shortcut on your Desktop!" -ForegroundColor Green
Start-Process "$DesktopPath\Bluey.lnk"
