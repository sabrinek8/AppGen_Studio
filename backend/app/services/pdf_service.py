import PyPDF2
import logging
from io import BytesIO

logger = logging.getLogger(__name__)

class PDFService:
    @staticmethod
    def extract_text_from_pdf(pdf_content: bytes) -> str:
        """
        Extrait le texte d'un fichier PDF
        
        Args:
            pdf_content: Contenu du fichier PDF en bytes
            
        Returns:
            str: Texte extrait du PDF
        """
        try:
            # Créer un objet BytesIO à partir du contenu
            pdf_file = BytesIO(pdf_content)
            
            # Créer un lecteur PDF
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Extraire le texte de toutes les pages
            text_content = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text_content += page.extract_text() + "\n"
            
            # Nettoyer le texte
            text_content = text_content.strip()
            
            if not text_content:
                logger.warning("Aucun texte extractible trouvé dans le PDF")
                return "Contenu PDF non extractible ou vide"
            
            return text_content
            
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction du texte PDF: {str(e)}")
            raise ValueError(f"Erreur lors de la lecture du PDF: {str(e)}")
    
    @staticmethod
    def is_pdf_file(filename: str) -> bool:
        """
        Vérifie si un fichier est un PDF basé sur son extension
        
        Args:
            filename: Nom du fichier
            
        Returns:
            bool: True si c'est un PDF, False sinon
        """
        return filename.lower().endswith('.pdf')
    
    @staticmethod
    def validate_pdf_size(pdf_size: int, max_size_mb: int = 10) -> bool:
        """
        Valide la taille d'un fichier PDF
        
        Args:
            pdf_size: Taille du fichier en bytes
            max_size_mb: Taille maximale autorisée en MB
            
        Returns:
            bool: True si la taille est valide, False sinon
        """
        max_size_bytes = max_size_mb * 1024 * 1024
        return pdf_size <= max_size_bytes