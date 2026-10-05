import os
import re
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Cache client instance
_client = None

def get_gemini_client():
    """Initializes and returns the Google GenAI client using GEMINI_API_KEY."""
    global _client
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not configured in backend/.env")
    
    if _client is None:
        try:
            from google import genai
            _client = genai.Client(api_key=api_key)
        except Exception as e:
            logger.error(f"Failed to initialize Google GenAI Client: {e}")
            raise
    return _client

def clean_spoken_narration(text: str) -> str:
    """Removes residual markdown headings, asterisks, or bullet points to ensure natural speech."""
    if not text:
        return ""
    # Remove markdown headers like ### or ##
    cleaned = re.sub(r'#+\s*', '', text)
    # Remove bold/italic asterisks or underscores
    cleaned = re.sub(r'\*{1,3}|_{1,3}', '', cleaned)
    # Remove bullet symbols at start of lines
    cleaned = re.sub(r'(?m)^[\s*\-•>]+\s*', '', cleaned)
    # Condense multiple newlines/spaces
    cleaned = re.sub(r'\n{2,}', '\n\n', cleaned).strip()
    return cleaned

def generate_description(place: str, answer_type: str, language: str) -> str:
    """
    Generates an engaging, natural travel-guide audio narration using Google Gemini.
    
    :param place: Tourist destination name
    :param answer_type: 'Summary' (150-200 words) or 'Detailed' (350-450 words)
    :param language: Output language (e.g. English, Hindi, Telugu, Tamil)
    :return: AI-generated narration string in the requested language
    """
    client = get_gemini_client()

    if answer_type.lower() == "detailed":
        prompt = (
            "You are an expert professional tourist guide.\n"
            f"Create an immersive audio narration about:\n{place}\n"
            f"Language:\n{language}\n"
            "Cover:\n"
            "historical background\n"
            "important timeline\n"
            "architecture\n"
            "culture\n"
            "famous events\n"
            "interesting facts\n"
            "visitor insights\n"
            "Make it engaging and conversational.\n"
            "The output should sound natural when spoken aloud.\n"
            "Do not use markdown.\n"
            "Do not use bullet points.\n"
            "Do not use headings.\n"
            f"Respond ONLY in {language}.\n"
            "Do not invent uncertain facts.\n"
            "If historical information is uncertain, use cautious wording."
        )
    else:  # Summary / Quick Guide
        prompt = (
            "You are an expert professional tourist guide.\n"
            f"Create an engaging travel narration about:\n{place}\n"
            f"Language:\n{language}\n"
            "The guide should explain:\n"
            "historical significance\n"
            "why the destination is famous\n"
            "important architectural/cultural features\n"
            "interesting facts\n"
            "Keep it concise and suitable for approximately a 1-minute audio guide.\n"
            "Use natural spoken language.\n"
            "Do not use markdown.\n"
            "Do not use bullet points.\n"
            "Do not add headings.\n"
            f"Respond ONLY in {language}."
        )

    # Preferred current models for Google GenAI
    models_to_try = [
        "gemini-3.8-flash",
        "gemini-3.5-flash",
        "gemini-3-flash-preview",
        "gemini-flash-latest"
    ]
    last_error = None

    for model_name in models_to_try:
        try:
            logger.info(f"Generating travel guide for '{place}' ({answer_type}, {language}) using {model_name}...")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            raw_text = getattr(response, "text", "") or ""
            cleaned_text = clean_spoken_narration(raw_text)
            if cleaned_text:
                return cleaned_text
        except Exception as err:
            logger.warning(f"Gemini generation with {model_name} failed: {err}")
            last_error = err

    logger.error(f"All Gemini generation attempts failed: {last_error}")
    raise RuntimeError("Unable to generate the travel guide.") from last_error
