from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Profile(BaseModel):
    name: str
    title: str
    tagline: str
    bio: str
    email: str
    github: str
    linkedin: str
    location: str

class Skills(BaseModel):
    languages: List[str]
    frameworks: List[str]
    tools: List[str]
    interests: List[str]

class Experience(BaseModel):
    id: str
    title: str
    company: str
    location: str
    period: str
    description: str
    technologies: List[str]

class ExperienceCreate(BaseModel):
    title: str
    company: str
    location: str
    period: str
    description: str
    technologies: List[str]

class Education(BaseModel):
    id: str
    degree: str
    school: str
    location: str
    period: str
    gpa: str
    relevant: List[str]
    description: List[str]

class EducationCreate(BaseModel):
    degree: str
    school: str
    location: str
    period: str
    gpa: str
    relevant: List[str]
    description: List[str]

class Project(BaseModel):
    id: str
    title: str
    description: str
    technologies: List[str]
    github: str
    demo: Optional[str] = None
    image: str

class ProjectCreate(BaseModel):
    title: str
    description: str
    technologies: List[str]
    github: str
    demo: Optional[str] = None
    image: str

class BlogPost(BaseModel):
    id: str
    title: str
    date: str
    excerpt: str
    content: str
    tags: List[str]

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    tags: List[str]