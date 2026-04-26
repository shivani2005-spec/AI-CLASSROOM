import certifi
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGO_URI")

async def test():
    print(f"Testing connection to: {uri}")
    try:
        client = AsyncIOMotorClient(uri, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True)
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test())
