#!/bin/bash
set -e

echo "==================================="
echo "TaxFlow Production Build Script"
echo "==================================="

echo "[1/3] Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "[2/3] Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn uvicorn

echo "[3/3] Starting server..."
echo "The application is now accessible at http://localhost:8000"
echo "To stop, press Ctrl+C"

# Run gunicorn with uvicorn workers for production stability
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
