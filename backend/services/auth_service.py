import os
import jwt
from functools import wraps
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "travelai_super_secret_jwt_key_2026_production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 72

def hash_password(password: str) -> str:
    """Hashes a plaintext password using Werkzeug's secure pbkdf2:sha256."""
    return generate_password_hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    """Verifies a plaintext password against its hash."""
    return check_password_hash(password_hash, password)

def create_access_token(user_id: str, email: str) -> str:
    """Generates a signed JWT access token."""
    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> dict:
    """Decodes and validates a JWT token."""
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

def extract_token_from_header() -> str:
    """Extracts Bearer token from the Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:].strip()
    return ""

def jwt_required(f):
    """Decorator to protect routes requiring an authenticated user."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = extract_token_from_header()
        if not token:
            return jsonify({
                "success": False,
                "error": {"message": "Authentication token missing. Please log in."}
            }), 401

        try:
            payload = decode_access_token(token)
            request.current_user_id = payload.get("sub")
            request.current_user_email = payload.get("email")
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "error": {"message": "Session expired. Please log in again."}
            }), 401
        except Exception:
            return jsonify({
                "success": False,
                "error": {"message": "Invalid authentication token."}
            }), 401

        return f(*args, **kwargs)
    return decorated

def optional_jwt(f):
    """Decorator for routes that work for both authenticated users and guests."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = extract_token_from_header()
        request.current_user_id = None
        request.current_user_email = None

        if token:
            try:
                payload = decode_access_token(token)
                request.current_user_id = payload.get("sub")
                request.current_user_email = payload.get("email")
            except Exception:
                pass
        return f(*args, **kwargs)
    return decorated
