from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import uuid
from datetime import datetime
from models import (
    Profile, Skills, Experience, ExperienceCreate,
    Education, EducationCreate, Project, ProjectCreate,
    BlogPost, BlogPostCreate
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
    profile = await db.profile.find_one({}, {'_id': 0})
    if not profile:
        # Return default profile if none exists
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
    await db.profile.delete_many({})
    await db.profile.insert_one(profile.dict())
    return profile

# ============ Skills Routes ============

@api_router.get("/skills")
async def get_skills():
    skills = await db.skills.find_one({}, {'_id': 0})
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
    await db.skills.delete_many({})
    await db.skills.insert_one(skills.dict())
    return skills

# ============ Experience Routes ============

@api_router.get("/experience")
async def get_experience():
    experiences = await db.experience.find({}, {'_id': 0}).to_list(1000)
    return experiences

@api_router.post("/experience")
async def create_experience(experience: ExperienceCreate):
    exp_dict = experience.dict()
    exp_dict['id'] = str(uuid.uuid4())
    await db.experience.insert_one(exp_dict)
    return exp_dict

@api_router.put("/experience/{exp_id}")
async def update_experience(exp_id: str, experience: ExperienceCreate):
    result = await db.experience.update_one(
        {"id": exp_id},
        {"$set": experience.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"id": exp_id, **experience.dict()}

@api_router.delete("/experience/{exp_id}")
async def delete_experience(exp_id: str):
    result = await db.experience.delete_one({"id": exp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted"}

# ============ Education Routes ============

@api_router.get("/education")
async def get_education():
    education = await db.education.find({}, {'_id': 0}).to_list(1000)
    return education

@api_router.post("/education")
async def create_education(education: EducationCreate):
    edu_dict = education.dict()
    edu_dict['id'] = str(uuid.uuid4())
    await db.education.insert_one(edu_dict)
    return edu_dict

@api_router.put("/education/{edu_id}")
async def update_education(edu_id: str, education: EducationCreate):
    result = await db.education.update_one(
        {"id": edu_id},
        {"$set": education.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"id": edu_id, **education.dict()}

@api_router.delete("/education/{edu_id}")
async def delete_education(edu_id: str):
    result = await db.education.delete_one({"id": edu_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"message": "Education deleted"}

# ============ Projects Routes ============

@api_router.get("/projects")
async def get_projects():
    projects = await db.projects.find({}, {'_id': 0}).to_list(1000)
    return projects

@api_router.post("/projects")
async def create_project(project: ProjectCreate):
    proj_dict = project.dict()
    proj_dict['id'] = str(uuid.uuid4())
    await db.projects.insert_one(proj_dict)
    return proj_dict

@api_router.put("/projects/{proj_id}")
async def update_project(proj_id: str, project: ProjectCreate):
    result = await db.projects.update_one(
        {"id": proj_id},
        {"$set": project.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"id": proj_id, **project.dict()}

@api_router.delete("/projects/{proj_id}")
async def delete_project(proj_id: str):
    result = await db.projects.delete_one({"id": proj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

# ============ Blog Routes ============

@api_router.get("/blog")
async def get_blog_posts(tag: str = None):
    if tag:
        posts = await db.blog.find({"tags": tag}, {'_id': 0}).to_list(1000)
    else:
        posts = await db.blog.find({}, {'_id': 0}).to_list(1000)
    return posts

@api_router.get("/blog/{post_id}")
async def get_blog_post(post_id: str):
    post = await db.blog.find_one({"id": post_id}, {'_id': 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@api_router.post("/blog")
async def create_blog_post(post: BlogPostCreate):
    post_dict = post.dict()
    post_dict['id'] = str(uuid.uuid4())
    post_dict['date'] = datetime.now().strftime("%Y-%m-%d")
    await db.blog.insert_one(post_dict)
    return post_dict

@api_router.put("/blog/{post_id}")
async def update_blog_post(post_id: str, post: BlogPostCreate):
    result = await db.blog.update_one(
        {"id": post_id},
        {"$set": post.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"id": post_id, **post.dict()}

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str):
    result = await db.blog.delete_one({"id": post_id})
    if result.deleted_count == 0:
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
    client.close()