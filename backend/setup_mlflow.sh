#!/bin/bash

# setup_mlflow.sh - Simple script to start MLflow UI locally

echo "Setting up MLflow for React Project Generator..."

# Check if MLflow is installed
if ! command -v mlflow &> /dev/null; then
    echo "MLflow not found. Installing..."
    pip install mlflow==2.8.1
fi

# Create mlruns directory if it doesn't exist
mkdir -p mlruns

echo "Starting MLflow UI on http://localhost:5000"
echo "Press Ctrl+C to stop"

# Start MLflow server
mlflow server --host 127.0.0.1 --port 5000

echo "MLflow UI stopped"