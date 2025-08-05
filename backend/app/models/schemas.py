from pydantic import BaseModel
from typing import Dict, Any, Optional , List
from datetime import datetime

class ProjectRequest(BaseModel):
    description: str
    features: Optional[str] = ""

class ProjectResponse(BaseModel):
    success: bool
    project_data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class PDFResponse(BaseModel):
    success: bool
    filename: str
    text_content: Optional[str] = None
    error: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    success: bool
    message: str
    updated_project: Optional[Dict[str, str]] = None
    project_version: Optional[int] = None
    error: Optional[str] = None

class ProjectHistoryResponse(BaseModel):
    success: bool
    project_id: str
    chat_history: List[ChatMessage]
    current_project: Dict[str, str]

class EvaluationRequest(BaseModel):
    test_cases: Optional[List[Dict[str, Any]]] = None
    use_default_cases: bool = True

class EvaluationResponse(BaseModel):
    success: bool
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None