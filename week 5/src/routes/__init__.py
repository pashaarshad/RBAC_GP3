"""
Route definitions for the RBAC Chatbot API.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

# ==================== AUTH ROUTER ====================
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_role: str


@auth_router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    mock_users = {
        "admin": {"password": "admin123", "role": "c-level"},
        "finance_user": {"password": "finance123", "role": "finance"},
        "hr_user": {"password": "hr123", "role": "hr"},
        "employee": {"password": "emp123", "role": "employees"}
    }
    
    if request.username in mock_users:
        if mock_users[request.username]["password"] == request.password:
            return LoginResponse(
                access_token="mock-jwt-token-" + request.username,
                user_role=mock_users[request.username]["role"]
            )
    raise HTTPException(status_code=401, detail="Invalid credentials")


@auth_router.get("/me")
async def get_current_user():
    return {"username": "demo_user", "role": "finance", "departments": ["Finance", "general"]}


# ==================== QUERY ROUTER ====================
query_router = APIRouter(prefix="/query", tags=["Query"])


class QueryRequest(BaseModel):
    question: str
    user_role: Optional[str] = "employees"


@query_router.post("/search")
async def search_documents(request: QueryRequest):
    return {
        "answer": f"Response for: {request.question}",
        "sources": ["doc1.md", "doc2.md"],
        "filtered_by_role": request.user_role
    }


@query_router.post("/chat")
async def chat(request: QueryRequest):
    return {"response": f"Chat response for: {request.question}"}


# ==================== HEALTH ROUTER ====================
health_router = APIRouter(prefix="/health", tags=["Health"])


@health_router.get("/")
async def health_check():
    return {"status": "healthy", "service": "RBAC Chatbot API", "version": "1.0.0"}


@health_router.get("/ready")
async def readiness_check():
    return {"status": "ready", "database": "connected", "vector_db": "connected"}
