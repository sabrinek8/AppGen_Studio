from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.api.pdf_routes import router as pdf_router
from app.config.settings import configure_logging
from app.api.chat_routes import router as chat_router

# Config logging
configure_logging()

app = FastAPI(title="React Project Generator API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(router)
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(pdf_router, prefix="/api/pdf", tags=["PDF"])