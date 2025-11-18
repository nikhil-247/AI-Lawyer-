from typing import Dict, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64

from session_based_system import (
    PatientContext,
    SessionType,
    Language,
    VoiceGender,
    generate_session_story,
    generate_voice_bytes,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientIn(BaseModel):
    name: str
    language: Language = "hi"  # type: ignore[assignment]
    voice_gender: VoiceGender = "female"  # type: ignore[assignment]
    dementia_stage: str = "early"
    caregiver_relation: str = "caregiver"


class StoryRequest(BaseModel):
    session_type: SessionType
    patient: PatientIn
    answers: Dict[str, str]


class StoryResponse(BaseModel):
    session_type: SessionType
    language: Language  # type: ignore[assignment]
    story_text: str
    audio_base64: Optional[str]


@app.post("/api/session-story", response_model=StoryResponse)
async def session_story(req: StoryRequest) -> StoryResponse:
    ctx = PatientContext(
        name=req.patient.name,
        language=req.patient.language,
        voice_gender=req.patient.voice_gender,
        dementia_stage=req.patient.dementia_stage,
        caregiver_relation=req.patient.caregiver_relation,
    )

    # 1) Generate therapeutic story text
    story_text = generate_session_story(req.session_type, ctx, req.answers)
    story_lang: Language = req.answers.get("language", ctx.language)  # type: ignore[assignment]

    # 2) Try to generate audio using ElevenLabs; if it fails, return text only
    audio_base64: Optional[str] = None
    try:
        audio_bytes = generate_voice_bytes(
            story_text=story_text,
            language=story_lang,
            gender=ctx.voice_gender,
        )
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
    except Exception:
        # Audio is optional; frontend can still show story text
        audio_base64 = None

    return StoryResponse(
        session_type=req.session_type,
        language=story_lang,
        story_text=story_text,
        audio_base64=audio_base64,
    )
