from fastapi import APIRouter, HTTPException
from models import AdminLoginRequest
from config import ADMIN_PASSWORD

router = APIRouter()


@router.post("/admin/login")
async def admin_login(request: AdminLoginRequest):
    """Validate admin password"""
    if request.password == ADMIN_PASSWORD:
        return {"success": True, "message": "Authentication successful"}
    raise HTTPException(status_code=401, detail="Invalid password")
