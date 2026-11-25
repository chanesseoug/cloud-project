
from fastapi import FastAPI, HTTPException
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.routes import admin, auth, reservations, rooms
from app.core.config import settings
from app.core.database import engine

app = FastAPI(
    title=settings.app_name,
    description="Cloud-native room booking REST API",   
    version="0.2.0",
    debug=settings.debug,
)


app.include_router(
    auth.router,
    prefix="/api/v1",
)

app.include_router(
    admin.router,
    prefix="/api/v1",
)

app.include_router(rooms.router, prefix="/api/v1")
app.include_router(reservations.router, prefix="/api/v1")

@app.get("/", tags=["System"])
def root():
    return {
        "application": settings.app_name,
        "version": "0.2.0",
        "environment": settings.app_env,
        "status": "running",
    }


@app.get("/health/live", tags=["Health"])
def liveness():
    return {"status": "alive"}


@app.get("/health/ready", tags=["Health"])
def readiness():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "ready",
            "database": "connected",
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )


Instrumentator(
    excluded_handlers=[
        "/metrics",
        "/health/live",
        "/health/ready",
    ]
).instrument(app).expose(app)
