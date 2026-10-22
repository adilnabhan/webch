Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Pushing Discipl Challenges Web to GitHub" -ForegroundColor Cyan
Write-Host "  Repository: https://github.com/adilnabhan/webch.git" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot

Write-Host "`n[1/5] Initializing Git repository..." -ForegroundColor Yellow
git init

Write-Host "[2/5] Staging files..." -ForegroundColor Yellow
git add .

Write-Host "[3/5] Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit: Discipl Challenges and Rewards Web Platform"

Write-Host "[4/5] Setting main branch & remote..." -ForegroundColor Yellow
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/adilnabhan/webch.git

Write-Host "[5/5] Pushing to GitHub (main)..." -ForegroundColor Yellow
git push -u origin main

Write-Host "`nSuccessfully pushed to https://github.com/adilnabhan/webch.git" -ForegroundColor Green
