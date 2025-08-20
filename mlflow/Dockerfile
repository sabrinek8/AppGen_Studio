# MLflow Dockerfile - Create once, use many times
FROM python:3.11-slim

# Set working directory
WORKDIR /mlflow

# Install system dependencies including curl for healthcheck
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Install MLflow and dependencies
RUN pip install --no-cache-dir \
    mlflow==2.8.1 \
    pymysql \
    psycopg2-binary \
    boto3

# Create necessary directories
RUN mkdir -p /mlflow/mlruns /mlflow/logs

# Set MLflow environment variables
ENV MLFLOW_TRACKING_URI=http://0.0.0.0:5000
ENV MLFLOW_BACKEND_STORE_URI=file:///mlflow/mlruns
ENV MLFLOW_DEFAULT_ARTIFACT_ROOT=file:///mlflow/mlruns

# Expose MLflow port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=20s --timeout=10s --start-period=30s --retries=10 \
    CMD curl -f http://localhost:5000 || exit 1

# Start MLflow server
CMD ["mlflow", "server", \
     "--backend-store-uri", "file:///mlflow/mlruns", \
     "--default-artifact-root", "file:///mlflow/mlruns", \
     "--host", "0.0.0.0", \
     "--port", "5000"]