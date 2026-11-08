import uuid
import hashlib
import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from backend.config import settings
from backend.models.schemas import UserRegisterRequest, UserResponse, TokenResponse, UserLoginRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

# Mock In-Memory User DB for instant demo & production fallback
MOCK_USERS_DB = {}

def hash_password(password: str) -> str:
    """Hashes password securely using SHA-256 with salt."""
    salt = "enterprise_platform_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies input plain password against stored hash."""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

# Seed Default Admin User
default_admin_id = uuid.uuid4()
MOCK_USERS_DB["admin@enterprise.com"] = {
    "id": default_admin_id,
    "email": "admin@enterprise.com",
    "hashed_password": hash_password("admin123"),
    "full_name": "Senior Enterprise Admin",
    "role": "ADMIN",
    "is_active": True,
    "created_at": datetime.utcnow()
}

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(req: UserRegisterRequest):
    if req.email in MOCK_USERS_DB:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = uuid.uuid4()
    user_dict = {
        "id": user_id,
        "email": req.email,
        "hashed_password": hash_password(req.password),
        "full_name": req.full_name,
        "role": req.role or "USER",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    MOCK_USERS_DB[req.email] = user_dict
    return UserResponse(**user_dict)

@router.post("/login", response_model=TokenResponse)
async def login_user(req: UserLoginRequest):
    user = MOCK_USERS_DB.get(req.email)
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    user_resp = UserResponse(**user)
    return TokenResponse(access_token=access_token, token_type="bearer", user=user_resp)

@router.post("/token", response_model=TokenResponse)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = MOCK_USERS_DB.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    user_resp = UserResponse(**user)
    return TokenResponse(access_token=access_token, token_type="bearer", user=user_resp)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None or email not in MOCK_USERS_DB:
            raise HTTPException(status_code=401, detail="Invalid token credentials")
        return UserResponse(**MOCK_USERS_DB[email])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")
