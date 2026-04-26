import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_alert_email(email_to: EmailStr, subject: str, body: str):
    """
    Send an automated alert email to the principal or teacher.
    """
    if not settings.mail_username or settings.mail_username == "your-email@gmail.com":
        print(f" [EMAIL SIMULATION] To: {email_to} | Sub: {subject} | Body: {body}")
        return

    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        print(f"✅ Email alert sent to {email_to}")
    except Exception as e:
        print(f"❌ Failed to send email alert: {e}")
