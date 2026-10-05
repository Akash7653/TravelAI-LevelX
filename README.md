# 🚀 TravelAI — Production-Quality AI Audio Travel Guide Platform

> **"Explore the World. Listen to Its Story."**  
> A full-stack, production-quality AI Travel Guide platform combining real-time destination discovery, Google Gemini reasoning, Murf AI Falcon-2 neural voice synthesis, persistent MongoDB Atlas history, JWT authentication, 3D interactive graphics, and a modern responsive interface with collapsible navigation.

---

## 🌐 Live Deployments

- **Backend API (Render)**: [`https://travelai-backend-sjkg.onrender.com`](https://travelai-backend-sjkg.onrender.com)
- **API Health Check**: [`https://travelai-backend-sjkg.onrender.com/health`](https://travelai-backend-sjkg.onrender.com/health)
- **Frontend SPA (Vercel)**: Configured for Vercel deployment with automated client-side rewrite rules in [`frontend/vercel.json`](frontend/vercel.json).

---

## 🌟 Key Features

- **AI Destination Discovery with 100% Verified Landmark Photos**: Curated archive of 25 iconic landmarks across India (Charminar, Golconda Fort, Taj Mahal, Gateway of India, Hampi, Tirupati, Red Fort, India Gate, Mysore Palace, Qutub Minar, Meenakshi Temple, Konark Sun Temple, Ajanta & Ellora Caves, Victoria Memorial) and world wonders (Eiffel Tower, Colosseum, Great Wall of China, Statue of Liberty, Burj Khalifa, Machu Picchu, Petra, Big Ben, Sagrada Familia, Mount Fuji), each paired with authentic, verified imagery.
- **Ultra-Fast AI Travel Guides**: Natural spoken-word tour guide narration generated with sub-second latency using optimized **Google Gemini 3.5 Flash-Lite**.
- **Lifelike Neural Speech Synthesis**: Audio synthesized with **Murf AI Falcon-2** streaming engine delivering human voice timbre, pitch, and pacing.
- **Multilingual Support**: Spoken guides in **English**, **Hindi (हिंदी)**, **Tamil (தமிழ்)**, and **Telugu (తెలుగు)**.
- **Voice Selection & Customization**: Curated male and female voice talent mapped to native regional accents.
- **Collapsible Desktop Side Navigation**: Sleek, responsive desktop sidebar that collapses smoothly into an icon rail on demand, with preference persisted in `localStorage`. Clean bottom control layout with darkmode toggle and user logout conveniently accessible in the top navigation bar.
- **Automatic Backend Warmup & Keep-Alive**: Background warmup pings ensure cold-start mitigation on cloud serverless/free tiers.
- **Interactive Audio Player**: Waveform animation, seek slider, duration formatting, volume control, and sanitized MP3 download.
- **Full Transcripts**: Real-time transcript display with one-click clipboard copying.
- **User Authentication**: Secure JWT-based registration and login with bcrypt password hashing and token persistence.
- **MongoDB Atlas Persistence**: Automatically saves generated audio guides to user history with search, language filters, and favorite toggling (with automatic resilient local JSON fallback).
- **User Analytics & Profile**: Live statistics tracking total guides created, minutes listened, top destinations, and languages explored.
- **3D Motion & Interactive Visuals**: Custom Three.js interactive wireframe globe with animated orbital rings and landmark pins.
- **Light & Dark Mode**: True light-mode default with clean elevation, plus an immersive `#050505` dark mode with glassmorphic cards and persistent `localStorage` preference.

---

## 💻 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Three.js, Lucide Icons
- **Backend**: Python 3.10+, Flask 3.0+, Gunicorn (Production WSGI)
- **Database**: MongoDB Atlas (with automatic local document fallback)
- **AI Model**: Google Gemini (Google GenAI SDK)
- **Voice Engine**: Murf AI (Falcon-2 Low-Latency Neural TTS)
- **Authentication**: JSON Web Tokens (PyJWT) & bcrypt

---

## 🏗️ Architecture & Data Flow

```text
[ User / Browser ]
        │
        │ 1. Search / Select Destination, Language, Length, Voice
        ▼
[ React 19 Frontend (Vite) ]
        │
        │ Authorization: Bearer <JWT>
        │ POST /api/generate-audio-guide
        ▼
[ Flask Backend API (Port 5002 / Render) ]
   ├── (1) Generate Spoken Narrative ──► [ Google Gemini 3.5 Flash-Lite ]
   ├── (2) Convert Narrative to Audio ──► [ Murf AI Falcon-2 ]
   └── (3) Save Guide & Audio ─────────► [ MongoDB Atlas ]
        │
        ▼
[ JSON Response: Base64 MP3 Audio + Clean Transcript + Metadata ]
        │
        ▼
[ Interactive Player & Saved Tour Dashboard ]
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node v20/v22/v26)
- Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))
- Murf AI API Key ([Murf AI](https://murf.ai/))
- MongoDB Atlas Connection String *(Optional; uses local JSON fallback if omitted)*

---

### 2. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` with your API keys:

```env
PORT=5002
GEMINI_API_KEY=your_gemini_api_key_here
MURF_API_KEY=your_murf_api_key_here
MONGO_URI=your_mongodb_atlas_connection_string
MONGO_DB_NAME=travelai
JWT_SECRET=your_secure_jwt_secret_key
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://your-app.vercel.app
```

Start the Flask backend:

```bash
python app.py
```

Backend will be live on: **`http://127.0.0.1:5002`**  
Verify root status: **`http://127.0.0.1:5002/`**  
Verify health: **`http://127.0.0.1:5002/health`**

---

### 3. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be live on: **`http://127.0.0.1:5173`**

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Required |
| :--- | :--- | :---: |
| `PORT` | Local or production port (default: `5002`) | Yes |
| `GEMINI_API_KEY` | Google AI Studio API key for Gemini | Yes |
| `MURF_API_KEY` | Murf AI API key for Falcon-2 voice synthesis | Yes |
| `MONGO_URI` | MongoDB Atlas replica-set connection string | Optional |
| `MONGO_DB_NAME` | Database name (default: `travelai`) | Optional |
| `JWT_SECRET` | Secret key for signing authentication tokens | Yes |
| `ALLOWED_ORIGINS` | Comma-separated CORS whitelist origins | Optional |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
| :--- | :--- | :---: |
| `VITE_API_BASE_URL` | Base URL of the backend API service | `https://travelai-backend-sjkg.onrender.com` (prod) / `http://127.0.0.1:5002` (dev) |

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Root service status and health link | No |
| `GET` | `/health` | Service and MongoDB status check (cached TTL) | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/api/auth/me` | Retrieve authenticated profile | Yes (Bearer) |
| `POST` | `/api/auth/logout` | Session invalidation | No |
| `GET` | `/api/voices` | Retrieve active regional Murf voice list | No |
| `POST` | `/api/generate-audio-guide` | Generate AI story and Murf audio guide | Optional |
| `GET` | `/api/history` | List user's saved audio guides | Yes (Bearer) |
| `GET` | `/api/history/:id` | Get specific guide details and audio | Yes (Bearer) |
| `DELETE` | `/api/history/:id` | Delete guide from history | Yes (Bearer) |
| `POST` | `/api/history/:id/favorite` | Toggle guide favorite status | Yes (Bearer) |
| `GET` | `/api/stats` | Retrieve user exploration statistics | Yes (Bearer) |

---

## 🚀 Production Deployment

### Backend Deployment (Render)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
- **Procfile**: Included ([`backend/Procfile`](backend/Procfile))
- **Environment Variables**: Configure `GEMINI_API_KEY`, `MURF_API_KEY`, `MONGO_URI`, `JWT_SECRET`, and `ALLOWED_ORIGINS`.

### Frontend Deployment (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: [`frontend/vercel.json`](frontend/vercel.json) included with rewrite rules (`/(.*)` -> `/index.html`).
- **Environment Variable**: `VITE_API_BASE_URL=https://travelai-backend-sjkg.onrender.com`

---

## 🔒 Security Architecture

1. **Zero Client Secret Exposure**: API keys (`GEMINI_API_KEY`, `MURF_API_KEY`, `MONGO_URI`, `JWT_SECRET`) reside exclusively in backend environment variables. The frontend bundle never contains API credentials.
2. **Strict CORS Protection**: Configured with explicit origins for local development and deployed frontend URLs.
3. **Password Security**: Passwords hashed securely using bcrypt prior to database storage.
4. **Stateless JWT Authorization**: User identity is verified via cryptographically signed JWT tokens passed in the `Authorization: Bearer <token>` header.

---

## 🧪 Testing & Validation

```bash
# Backend Automated Tests
cd backend && ./venv/bin/python test_api.py

# Frontend Production Build Test
cd frontend && npm run build
```

---

## 📄 License

Developed for the **LevelX Hands-on AI Workshop** and extended with production-grade AI audio guide capabilities.
