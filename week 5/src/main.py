"""
RBAC Chatbot API - FastAPI Application
Week 5: Backend Foundation
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from routes import auth_router, query_router, health_router
from middleware import LoggingMiddleware

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting RBAC Chatbot API...")
    logger.info(f"📊 App: {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info("✅ All services initialized!")
    yield
    logger.info("🛑 Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="RBAC Chatbot API with role-based access control",
    docs_url="/docs",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(status_code=500, content={"error": "Internal Server Error"})


app.include_router(auth_router)
app.include_router(query_router)
app.include_router(health_router)


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to RBAC Chatbot API!", "version": settings.APP_VERSION, "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
