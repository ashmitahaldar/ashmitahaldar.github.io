from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
import uuid
from datetime import datetime
from backend.models import (
    Profile, Skills, Experience, ExperienceCreate,
    Education, EducationCreate, Project, ProjectCreate,
    BlogPost, BlogPostCreate
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')


# Supabase connection
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_KEY']
supabase: Client = create_client(supabase_url, supabase_key)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ Profile Routes ============

@api_router.get("/profile")
async def get_profile():
    response = supabase.table("profile").select("*").execute()
    profile = response.data[0] if response.data else None
    if not profile:
        return {
            "name": "Alex Chen",
            "title": "Computer Science Student",
            "tagline": "// building the future, one line at a time",
            "bio": "Passionate CS student who loves merging creativity with code.",
            "email": "alex.chen@example.com",
            "github": "github.com/alexchen",
            "linkedin": "linkedin.com/in/alexchen",
            "location": "San Francisco, CA"
        }
    return profile

@api_router.put("/profile")
async def update_profile(profile: Profile):
    supabase.table("profile").delete().neq("id", "").execute()
    supabase.table("profile").insert(profile.dict()).execute()
    return profile

# ============ Skills Routes ============

@api_router.get("/skills")
async def get_skills():
    response = supabase.table("skills").select("*").execute()
    skills = response.data[0] if response.data else None
    if not skills:
        return {
            "languages": ["Python", "JavaScript", "Java"],
            "frameworks": ["React", "Node.js", "FastAPI"],
            "tools": ["Git", "Docker", "MongoDB"],
            "interests": ["AI/ML", "Web Development"]
        }
    return skills

@api_router.put("/skills")
async def update_skills(skills: Skills):
    supabase.table("skills").delete().neq("id", "").execute()
    supabase.table("skills").insert(skills.dict()).execute()
    return skills

# ============ Experience Routes ============

@api_router.get("/experience")
async def get_experience():
    response = supabase.table("experience").select("*").execute()
    return response.data

@api_router.post("/experience")
async def create_experience(experience: ExperienceCreate):
    exp_dict = experience.dict()
    exp_dict['id'] = str(uuid.uuid4())
    supabase.table("experience").insert(exp_dict).execute()
    return exp_dict

@api_router.put("/experience/{exp_id}")
async def update_experience(exp_id: str, experience: ExperienceCreate):
    response = supabase.table("experience").update(experience.dict()).eq("id", exp_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"id": exp_id, **experience.dict()}

@api_router.delete("/experience/{exp_id}")
async def delete_experience(exp_id: str):
    response = supabase.table("experience").delete().eq("id", exp_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted"}

# ============ Education Routes ============

@api_router.get("/education")
async def get_education():
    response = supabase.table("education").select("*").execute()
    return response.data

@api_router.post("/education")
async def create_education(education: EducationCreate):
    edu_dict = education.dict()
    edu_dict['id'] = str(uuid.uuid4())
    supabase.table("education").insert(edu_dict).execute()
    return edu_dict

@api_router.put("/education/{edu_id}")
async def update_education(edu_id: str, education: EducationCreate):
    response = supabase.table("education").update(education.dict()).eq("id", edu_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"id": edu_id, **education.dict()}

@api_router.delete("/education/{edu_id}")
async def delete_education(edu_id: str):
    response = supabase.table("education").delete().eq("id", edu_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"message": "Education deleted"}

# ============ Projects Routes ============

@api_router.get("/projects")
async def get_projects():
    response = supabase.table("projects").select("*").execute()
    return response.data

@api_router.post("/projects")
async def create_project(project: ProjectCreate):
    proj_dict = project.dict()
    proj_dict['id'] = str(uuid.uuid4())
    supabase.table("projects").insert(proj_dict).execute()
    return proj_dict

@api_router.put("/projects/{proj_id}")
async def update_project(proj_id: str, project: ProjectCreate):
    response = supabase.table("projects").update(project.dict()).eq("id", proj_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"id": proj_id, **project.dict()}

@api_router.delete("/projects/{proj_id}")
async def delete_project(proj_id: str):
    response = supabase.table("projects").delete().eq("id", proj_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

# ============ Blog Routes ============

@api_router.get("/blog")
async def get_blog_posts(tag: str = None):
    if tag:
        response = supabase.table("blog").select("*").contains("tags", [tag]).execute()
    else:
        response = supabase.table("blog").select("*").execute()
    return response.data

@api_router.get("/blog/{post_id}")
async def get_blog_post(post_id: str):
    response = supabase.table("blog").select("*").eq("id", post_id).execute()
    post = response.data[0] if response.data else None
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@api_router.post("/blog")
async def create_blog_post(post: BlogPostCreate):
    post_dict = post.dict()
    post_dict['id'] = str(uuid.uuid4())
    post_dict['date'] = datetime.now().strftime("%Y-%m-%d")
    supabase.table("blog").insert(post_dict).execute()
    return post_dict

@api_router.put("/blog/{post_id}")
async def update_blog_post(post_id: str, post: BlogPostCreate):
    response = supabase.table("blog").update(post.dict()).eq("id", post_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"id": post_id, **post.dict()}

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str):
    response = supabase.table("blog").delete().eq("id", post_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted"}

# Root route
@api_router.get("/")
async def root():
    return {"message": "Portfolio API - Version 1.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    pass