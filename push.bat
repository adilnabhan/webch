@echo off
echo ========================================================
echo   Pushing Discipl Challenges Web to GitHub
echo   Repository: https://github.com/adilnabhan/webch.git
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/5] Initializing Git...
git init

echo [2/5] Staging files...
git add .

echo [3/5] Committing changes...
git commit -m "Initial commit: Discipl Challenges and Rewards Web Platform"

echo [4/5] Setting main branch and origin...
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/adilnabhan/webch.git

echo [5/5] Pushing to GitHub (main)...
git push -u origin main

echo.
echo ========================================================
echo   Completed successfully!
echo ========================================================
pause
