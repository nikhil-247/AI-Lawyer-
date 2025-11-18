# Memory Reconstruct Assist

A full-stack caregiving assistant for people living with dementia. It combines:

- **React + TypeScript** front-end (caregiver app)
- **Express + MongoDB** backend (auth, patients, sessions, schedules, uploads)
- **FastAPI** microservice for ML-generated therapy stories and audio (`session_api.py`)
- **Python quiz engine** to generate simple Yes/No follow-up questions

The app helps caregivers create personalized audio therapy sessions, schedule them, and track engagement.

---

## 1. Project Structure

- `client/`
  - React app (Vite) with TypeScript
  - Pages like `Welcome`, `Home` (Dashboard), `Schedule`, and all ML session pages
- `backend/`
  - Express server and REST API endpoints
  - Models (e.g. `patient.js`, `session.js`, `schedule.js`)
  - Audio upload handler (`POST /api/upload/audio`)
- `session_api.py`
  - FastAPI app exposing `POST /api/session-story`
  - Uses `session_based_system.py` to generate story + audio (base64)
- `session_based_system.py`
  - Core ML / story-generation logic
  - ElevenLabs text-to-speech integration
- `quiz_engine.py`
  - Quiz/question generation and scoring helpers

---

## 2. Prerequisites

- **Node.js** (LTS)
- **npm** or **yarn**
- **Python 3.10+**
- **MongoDB** running locally (e.g. `mongodb://localhost:27017`)
- An **ElevenLabs API key** (optional but required for real audio)

---

## 3. Backend (Express) Setup

From the project root:

```bash
cd backend
npm install
```

Configure environment (example `.env` in `backend/`):

```bash
MONGODB_URI=mongodb://localhost:27017/memory-reconstruct
PORT=3000
JWT_SECRET=change_me
```

Run backend:

```bash
npm start
# or
npm run dev
```

Key endpoints:

- `POST /api/auth/login` – user login
- `POST /api/patients` – create patient profile
- `GET /api/patients` – list patients
- `POST /api/sessions` – create a therapy session record
- `GET /api/sessions/:patientId` – sessions for a patient
- `POST /api/schedules` – create schedule entries
- `GET /api/schedules/:patientId` – schedules for a patient
- `POST /api/upload/audio` – upload MP3 blobs, returns `{ url }`

---

## 4. FastAPI ML Service

Install Python dependencies in a virtual env (example):

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt  # if present, or install needed libs manually
```

Make sure `session_based_system.py` and `session_api.py` are importable from the project root.

Set your ElevenLabs key in `session_based_system.py`:

```python
ELEVEN_API_KEY = "your_api_key"  # replace with real key
```

Run FastAPI service:

```bash
uvicorn session_api:app --reload --port 8001
```

API:

- `POST http://localhost:8001/api/session-story`
  - Request body includes `session_type`, `patient`, and `answers`
  - Returns `story_text` and optional `audio_base64`

---

## 5. Frontend (React) Setup

From project root:

```bash
cd client
npm install
```

Run the dev server:

```bash
npm run dev
```

By default this runs on something like `http://localhost:5173` (Vite). The client is configured to talk to:

- Express backend under `/api/...`
- FastAPI ML service at `http://localhost:8001/api/session-story`

Make sure backend and FastAPI are running before using ML features.

---

## 6. Core Flows

### 6.1 Patient onboarding

1. Caregiver registers / logs in.
2. On first visit to Home, if no patient profile exists, they are prompted to **Create Profile**.
3. `PatientSetup` guides them through basic info and life history.
4. On success, patient is saved in Mongo and set as `currentPatient` in `PatientContext`.

### 6.2 ML session creation

For pages like:

- `SessionFamily`
- `SessionCoreMemories`
- `SessionReassurances`
- `SessionMorningRoutine`
- `SessionNightRoutine`

Flow when clicking **Continue**:

1. Build a structured `answers` payload from the form.
2. Call FastAPI `POST /api/session-story`.
3. Receive `story_text` and `audio_base64` (if audio generation succeeds).
4. Decode `audio_base64` to a `Blob`, create a local `audioUrl` for playback.
5. Upload the `Blob` to Express via `POST /api/upload/audio`.
6. Save a `Session` via `POST /api/sessions` with:
   - `patientId`
   - `type` (family, core_memory, reassurance, morning_routine, night_routine)
   - `title`, `content`, `audioUrl` (from upload response)

The session then appears in the **Schedule** page dropdown.

### 6.3 Scheduling and playback

- The **Schedule** page:
  - Fetches `sessions` and `schedules` for the current patient.
  - Lets caregivers create a schedule by picking a session + days + time.
  - Uses a custom `AudioPlayer` component to play `session.audioUrl` for scheduled sessions.

---

## 7. Quiz Engine (Optional Integration)

`quiz_engine.py` provides helper functions:

- `generate_quiz(session_type, form_data, language)` – creates Yes/No questions.
- `score_quiz(quiz_questions, answers, language)` – computes engagement metrics.
- `build_progress_point(patient_id, session_id, session_type, quiz_scores)` – structure to store in DB.

A typical integration:

1. After a session audio finishes (e.g. on `AudioPlayer` `onComplete`), call a FastAPI route that wraps `generate_quiz`.
2. Show the returned questions in the UI.
3. Post answers back to another route that uses `score_quiz` and persists results.

---

## 8. Environment & Security Notes

- Do **not** commit real API keys.
- Use `.env` files and environment variables for secrets.
- Ensure CORS is restricted in production (FastAPI currently allows `*` for development).

---

## 9. Future Ideas

- Visual engagement dashboard using quiz scores over time.
- Shared access for multiple caregivers per patient.
- More languages and voices for story + audio.
- Exportable PDF summaries for clinicians or family members.
