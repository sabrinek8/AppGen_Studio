from pydantic import BaseModel
from typing import Dict, Any, Optional

class ProjectRequest(BaseModel):
    description: str
    features: Optional[str] = ""

class ProjectResponse(BaseModel):
    success: bool
    project_data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
