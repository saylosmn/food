"""Vercel Python serverless entrypoint.

Vercel routes every /api/* request here (see vercel.json). The FastAPI app
itself lives in backend/server.py so local `uvicorn server:app` still works.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from server import app  # noqa: E402,F401
