import os
import json
import uuid
import time
import logging
from datetime import datetime, timezone
import certifi
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

MONGO_URI = (os.getenv("MONGO_URI") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017/travelai").strip()
MONGO_DB_NAME = (os.getenv("MONGO_DB_NAME") or os.getenv("MONGODB_NAME") or "travelai").strip()

_mongo_client = None
_db = None
_is_mongo_connected = False
_last_mongo_attempt_time = 0
RETRY_INTERVAL_SECONDS = 10  # Seconds between reconnection attempts if offline

# Local storage fallback path
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
LOCAL_DB_FILE = os.path.join(DATA_DIR, "db.json")

def _init_local_db():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(LOCAL_DB_FILE):
        initial = {
            "users": [],
            "travel_guides": [],
            "generation_history": [],
            "favorites": []
        }
        with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(initial, f, indent=2)

def _read_local_db():
    _init_local_db()
    try:
        with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error reading local db: {e}")
        return {"users": [], "travel_guides": [], "generation_history": [], "favorites": []}

def _write_local_db(data):
    _init_local_db()
    try:
        with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
    except Exception as e:
        logger.error(f"Error writing local db: {e}")

def get_db():
    """Initializes and returns MongoDB database or marks fallback flag."""
    global _mongo_client, _db, _is_mongo_connected, _last_mongo_attempt_time
    if _is_mongo_connected and _db is not None:
        return _db

    now = time.time()
    # Throttle connection attempts to avoid blocking every incoming request
    if now - _last_mongo_attempt_time < RETRY_INTERVAL_SECONDS:
        return None

    _last_mongo_attempt_time = now

    if MONGO_URI and not MONGO_URI.startswith("your_"):
        client = None
        try:
            from pymongo import MongoClient

            # 1. Attempt connection with verified certifi CA certificate bundle
            try:
                client = MongoClient(
                    MONGO_URI,
                    tlsCAFile=certifi.where(),
                    serverSelectionTimeoutMS=2000
                )
                client.admin.command('ping')
                _mongo_client = client
            except Exception:
                if client is not None:
                    try:
                        client.close()
                    except Exception:
                        pass
                    client = None
                # 2. Resilient fallback: attempt with tlsAllowInvalidCertificates
                client = MongoClient(
                    MONGO_URI,
                    tls=True,
                    tlsAllowInvalidCertificates=True,
                    serverSelectionTimeoutMS=2000
                )
                client.admin.command('ping')
                _mongo_client = client

            _db = _mongo_client[MONGO_DB_NAME]
            _is_mongo_connected = True
            logger.info(f"Connected to MongoDB successfully: {MONGO_DB_NAME}")

            # Ensure indexes
            try:
                _db.users.create_index("email", unique=True)
                _db.generation_history.create_index("user_id")
                _db.generation_history.create_index([("created_at", -1)])
                _db.travel_guides.create_index("user_id")
            except Exception as idx_err:
                logger.warning(f"Index creation note: {idx_err}")

            return _db
        except Exception as e:
            if client is not None:
                try:
                    client.close()
                except Exception:
                    pass
            _mongo_client = None
            logger.warning(f"Could not connect to MongoDB ({e}). Falling back to robust persistent local JSON store.")
            _is_mongo_connected = False
            _db = None
    else:
        logger.info("MONGO_URI not configured. Using persistent local JSON store.")
        _is_mongo_connected = False
        _db = None
        _mongo_client = None

    return None

_last_ping_time = 0
PING_CACHE_TTL = 30  # Cache ping status for 30s to prevent roundtrip latency

def is_connected():
    """Returns True if connected to real MongoDB, False if local store."""
    global _mongo_client, _db, _is_mongo_connected, _last_ping_time
    now = time.time()
    if _is_mongo_connected and _mongo_client is not None:
        if now - _last_ping_time < PING_CACHE_TTL:
            return True
        try:
            _mongo_client.admin.command('ping')
            _last_ping_time = now
            return True
        except Exception:
            _is_mongo_connected = False
            _db = None
            _mongo_client = None
            return False

    db = get_db()
    if _is_mongo_connected:
        _last_ping_time = now
    return _is_mongo_connected

# ================= USER OPERATIONS =================

def create_user(name, email, password_hash, avatar=None):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    avatar_url = avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={name}"

    if _is_mongo_connected and db is not None:
        existing = db.users.find_one({"email": email.lower()})
        if existing:
            return None
        doc = {
            "name": name,
            "email": email.lower(),
            "password_hash": password_hash,
            "avatar": avatar_url,
            "created_at": now,
            "updated_at": now,
            "last_login": now
        }
        res = db.users.insert_one(doc)
        doc["_id"] = str(res.inserted_id)
        doc.pop("password_hash", None)
        return doc
    else:
        data = _read_local_db()
        for u in data.get("users", []):
            if u.get("email") == email.lower():
                return None
        user_id = str(uuid.uuid4())
        doc = {
            "_id": user_id,
            "name": name,
            "email": email.lower(),
            "password_hash": password_hash,
            "avatar": avatar_url,
            "created_at": now,
            "updated_at": now,
            "last_login": now
        }
        data["users"].append(doc)
        _write_local_db(data)
        safe_copy = dict(doc)
        safe_copy.pop("password_hash", None)
        return safe_copy

def find_user_by_email(email):
    db = get_db()
    if _is_mongo_connected and db is not None:
        u = db.users.find_one({"email": email.lower()})
        if u:
            u["_id"] = str(u["_id"])
            return u
        return None
    else:
        data = _read_local_db()
        for u in data.get("users", []):
            if u.get("email") == email.lower():
                return dict(u)
        return None

def find_user_by_id(user_id):
    db = get_db()
    if _is_mongo_connected and db is not None:
        from bson import ObjectId
        try:
            query_id = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id
            u = db.users.find_one({"_id": query_id})
            if u:
                u["_id"] = str(u["_id"])
                u.pop("password_hash", None)
                return u
        except Exception:
            pass
        return None
    else:
        data = _read_local_db()
        for u in data.get("users", []):
            if u.get("_id") == str(user_id):
                safe = dict(u)
                safe.pop("password_hash", None)
                return safe
        return None

def update_user_last_login(user_id):
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    if _is_mongo_connected and db is not None:
        from bson import ObjectId
        query_id = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id
        db.users.update_one({"_id": query_id}, {"$set": {"last_login": now, "updated_at": now}})
    else:
        data = _read_local_db()
        for u in data.get("users", []):
            if u.get("_id") == str(user_id):
                u["last_login"] = now
                u["updated_at"] = now
                break
        _write_local_db(data)

# ================= TRAVEL GUIDE & HISTORY OPERATIONS =================

def save_travel_guide(guide_data):
    """
    Saves generated guide to generation_history & travel_guides collections.
    """
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    guide_id = str(uuid.uuid4())

    doc = {
        "_id": guide_id,
        "user_id": guide_data.get("user_id"),
        "place": guide_data.get("place"),
        "image": guide_data.get("image", ""),
        "language": guide_data.get("language", "English"),
        "answer_type": guide_data.get("answer_type", "Summary"),
        "voice": guide_data.get("voice", "Default"),
        "voice_id": guide_data.get("voice_id", ""),
        "locale": guide_data.get("locale", "en-US"),
        "description": guide_data.get("description", ""),
        "audio_data": guide_data.get("audio_data", ""),
        "duration": guide_data.get("duration", "~1 min"),
        "favorite": False,
        "created_at": now
    }

    if _is_mongo_connected and db is not None:
        try:
            db.generation_history.insert_one(dict(doc))
            db.travel_guides.insert_one(dict(doc))
            return doc
        except Exception as e:
            logger.error(f"Error inserting into MongoDB: {e}")

    # Local fallback
    data = _read_local_db()
    data["generation_history"].insert(0, doc)
    data["travel_guides"].insert(0, doc)
    _write_local_db(data)
    return doc

def get_history(user_id, language=None, search=None):
    """Retrieves user's generation history with optional language and search filters."""
    db = get_db()

    if _is_mongo_connected and db is not None:
        query = {"user_id": user_id}
        if language and language.lower() != "all":
            query["language"] = {"$regex": f"^{language}$", "$options": "i"}
        if search:
            query["place"] = {"$regex": search, "$options": "i"}

        cursor = db.generation_history.find(query).sort("created_at", -1)
        items = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            items.append(doc)
        return items

    # Local fallback
    data = _read_local_db()
    all_items = data.get("generation_history", [])
    filtered = []
    for item in all_items:
        if str(item.get("user_id")) == str(user_id):
            if language and language.lower() != "all":
                if item.get("language", "").lower() != language.lower():
                    continue
            if search:
                if search.lower() not in item.get("place", "").lower():
                    continue
            filtered.append(dict(item))
    return filtered

def get_guide_by_id(guide_id, user_id=None):
    db = get_db()
    if _is_mongo_connected and db is not None:
        query = {"_id": guide_id}
        if user_id:
            query["user_id"] = user_id
        doc = db.generation_history.find_one(query)
        if doc:
            doc["_id"] = str(doc["_id"])
            return doc
        return None

    data = _read_local_db()
    for item in data.get("generation_history", []):
        if str(item.get("_id")) == str(guide_id):
            if user_id and str(item.get("user_id")) != str(user_id):
                return None
            return dict(item)
    return None

def delete_guide(guide_id, user_id):
    db = get_db()
    if _is_mongo_connected and db is not None:
        res = db.generation_history.delete_one({"_id": guide_id, "user_id": user_id})
        db.travel_guides.delete_one({"_id": guide_id, "user_id": user_id})
        return res.deleted_count > 0

    data = _read_local_db()
    orig_len = len(data.get("generation_history", []))
    data["generation_history"] = [
        item for item in data.get("generation_history", [])
        if not (str(item.get("_id")) == str(guide_id) and str(item.get("user_id")) == str(user_id))
    ]
    data["travel_guides"] = [
        item for item in data.get("travel_guides", [])
        if not (str(item.get("_id")) == str(guide_id) and str(item.get("user_id")) == str(user_id))
    ]
    if len(data["generation_history"]) < orig_len:
        _write_local_db(data)
        return True
    return False

def toggle_favorite(guide_id, user_id):
    db = get_db()
    if _is_mongo_connected and db is not None:
        doc = db.generation_history.find_one({"_id": guide_id, "user_id": user_id})
        if not doc:
            return None
        new_val = not doc.get("favorite", False)
        db.generation_history.update_one({"_id": guide_id}, {"$set": {"favorite": new_val}})
        db.travel_guides.update_one({"_id": guide_id}, {"$set": {"favorite": new_val}})
        return new_val

    data = _read_local_db()
    for item in data.get("generation_history", []):
        if str(item.get("_id")) == str(guide_id) and str(item.get("user_id")) == str(user_id):
            item["favorite"] = not item.get("favorite", False)
            _write_local_db(data)
            return item["favorite"]
    return None

def get_user_stats(user_id):
    items = get_history(user_id)
    total_guides = len(items)
    favorites = sum(1 for i in items if i.get("favorite"))
    
    # Calculate minutes listened estimate
    total_minutes = 0
    languages_used = set()
    dest_counts = {}

    for i in items:
        lang = i.get("language")
        if lang:
            languages_used.add(lang)
        dest = i.get("place")
        if dest:
            dest_counts[dest] = dest_counts.get(dest, 0) + 1
        atype = i.get("answer_type", "Summary")
        total_minutes += 3 if atype == "Detailed" else 1

    top_dest = max(dest_counts, key=dest_counts.get) if dest_counts else "None"

    return {
        "total_guides": total_guides,
        "favorites": favorites,
        "minutes_listened": total_minutes,
        "languages_count": len(languages_used),
        "favorite_destination": top_dest
    }
