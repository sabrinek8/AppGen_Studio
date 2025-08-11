# Frontend Generator Evaluation System

## Overview
Automated evaluation system for React Native Web projects using LLM-as-a-Judge methodology with weighted scoring and MLflow tracking.

## How It Works

### 1. **Project Generation**
- User provides description and features
- Frontend generator agent creates React Native Web project
- System extracts generated files (JSON format)

### 2. **LLM Evaluation**
The system evaluates projects across 3 criteria (1-10 scale):

| Criteria | Weight | Description |
|----------|--------|-------------|
| **Requirements Fulfillment** | 50% | How well the project matches user description and requested features |
| **Code Quality** | 25% | Clean code, proper structure, correct syntax |
| **React Native Web Compliance** | 25% | Proper usage of react-native-web conventions |

### 3. **Scoring System**
- **Simple Score**: Average of all three criteria
- **Weighted Score**: `(Requirements × 0.5) + (Code Quality × 0.25) + (Compliance × 0.25)`
- **Success Rate**: Percentage of projects scoring ≥7/10

### 4. **MLflow Tracking**
Automatically logs:
- Individual project evaluations
- Batch evaluation results
- Performance metrics over time
- Generated files and feedback

## Usage

### Manual Evaluation
```python
from app.evaluation.simple_evaluator import run_simple_evaluation

# Run with predefined test cases
results = run_simple_evaluation()
```

### Automatic Evaluation
Projects are automatically evaluated when generated via the API:
```python
# Evaluation happens automatically in generator service
response = await generate_react_project(request)
# Response includes evaluation scores
```

## Test Cases Structure
```python
test_cases = [
    {
        "description": "Todo list application",
        "features": "Add, delete, mark tasks as complete"
    }
]
```

## Output Metrics
```
Total Test Cases: 3
Successful Cases: 3
Overall Score (Simple Avg): 7.5/10
Weighted Score (Req 50%): 8.2/10
Success Rate (Weighted): 66.7%

Requirements Score: 9.0/10 (Weight: 50%)
Code Quality Score: 7.0/10 (Weight: 25%)
Compliance Score: 6.5/10 (Weight: 25%)
```

## Key Features
- ✅ **Weighted scoring** prioritizing requirements fulfillment
- ✅ **Automatic evaluation** on every project generation
- ✅ **MLflow integration** for experiment tracking
- ✅ **Failure handling** with fallback scores
- ✅ **Backward compatibility** with existing systems

## Files
- `simple_evaluator.py` - Main evaluation logic
- `generator.py` - Integration with project generation
- MLflow experiments: `Frontend_Generator_Evaluation`, `Project_Generation_Evaluation`

## Why Weighted Scoring?
Traditional averaging treats all criteria equally, but **requirements fulfillment is most important** - a technically perfect app that doesn't meet user needs is still a failure. The 50/25/25 weighting reflects real-world priorities.