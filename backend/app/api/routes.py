from fastapi import APIRouter, HTTPException
from app.models.schemas import ProjectRequest, ProjectResponse
from app.services.generator import generate_react_project

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "React Project Generator API is running"}

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "React Project Generator"}

@router.post("/generate-project", response_model=ProjectResponse)
async def generate_project(request: ProjectRequest):
    return await generate_react_project(request)
