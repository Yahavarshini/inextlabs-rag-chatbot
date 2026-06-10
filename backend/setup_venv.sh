#!/bin/bash
set -e

echo "=== InextLabs RAG Chatbot - Backend Setup ==="
echo
echo "Creating virtual environment..."
python3 -m venv venv
echo
echo "Activating virtual environment..."
source venv/bin/activate
echo
echo "Upgrading pip..."
pip install --upgrade pip
echo
echo "Installing dependencies..."
pip install -r requirements.txt
echo
echo "=== Setup complete! ==="
echo
echo "To activate the virtual environment, run:"
echo "  source venv/bin/activate"
echo
echo "To start the backend server, run:"
echo "  uvicorn app.main:app --reload --port 8000"
