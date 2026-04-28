import uvicorn
import os
from config import settings

if __name__ == "__main__":
    print("Starting AI Classroom Backend in development mode...")
    print("Access the API at: http://127.0.0.1:8000")
    print("Docs available at: http://127.0.0.1:8000/docs")
    
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
