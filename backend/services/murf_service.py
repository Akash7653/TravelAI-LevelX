import os
import base64
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

MURF_STREAM_URL = "https://api.murf.ai/v1/speech/stream"
MURF_GENERATE_URL = "https://api.murf.ai/v1/speech/generate"
MURF_VOICES_URL = "https://api.murf.ai/v1/speech/voices"

def get_murf_api_key() -> str:
    """Retrieves and validates the MURF_API_KEY from environment variables."""
    api_key = os.getenv("MURF_API_KEY", "").strip()
    if not api_key:
        raise ValueError("MURF_API_KEY environment variable is not configured in backend/.env")
    return api_key

def fetch_voices_from_murf():
    """
    Fetches available voices from Murf AI API.
    Returns list of voice objects or None if API key missing or request fails.
    """
    try:
        api_key = get_murf_api_key()
    except ValueError:
        logger.info("MURF_API_KEY not configured. Falling back to default curated voices.")
        return None

    try:
        headers = {
            "api-key": api_key,
            "Accept": "application/json"
        }
        response = requests.get(MURF_VOICES_URL, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                logger.info(f"Successfully retrieved {len(data)} voices from Murf API.")
                return data
            elif isinstance(data, dict) and "voices" in data:
                return data["voices"]
        logger.warning(f"Murf voices endpoint returned status {response.status_code}: {response.text[:200]}")
    except Exception as err:
        logger.warning(f"Could not fetch voices from Murf API: {err}")
    
    return None

# Murf Falcon-2 verified voice mapping for friendly display names & gender
VOICE_MAP = {
    # English
    ("english", "male"): ("en-US-miles", "en-US"),
    ("english", "female"): ("en-US-alicia", "en-US"),
    "matthew": ("en-US-miles", "en-US"),
    "alicia": ("en-US-alicia", "en-US"),
    "miles": ("en-US-miles", "en-US"),
    "natalie": ("en-US-natalie", "en-US"),

    # Hindi
    ("hindi", "male"): ("hi-IN-kabir", "hi-IN"),
    ("hindi", "female"): ("hi-IN-shweta", "hi-IN"),
    "aman": ("hi-IN-kabir", "hi-IN"),
    "namrita": ("hi-IN-shweta", "hi-IN"),
    "kabir": ("hi-IN-kabir", "hi-IN"),
    "shweta": ("hi-IN-shweta", "hi-IN"),

    # Tamil
    ("tamil", "male"): ("ta-IN-sarvesh", "ta-IN"),
    ("tamil", "female"): ("ta-IN-iniya", "ta-IN"),
    "murali": ("ta-IN-sarvesh", "ta-IN"),
    "iniya": ("ta-IN-iniya", "ta-IN"),
    "sarvesh": ("ta-IN-sarvesh", "ta-IN"),

    # Telugu
    ("telugu", "male"): ("en-US-zion", "te-IN"),
    ("telugu", "female"): ("en-US-josie", "te-IN"),
    "zion": ("en-US-zion", "te-IN"),
    "josie": ("en-US-josie", "te-IN"),
}

def resolve_voice_id(voice_input: str, language: str = "English", gender: str = "Female") -> tuple[str, str]:
    """Resolves friendly voice name, gender selection, or direct Murf voiceId into a valid (voiceId, locale) tuple."""
    if not voice_input:
        lang_key = (language.lower(), gender.lower())
        return VOICE_MAP.get(lang_key, ("en-US-natalie", "en-US"))

    cleaned = voice_input.strip()
    
    # Check if direct key in VOICE_MAP
    if cleaned.lower() in VOICE_MAP:
        return VOICE_MAP[cleaned.lower()]

    # Check language + gender
    if cleaned.lower() in ("male", "female"):
        lang_key = (language.lower(), cleaned.lower())
        if lang_key in VOICE_MAP:
            return VOICE_MAP[lang_key]

    # If it's already a full murf ID like en-US-natalie or hi-IN-kabir
    if "-" in cleaned:
        parts = cleaned.split("-")
        if len(parts) >= 3:
            locale = f"{parts[0]}-{parts[1]}"
            return cleaned, locale
        return cleaned, "en-US"

    return cleaned, "en-US"

def generate_speech(text: str, voice_id: str, locale: str = "en-US") -> tuple[str, str]:
    """
    Converts travel guide text into natural-sounding speech using Murf AI.
    Uses Murf Falcon 2 streaming TTS API, falling back to generate endpoint if needed.
    
    :param text: Text to synthesize
    :param voice_id: Selected Murf voice ID or friendly name
    :param locale: Locale code (e.g. en-US, hi-IN, te-IN, ta-IN)
    :return: Tuple of (base64_encoded_audio_data, mime_type)
    """
    # Resolve to validated Murf ID and locale
    valid_voice_id, valid_locale = resolve_voice_id(voice_id)
    if locale and "-" in locale:
        valid_locale = locale
    api_key = get_murf_api_key()

    if not text or not text.strip():
        raise ValueError("Text to synthesize cannot be empty.")
    if not voice_id or not voice_id.strip():
        raise ValueError("voiceId cannot be empty.")

    headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
    }

    # Attempt 1: Murf Falcon-2 Streaming TTS endpoint
    payload_stream = {
        "text": text,
        "voiceId": voice_id,
        "model": "falcon-2",
        "format": "MP3",
        "locale": locale or "en-US"
    }

    try:
        logger.info(f"Calling Murf Falcon-2 streaming TTS for voice '{voice_id}' (locale: {locale})...")
        response = requests.post(
            MURF_STREAM_URL,
            headers=headers,
            json=payload_stream,
            timeout=30,
            stream=True
        )

        if response.status_code == 200:
            audio_bytes = response.content
            if audio_bytes and len(audio_bytes) > 200:
                # Verify it's not a JSON error disguised as 200
                if not (audio_bytes.startswith(b"{") and b"error" in audio_bytes):
                    b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
                    logger.info(f"Murf Falcon 2 speech generated successfully ({len(audio_bytes)} bytes).")
                    return b64_audio, "audio/mpeg"

        logger.warning(
            f"Murf Falcon 2 stream failed with status {response.status_code}: {response.text[:300]}. "
            f"Trying Murf speech generate endpoint as fallback..."
        )
    except Exception as err:
        logger.warning(f"Error calling Murf streaming API: {err}. Trying fallback...")

    # Attempt 2: Murf standard /v1/speech/generate endpoint
    payload_generate = {
        "text": text,
        "voiceId": voice_id,
        "format": "MP3",
        "encodeAsBase64": True
    }

    try:
        response_gen = requests.post(
            MURF_GENERATE_URL,
            headers=headers,
            json=payload_generate,
            timeout=30
        )

        if response_gen.status_code == 200:
            data = response_gen.json()
            # If encodeAsBase64 was respected
            if "encodedAudio" in data and data["encodedAudio"]:
                return data["encodedAudio"], "audio/mpeg"
            if "audioFile" in data and data["audioFile"]:
                audio_url = data["audioFile"]
                file_resp = requests.get(audio_url, timeout=20)
                if file_resp.status_code == 200:
                    b64 = base64.b64encode(file_resp.content).decode("utf-8")
                    return b64, "audio/mpeg"

        # Handle specific error status codes
        if response_gen.status_code == 401:
            raise RuntimeError("Murf AI API Key is invalid or expired.")
        elif response_gen.status_code == 429:
            raise RuntimeError("Murf AI rate limit reached. Please wait a moment and try again.")
        elif response_gen.status_code == 400:
            err_msg = response_gen.text
            raise RuntimeError(f"Murf AI invalid voice/parameter request: {err_msg[:150]}")
        else:
            raise RuntimeError(f"Murf AI synthesis failed with status code {response_gen.status_code}")

    except Exception as e:
        logger.error(f"Murf speech generation error: {e}")
        raise
