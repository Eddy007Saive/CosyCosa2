from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from typing import Dict
from pathlib import Path
from datetime import datetime, timezone
import cloudinary
import cloudinary.uploader
import logging

from config import DEFAULT_SITE_IMAGES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE, UPLOADS_DIR
from database import db

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/settings/images")
async def get_site_images():
    """Get all site images"""
    settings = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    if settings and settings.get("images"):
        # Merge with defaults (in case new image keys are added)
        images = {**DEFAULT_SITE_IMAGES, **settings["images"]}
        return {"images": images}
    return {"images": DEFAULT_SITE_IMAGES}


@router.put("/settings/images")
async def update_site_images(images: Dict[str, str]):
    """Update site images"""
    await db.site_settings.update_one(
        {"id": "site_settings"},
        {
            "$set": {
                "images": images,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )
    return {"success": True, "message": "Images updated"}


@router.put("/settings/images/{image_key}")
async def update_single_image(image_key: str, url: str = None):
    """Update a single site image"""
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    await db.site_settings.update_one(
        {"id": "site_settings"},
        {
            "$set": {
                f"images.{image_key}": url,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )
    return {"success": True, "message": f"Image {image_key} updated"}


@router.get("/settings/services-pdf")
async def get_services_pdf():
    """Get services PDF URL"""
    settings = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    if settings and settings.get("services_pdf_url"):
        return {"services_pdf_url": settings["services_pdf_url"]}
    return {"services_pdf_url": None}


@router.put("/settings/services-pdf")
async def update_services_pdf(url: str):
    """Update services PDF URL"""
    await db.site_settings.update_one(
        {"id": "site_settings"},
        {
            "$set": {
                "services_pdf_url": url,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )
    return {"success": True, "message": "Services PDF URL updated"}


@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file to Cloudinary and return its URL"""
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB")

    try:
        # Upload to Cloudinary
        import io
        result = cloudinary.uploader.upload(
            io.BytesIO(content),
            folder="cosycasa",
            resource_type="auto"
        )

        # Get the secure URL from Cloudinary
        image_url = result.get('secure_url')

        logger.info(f"Image uploaded to Cloudinary: {image_url}")
        return {
            "success": True,
            "url": image_url,
            "public_id": result.get('public_id')
        }
    except Exception as e:
        logger.error(f"Cloudinary upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/uploads/{filename}")
async def get_uploaded_image(filename: str):
    """Serve uploaded images (backward compatibility for local files)"""
    file_path = UPLOADS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    # Determine content type
    ext = Path(filename).suffix.lower()
    content_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
    }
    content_type = content_types.get(ext, 'application/octet-stream')

    return FileResponse(file_path, media_type=content_type)
