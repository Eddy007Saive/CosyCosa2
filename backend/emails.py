import logging
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from config import BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME, CONTACT_EMAIL, RESEND_API_KEY

try:
    import resend
except ImportError:
    resend = None

logger = logging.getLogger(__name__)


async def send_booking_confirmation(email: str, name: str, property_name: str, check_in: str, check_out: str):
    """Send booking confirmation email"""
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured, skipping email")
        return

    try:
        resend.Emails.send({
            "from": "Cosy Casa <noreply@cosycasa.fr>",
            "to": [email],
            "subject": f"Confirmation de réservation - {property_name}",
            "html": f"""
            <div style="font-family: 'Manrope', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2e2e2e;">Merci pour votre réservation</h1>
                <p>Bonjour {name},</p>
                <p>Votre réservation pour <strong>{property_name}</strong> a été confirmée.</p>
                <p><strong>Dates:</strong> {check_in} au {check_out}</p>
                <p>Notre équipe vous contactera prochainement avec plus de détails.</p>
                <p>À bientôt en Corse!</p>
                <p>L'équipe Cosy Casa</p>
            </div>
            """
        })
        logger.info(f"Booking confirmation sent to {email}")
    except Exception as e:
        logger.error(f"Failed to send booking confirmation: {e}")


async def send_contact_notification(name: str, email: str, subject: str, message: str, phone: str = None):
    """Send contact notification to admin via Brevo"""
    if not BREVO_API_KEY:
        logger.warning("Brevo API key not configured, skipping email")
        return

    try:
        # Configure Brevo API
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = BREVO_API_KEY
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

        # Build the email
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": CONTACT_EMAIL, "name": "Cosy Casa"}],
            sender={"email": BREVO_SENDER_EMAIL, "name": BREVO_SENDER_NAME},
            reply_to={"email": email, "name": name},
            subject=f"[Cosy Casa] Nouveau message: {subject}",
            html_content=f"""
            <div style="font-family: 'Manrope', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2e2e2e;">Nouveau message de contact</h1>
                <p><strong>Nom:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Téléphone:</strong> {phone or 'Non renseigné'}</p>
                <p><strong>Sujet:</strong> {subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>{message}</p>
            </div>
            """
        )

        # Send the email
        api_instance.send_transac_email(send_smtp_email)
        logger.info(f"Contact notification sent via Brevo for {email}")
    except ApiException as e:
        logger.error(f"Brevo API error: {e}")
    except Exception as e:
        logger.error(f"Failed to send contact notification: {e}")
