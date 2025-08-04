from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.evaluation.simple_evaluator import SimpleFrontendEvaluator, SIMPLE_TEST_CASES
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class EvaluationRequest(BaseModel):
    test_cases: Optional[List[Dict[str, Any]]] = None
    use_default_cases: bool = True

class EvaluationResponse(BaseModel):
    success: bool
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_frontend_generator(request: EvaluationRequest):
    """
    Evaluate the frontend generator agent using MLflow and LLM as judge
    """
    try:
        evaluator = SimpleFrontendEvaluator()
        
        # Use provided test cases or default ones
        test_cases = request.test_cases if request.test_cases else SIMPLE_TEST_CASES
        
        if not test_cases:
            raise ValueError("No test cases provided")
        
        # Log the test cases being used
        logger.info(f"Starting evaluation with {len(test_cases)} test cases")
        for i, tc in enumerate(test_cases):
            logger.info(f"Test case {i}: {tc}")
        
        # Run evaluation
        results = evaluator.evaluate_agent(test_cases)
        
        return EvaluationResponse(
            success=True,
            results=results
        )
        
    except Exception as e:
        logger.exception("Error during evaluation")
        return EvaluationResponse(
            success=False,
            error=str(e)
        )

@router.get("/evaluation/metrics")
async def get_latest_evaluation_metrics():
    """
    Get the latest evaluation metrics from MLflow
    """
    try:
        import mlflow
        
        # Get the latest run from the evaluation experiment
        experiment = mlflow.get_experiment_by_name("Frontend_Generator_Evaluation")
        if not experiment:
            raise HTTPException(status_code=404, detail="No evaluation experiment found")
        
        runs = mlflow.search_runs(
            experiment_ids=[experiment.experiment_id],
            max_results=1,
            order_by=["start_time DESC"]
        )
        
        if runs.empty:
            raise HTTPException(status_code=404, detail="No evaluation runs found")
        
        latest_run = runs.iloc[0]
        
        # Extract key metrics
        metrics = {
            "run_id": latest_run["run_id"],
            "start_time": latest_run["start_time"],
            "avg_overall_score": latest_run.get("metrics.avg_overall_score"),
            "avg_code_quality": latest_run.get("metrics.avg_code_quality"),
            "avg_requirements_fulfillment": latest_run.get("metrics.avg_requirements_fulfillment"),
            "avg_compliance": latest_run.get("metrics.avg_compliance"),
            "success_rate": latest_run.get("metrics.success_rate"),
            "total_test_cases": latest_run.get("metrics.total_test_cases")
        }
        
        return {"success": True, "metrics": metrics}
        
    except Exception as e:
        logger.exception("Error retrieving evaluation metrics")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/evaluation/test-cases")
async def get_default_test_cases():
    """
    Get the default test cases used for evaluation
    """
    return {
        "success": True,
        "test_cases": SIMPLE_TEST_CASES,
        "count": len(SIMPLE_TEST_CASES)
    }