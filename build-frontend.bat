@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo Removing existing frontend directory...
IF EXIST "backend\frontend\" (
    rmdir /s /q "backend\frontend"
)

echo Moving to frontend directory...
cd frontend

echo Building frontend...
call npm run build --prod
echo Build complete!
IF NOT EXIST "build\" (
    echo Build failed, exiting script.
    exit /b
)

echo Moving to root directory...
cd ..

echo Moving build folder to Django project...
move "frontend\build" "backend\frontend"

echo Moving all frontend files in static folder...
move "backend\frontend\*.*" "backend\frontend\static"

echo Moving index.html to templates folder...
move "backend\frontend\static\index.html" "backend\frontend"

echo Done!