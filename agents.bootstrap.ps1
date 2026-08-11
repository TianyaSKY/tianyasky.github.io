<#
.SYNOPSIS
  下载项目 AGENTS.md 模板到当前目录。

.DESCRIPTION
  在新项目根目录运行本脚本，会从本仓库下载精简的 AGENTS.md。
#>

$Url = "https://raw.githubusercontent.com/tianyasky/tianyasky.github.io/main/AGENTS.md"
$OutPath = Join-Path (Get-Location) "AGENTS.md"

try {
    Invoke-WebRequest -Uri $Url -OutFile $OutPath -UseBasicParsing -ErrorAction Stop
    Write-Host "AGENTS.md 已下载到: $OutPath" -ForegroundColor Green
} catch {
    Write-Error "下载失败: $($_.Exception.Message)"
    exit 1
}
