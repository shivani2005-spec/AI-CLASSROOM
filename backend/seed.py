"""
Seed script — creates demo principal and teacher accounts.
Run once after starting the backend: python seed.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models.user_model import User, UserRole
from auth.password_handler import hash_password
from config import settings


DEMO_USERS = [
    {
        "name": "Dr. Arvind Mehta",
        "email": "hod@school.com",
        "password": "demo1234",
        "role": UserRole.hod,
    },
    {
        "name": "Rajesh Sharma",
        "email": "teacher@school.com",
        "password": "demo1234",
        "role": UserRole.teacher,
        "subject": "TOC",
        "class_assigned": "301",
    },
    {
        "name": "Priya Singh",
        "email": "priya@school.com",
        "password": "demo1234",
        "role": UserRole.teacher,
        "subject": "CN",
        "class_assigned": "302",
    },
    {
        "name": "Rahul Verma",
        "email": "rahul@school.com",
        "password": "demo1234",
        "role": UserRole.teacher,
        "subject": "DVA",
        "class_assigned": "401",
    },
    {
        "name": "Anita Gupta",
        "email": "anita@school.com",
        "password": "demo1234",
        "role": UserRole.teacher,
        "subject": "CC",
        "class_assigned": "402",
    },
    {
        "name": "Admin User",
        "email": "admin@school.com",
        "password": "demo1234",
        "role": UserRole.admin,
    },
]


async def seed():
    # Simplified connection for better compatibility with Python 3.13 and Atlas
    client = AsyncIOMotorClient(settings.mongo_uri)
    
    await init_beanie(
        database=client[settings.database_name],
        document_models=[User],
    )

    created = 0
    for user_data in DEMO_USERS:
        existing = await User.find_one(User.email == user_data["email"])
        if existing:
            print(f"  [SKIP] {user_data['email']} already exists — skipping")
            continue

        user = User(
            name=user_data["name"],
            email=user_data["email"],
            password=hash_password(user_data["password"]),
            role=user_data["role"],
            subject=user_data.get("subject"),
            class_assigned=user_data.get("class_assigned"),
        )
        await user.insert()
        print(f"  [OK] Created {user_data['role'].value}: {user_data['email']}")
        created += 1

    print(f"\n[DONE] Seeding complete. {created} new user(s) created.")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
