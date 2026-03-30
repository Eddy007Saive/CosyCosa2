from fastapi import APIRouter, BackgroundTasks
from datetime import datetime, timezone

from models import ContactRequest, ContactRequestCreate
from database import db
from emails import send_contact_notification

router = APIRouter()


@router.post("/contact")
async def submit_contact(contact: ContactRequestCreate, background_tasks: BackgroundTasks):
    """Submit a contact request"""
    contact_obj = ContactRequest(**contact.model_dump())

    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_requests.insert_one(doc)

    # Send email notification in background
    background_tasks.add_task(
        send_contact_notification,
        contact.name,
        contact.email,
        contact.subject,
        contact.message,
        contact.phone
    )

    return {
        "success": True,
        "message": "Your message has been sent. We will contact you shortly."
    }
