from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.pdf_service import PDFService
from app.models.schemas import PDFResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/extract-pdf-text", response_model=PDFResponse)
async def extract_pdf_text(file: UploadFile = File(...)):
    """
    Extrait le texte d'un fichier PDF uploadé
    
    Args:
        file: Fichier PDF uploadé
        
    Returns:
        PDFResponse: Réponse contenant le texte extrait
    """
    try:
        # Vérifier que c'est un fichier PDF
        if not PDFService.is_pdf_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="Le fichier doit être un PDF (.pdf)"
            )
        
        # Lire le contenu du fichier
        pdf_content = await file.read()
        
        # Valider la taille du fichier
        if not PDFService.validate_pdf_size(len(pdf_content)):
            raise HTTPException(
                status_code=400,
                detail="Le fichier PDF est trop volumineux (max 10MB)"
            )
        
        # Extraire le texte
        extracted_text = PDFService.extract_text_from_pdf(pdf_content)
        
        return PDFResponse(
            success=True,
            filename=file.filename,
            text_content=extracted_text
        )
        
    except ValueError as e:
        logger.error(f"Erreur de validation PDF: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Erreur inattendue lors de l'extraction PDF: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur interne lors du traitement du PDF: {str(e)}"
        )