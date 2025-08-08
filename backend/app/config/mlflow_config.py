import os
import logging
import mlflow
from pathlib import Path

logger = logging.getLogger(__name__)

def configure_mlflow():
    """
    Configure MLflow for the application
    """
    try:
        # Set MLflow tracking URI
        mlflow_uri = os.getenv("MLFLOW_TRACKING_URI")
        
        if mlflow_uri:
            # Use provided tracking URI (e.g., for remote MLflow server)
            mlflow.set_tracking_uri(mlflow_uri)
            logger.info(f"MLflow configured with remote URI: {mlflow_uri}")
        else:
            # Use local file store
            mlruns_path = Path("mlruns")
            mlruns_path.mkdir(exist_ok=True)
            mlflow.set_tracking_uri(f"file://{mlruns_path.absolute()}")
            logger.info(f"MLflow configured with local file store: {mlruns_path.absolute()}")
        
        # Set default experiment for project evaluations
        experiment_name = "Project_Generation_Evaluation"
        try:
            experiment = mlflow.get_experiment_by_name(experiment_name)
            if experiment is None:
                experiment_id = mlflow.create_experiment(experiment_name)
                logger.info(f"Created MLflow experiment: {experiment_name} (ID: {experiment_id})")
            else:
                logger.info(f"Using existing MLflow experiment: {experiment_name} (ID: {experiment.experiment_id})")
        except Exception as e:
            logger.warning(f"Could not setup MLflow experiment: {e}")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to configure MLflow: {e}")
        return False

def get_mlflow_ui_url() -> str:
    """
    Get the MLflow UI URL
    """
    tracking_uri = mlflow.get_tracking_uri()
    
    if tracking_uri.startswith("file://"):
        # Local file store - MLflow UI typically runs on localhost:5000
        return "http://localhost:5000"
    else:
        # Remote tracking server
        return tracking_uri

# Environment variables that can be set:
# MLFLOW_TRACKING_URI - MLflow tracking server URI (optional, defaults to local file store)