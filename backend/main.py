import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import engine, Base
from routers import auth, finances

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gig Worker Tax Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(finances.router)

# Serve React App in production
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    app.mount("/vite.svg", StaticFiles(directory=frontend_dist), name="vite_svg")
    
    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        # Prevent API 404s from returning index.html
        if catchall.startswith("api/"):
            return {"detail": "API Route Not Found"}
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "API is running. Frontend build not found."}
