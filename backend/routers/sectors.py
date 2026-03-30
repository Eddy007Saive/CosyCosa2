from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime, timezone
import uuid

from models import SectorCreate
from database import db

router = APIRouter()


@router.get("/sectors")
async def get_sectors(include_hidden: Optional[bool] = False):
    """Get all sectors"""
    query = {} if include_hidden else {"is_active": True}
    sectors = await db.sectors.find(query, {"_id": 0}).sort("order", 1).to_list(50)
    return sectors


@router.get("/sectors/{slug}")
async def get_sector(slug: str):
    """Get single sector by slug"""
    sector = await db.sectors.find_one({"slug": slug}, {"_id": 0})
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    return sector


@router.post("/sectors")
async def create_sector(sector: SectorCreate):
    """Create a new sector"""
    existing = await db.sectors.find_one({"slug": sector.slug})
    if existing:
        raise HTTPException(status_code=400, detail="A sector with this slug already exists")

    sector_data = sector.model_dump()
    sector_data["id"] = str(uuid.uuid4())
    sector_data["created_at"] = datetime.now(timezone.utc).isoformat()
    sector_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    # Convert offers/advantages to dicts
    sector_data["offers"] = [o if isinstance(o, dict) else o.model_dump() if hasattr(o, 'model_dump') else o for o in sector_data.get("offers", [])]
    sector_data["advantages"] = [a if isinstance(a, dict) else a.model_dump() if hasattr(a, 'model_dump') else a for a in sector_data.get("advantages", [])]

    await db.sectors.insert_one(sector_data)
    del sector_data["_id"]
    return sector_data


@router.put("/sectors/{sector_id}")
async def update_sector(sector_id: str, sector: SectorCreate):
    """Update a sector"""
    update_data = sector.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    update_data["offers"] = [o if isinstance(o, dict) else o.model_dump() if hasattr(o, 'model_dump') else o for o in update_data.get("offers", [])]
    update_data["advantages"] = [a if isinstance(a, dict) else a.model_dump() if hasattr(a, 'model_dump') else a for a in update_data.get("advantages", [])]

    result = await db.sectors.update_one(
        {"id": sector_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Sector not found")
    return {"success": True}


@router.delete("/sectors/{sector_id}")
async def delete_sector(sector_id: str):
    """Delete a sector"""
    result = await db.sectors.delete_one({"id": sector_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sector not found")
    return {"success": True}
