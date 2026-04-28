import asyncio
import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from config import settings
from models.user_model import User
from services.auth_service import signin_user
from schemas.auth_schema import SignInRequest

async def test_signin():
    client = AsyncIOMotorClient(settings.mongo_uri)
    await init_beanie(
        database=client[settings.database_name],
        document_models=[User],
    )
    
    # Try with a known demo user
    request = SignInRequest(email="hod@school.com", password="demo1234")
    try:
        result = await signin_user(request)
        print("Sign-in successful:", result)
    except Exception as e:
        print("Sign-in failed with error:", str(e))
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_signin())
