import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from services.gemini_service import generate_description
from services.murf_service import generate_speech, fetch_voices_from_murf, resolve_voice_id
from services.db import (
    create_user,
    find_user_by_email,
    find_user_by_id,
    update_user_last_login,
    save_travel_guide,
    get_history,
    get_guide_by_id,
    delete_guide,
    toggle_favorite,
    get_user_stats,
    is_connected
)
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    jwt_required,
    optional_jwt
)

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("travelai_backend")

app = Flask(__name__)

# CORS configuration (supports local dev and production frontends)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        r"https://.*\.vercel\.app",
    ]
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url:
        origins.append(frontend_url.strip())

CORS(app, resources={
    r"/*": {
        "origins": origins,
        "methods": ["GET", "POST", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

ALLOWED_ANSWER_TYPES = {"Summary", "Detailed"}
MAX_PLACE_LENGTH = 150
MAX_LANGUAGE_LENGTH = 50

# ----------------- HEALTH CHECK -----------------
@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify backend service and database connectivity."""
    return jsonify({
        "success": True,
        "status": "ok",
        "service": "TravelAI API",
        "port": int(os.getenv("PORT", 5002)),
        "mongo_connected": is_connected()
    }), 200

# ----------------- AUTHENTICATION -----------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()

    if not name or len(name) < 2:
        return jsonify({
            "success": False,
            "error": {"message": "Please provide your full name (minimum 2 characters)."}
        }), 400

    if not email or "@" not in email or "." not in email:
        return jsonify({
            "success": False,
            "error": {"message": "Please provide a valid email address."}
        }), 400

    if not password or len(password) < 6:
        return jsonify({
            "success": False,
            "error": {"message": "Password must be at least 6 characters long."}
        }), 400

    existing = find_user_by_email(email)
    if existing:
        return jsonify({
            "success": False,
            "error": {"message": "An account with this email already exists."}
        }), 409

    pwd_hash = hash_password(password)
    user = create_user(name, email, pwd_hash)
    if not user:
        return jsonify({
            "success": False,
            "error": {"message": "Unable to create account. Please try again."}
        }), 500

    token = create_access_token(user["_id"], user["email"])
    return jsonify({
        "success": True,
        "data": {
            "token": token,
            "user": user
        }
    }), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()

    if not email or not password:
        return jsonify({
            "success": False,
            "error": {"message": "Please enter both email and password."}
        }), 400

    user = find_user_by_email(email)
    if not user:
        return jsonify({
            "success": False,
            "error": {"message": "Invalid email or password."}
        }), 401

    if not verify_password(password, user.get("password_hash", "")):
        return jsonify({
            "success": False,
            "error": {"message": "Invalid email or password."}
        }), 401

    update_user_last_login(user["_id"])
    token = create_access_token(user["_id"], user["email"])
    user.pop("password_hash", None)

    return jsonify({
        "success": True,
        "data": {
            "token": token,
            "user": user
        }
    }), 200

@app.route("/api/auth/me", methods=["GET"])
@jwt_required
def get_current_user():
    user = find_user_by_id(request.current_user_id)
    if not user:
        return jsonify({
            "success": False,
            "error": {"message": "User not found."}
        }), 404

    return jsonify({
        "success": True,
        "data": {
            "user": user
        }
    }), 200

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    return jsonify({
        "success": True,
        "data": {"message": "Logged out successfully."}
    }), 200

# ----------------- VOICES -----------------
@app.route("/api/voices", methods=["GET"])
@app.route("/voices", methods=["GET"])
def get_voices():
    try:
        remote_voices = fetch_voices_from_murf()
        if remote_voices:
            return jsonify({
                "success": True,
                "data": {"voices": remote_voices},
                "source": "murf_api",
                "voices": remote_voices
            }), 200
    except Exception as e:
        logger.warning(f"Voice listing error: {e}")

    return jsonify({
        "success": True,
        "data": {"voices": []},
        "source": "default_fallback",
        "voices": []
    }), 200

# ----------------- AI GENERATION -----------------
@app.route("/api/generate-audio-guide", methods=["POST"])
@app.route("/generate-audio-guide", methods=["POST"])
@optional_jwt
def generate_audio_guide():
    data = request.get_json(silent=True) or {}

    place = str(data.get("place", "")).strip()
    answer_type = str(data.get("answerType") or data.get("answer_type", "Summary")).strip()
    language = str(data.get("language", "English")).strip()
    voice_input = str(data.get("voiceId") or data.get("voice", "")).strip()
    locale_input = str(data.get("locale", "en-US")).strip()
    image = str(data.get("image", "")).strip()

    if not place:
        return jsonify({
            "success": False,
            "error": {"message": "Please choose or enter a destination first."}
        }), 400

    if len(place) > MAX_PLACE_LENGTH:
        return jsonify({
            "success": False,
            "error": {"message": f"Destination name is too long (maximum {MAX_PLACE_LENGTH} characters)."}
        }), 400

    if answer_type not in ALLOWED_ANSWER_TYPES:
        return jsonify({
            "success": False,
            "error": {"message": f"Invalid guide type. Allowed values: {', '.join(sorted(ALLOWED_ANSWER_TYPES))}."}
        }), 400

    # Resolve voice ID & locale
    voice_id, locale = resolve_voice_id(voice_input, language)
    if locale_input and "-" in locale_input:
        locale = locale_input

    # Step 1: Generate Gemini Narration
    logger.info(f"Generating travel narration for '{place}' in {language} ({answer_type})...")
    try:
        description = generate_description(place, answer_type, language)
        if not description:
            raise ValueError("Gemini returned empty text.")
    except Exception as err:
        logger.error(f"Gemini generation failure: {err}", exc_info=True)
        return jsonify({
            "success": False,
            "error": {"message": "We couldn't create your travel guide. Please try again."}
        }), 500

    # Step 2: Synthesize Speech with Murf AI
    logger.info(f"Synthesizing Murf AI voice '{voice_id}' (locale: {locale})...")
    try:
        audio_b64, audio_mime_type = generate_speech(description, voice_id, locale)
        if not audio_b64:
            raise ValueError("Murf returned empty audio data.")
    except Exception as err:
        logger.error(f"Murf speech generation failure: {err}", exc_info=True)
        return jsonify({
            "success": False,
            "error": {"message": "Your guide was created, but audio generation failed."},
            "description": description
        }), 500

    # Step 3: Save to Database / User History
    user_id = getattr(request, "current_user_id", None)
    saved_doc = save_travel_guide({
        "user_id": user_id,
        "place": place,
        "image": image,
        "language": language,
        "answer_type": answer_type,
        "voice": voice_input or voice_id,
        "voice_id": voice_id,
        "locale": locale,
        "description": description,
        "audio_data": audio_b64,
        "duration": "~3 min" if answer_type == "Detailed" else "~1 min"
    })

    return jsonify({
        "success": True,
        "data": {
            "guide_id": saved_doc["_id"],
            "place": place,
            "image": image,
            "language": language,
            "answer_type": answer_type,
            "voice_id": voice_id,
            "description": description,
            "audio": audio_b64,
            "audioMimeType": audio_mime_type
        },
        # Backwards compatible top-level fields
        "description": description,
        "audio": audio_b64,
        "audioMimeType": audio_mime_type
    }), 200

# ----------------- USER HISTORY & FAVORITES -----------------
@app.route("/api/history", methods=["GET"])
@jwt_required
def get_user_history():
    language = request.args.get("language")
    search = request.args.get("search")
    items = get_history(request.current_user_id, language=language, search=search)
    return jsonify({
        "success": True,
        "data": {
            "history": items,
            "total": len(items)
        }
    }), 200

@app.route("/api/history/<guide_id>", methods=["GET"])
@jwt_required
def get_history_detail(guide_id):
    guide = get_guide_by_id(guide_id, user_id=request.current_user_id)
    if not guide:
        return jsonify({
            "success": False,
            "error": {"message": "Travel guide not found."}
        }), 404
    return jsonify({
        "success": True,
        "data": {"guide": guide}
    }), 200

@app.route("/api/history/<guide_id>", methods=["DELETE"])
@jwt_required
def delete_history_item(guide_id):
    success = delete_guide(guide_id, user_id=request.current_user_id)
    if not success:
        return jsonify({
            "success": False,
            "error": {"message": "Travel guide not found or could not be deleted."}
        }), 404
    return jsonify({
        "success": True,
        "data": {"message": "Guide deleted successfully from your history."}
    }), 200

@app.route("/api/history/<guide_id>/favorite", methods=["POST"])
@jwt_required
def toggle_guide_favorite(guide_id):
    fav_status = toggle_favorite(guide_id, user_id=request.current_user_id)
    if fav_status is None:
        return jsonify({
            "success": False,
            "error": {"message": "Travel guide not found."}
        }), 404
    return jsonify({
        "success": True,
        "data": {"favorite": fav_status}
    }), 200

@app.route("/api/stats", methods=["GET"])
@jwt_required
def get_stats():
    stats = get_user_stats(request.current_user_id)
    return jsonify({
        "success": True,
        "data": {"stats": stats}
    }), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))
    debug = os.getenv("FLASK_ENV") == "development"
    logger.info(f"Starting TravelAI Production Flask Server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=debug)
