@echo off
echo Deploying to Supabase...
echo.

REM Change to project directory
cd /d "%~dp0"

REM Check if files exist
if not exist "supabase\functions\server\index.ts" (
    echo ERROR: Cannot find supabase\functions\server\index.ts
    echo Please make sure you are in the correct directory
    pause
    exit /b 1
)

echo Files found! Deploying...
echo.

supabase functions deploy server --project-ref hovedryqutuucipuqxca --no-verify-jwt

echo.
echo Deployment complete!
pause
