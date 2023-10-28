#!/bin/bash
set -e

echo "Removing existing frontend directory..."
if [ -d "backend/frontend" ]; then
    rm -r "backend/frontend"
fi

echo "Moving to frontend directory..."
cd frontend

echo "Building frontend..."
npm install
npm run build --prod
echo "Build complete!"
if [ ! -d "build" ]; then
    echo "Build failed, exiting script."
    exit 1
fi

echo "Moving to root directory..."
cd ..

echo "Moving build folder to Django project..."
mv "frontend/build" "backend/frontend"

echo "Moving all frontend files in static folder..."
mv "backend/frontend/"* "backend/frontend/static"

echo "Moving index.html to templates folder..."
mv "backend/frontend/static/index.html" "backend/frontend"

echo "Done!"