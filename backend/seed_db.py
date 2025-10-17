import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_database():
    print("Seeding database...")
    
    # Clear existing data
    await db.profile.delete_many({})
    await db.skills.delete_many({})
    await db.experience.delete_many({})
    await db.education.delete_many({})
    await db.projects.delete_many({})
    await db.blog.delete_many({})
    
    # Insert profile
    profile = {
        "name": "Alex Chen",
        "title": "Computer Science Student",
        "tagline": "// building the future, one line at a time",
        "bio": "Passionate CS student who loves merging creativity with code. When I'm not debugging, you'll find me exploring pixel art, playing retro games, or experimenting with new tech.",
        "email": "alex.chen@example.com",
        "github": "github.com/alexchen",
        "linkedin": "linkedin.com/in/alexchen",
        "location": "San Francisco, CA"
    }
    await db.profile.insert_one(profile)
    print("✓ Profile seeded")
    
    # Insert skills
    skills = {
        "languages": ["Python", "JavaScript", "Java", "C++", "TypeScript", "SQL"],
        "frameworks": ["React", "Node.js", "Express", "FastAPI", "TailwindCSS"],
        "tools": ["Git", "Docker", "MongoDB", "PostgreSQL", "VS Code"],
        "interests": ["AI/ML", "Web Development", "Game Development", "UI/UX Design"]
    }
    await db.skills.insert_one(skills)
    print("✓ Skills seeded")
    
    # Insert experience
    experiences = [
        {
            "id": "exp1",
            "title": "Software Engineering Intern",
            "company": "TechCorp",
            "location": "San Francisco, CA",
            "period": "Summer 2024",
            "description": "Developed full-stack features for internal tools using React and Node.js. Optimized database queries resulting in 40% performance improvement.",
            "technologies": ["React", "Node.js", "PostgreSQL", "Docker"]
        },
        {
            "id": "exp2",
            "title": "Web Developer",
            "company": "University CS Lab",
            "location": "Remote",
            "period": "Jan 2024 - Present",
            "description": "Building interactive educational platforms for computer science courses. Maintained and updated lab website serving 500+ students.",
            "technologies": ["JavaScript", "Python", "Flask", "MongoDB"]
        },
        {
            "id": "exp3",
            "title": "Teaching Assistant",
            "company": "University",
            "location": "On Campus",
            "period": "Sept 2023 - Dec 2023",
            "description": "Assisted in teaching Introduction to Programming course. Held office hours, graded assignments, and mentored 30+ students.",
            "technologies": ["Python", "Java", "Git"]
        }
    ]
    await db.experience.insert_many(experiences)
    print("✓ Experience seeded")
    
    # Insert education
    education = [
        {
            "id": "edu1",
            "degree": "Bachelor of Science in Computer Science",
            "school": "University of California",
            "location": "San Francisco, CA",
            "period": "2022 - 2026 (Expected)",
            "gpa": "3.8/4.0",
            "relevant": ["Data Structures", "Algorithms", "Web Development", "Database Systems", "Machine Learning", "Software Engineering"],
            "description": [
                "Dean's List for 4 consecutive semesters",
                "Member of Women in Computer Science club",
                "Led team project building a social networking app for students",
                "Participated in hackathons and coding competitions"
            ]
        },
        {
            "id": "edu2",
            "degree": "High School Diploma",
            "school": "San Francisco High School",
            "location": "San Francisco, CA",
            "period": "2018 - 2022",
            "gpa": "4.0/4.0",
            "relevant": ["AP Computer Science", "AP Calculus", "Physics"],
            "description": [
                "Valedictorian of graduating class",
                "Founded coding club with 50+ members",
                "Won first place in regional science fair for AI project"
            ]
        }
    ]
    await db.education.insert_many(education)
    print("✓ Education seeded")
    
    # Insert projects
    projects = [
        {
            "id": "proj1",
            "title": "RetroChat",
            "description": "A nostalgic chat application with a retro terminal interface. Features real-time messaging, custom themes, and ASCII emoticons.",
            "technologies": ["React", "Socket.io", "Node.js", "MongoDB"],
            "github": "github.com/alexchen/retrochat",
            "demo": "retrochat.demo.com",
            "image": "chat"
        },
        {
            "id": "proj2",
            "title": "PixelPaint",
            "description": "Web-based pixel art editor with layers, animation support, and sprite sheet export. Perfect for game developers and pixel art enthusiasts.",
            "technologies": ["JavaScript", "Canvas API", "HTML5", "CSS3"],
            "github": "github.com/alexchen/pixelpaint",
            "demo": "pixelpaint.demo.com",
            "image": "paint"
        },
        {
            "id": "proj3",
            "title": "TaskQuest",
            "description": "Gamified todo app that turns your tasks into RPG quests. Level up your productivity with achievements and rewards.",
            "technologies": ["React", "FastAPI", "PostgreSQL", "TailwindCSS"],
            "github": "github.com/alexchen/taskquest",
            "demo": "taskquest.demo.com",
            "image": "game"
        },
        {
            "id": "proj4",
            "title": "CodeSnippets",
            "description": "Personal code snippet manager with syntax highlighting, tagging, and search. Never lose that perfect solution again.",
            "technologies": ["Python", "Flask", "SQLite", "Bootstrap"],
            "github": "github.com/alexchen/codesnippets",
            "demo": None,
            "image": "code"
        }
    ]
    await db.projects.insert_many(projects)
    print("✓ Projects seeded")
    
    # Insert blog posts
    blog_posts = [
        {
            "id": "blog1",
            "title": "Building My First Game Engine",
            "date": "2024-12-15",
            "excerpt": "A journey into low-level programming and game development. Lessons learned from building a 2D game engine from scratch.",
            "content": """# Building My First Game Engine

When I started learning game development, I was fascinated by how games actually work under the hood...

## The Beginning

I decided to build a simple 2D game engine using C++ and SDL2. The goal was to understand the fundamentals...

## Key Learnings

1. **Entity Component Systems** - Managing game objects efficiently
2. **Render Pipeline** - Understanding how graphics are drawn
3. **Physics Integration** - Implementing collision detection

## Conclusion

Building a game engine taught me more about programming than any tutorial could. Highly recommend it!""",
            "tags": ["Game Development", "C++", "Tutorial"]
        },
        {
            "id": "blog2",
            "title": "Why I Love Terminal UIs",
            "date": "2024-11-22",
            "excerpt": "Exploring the beauty of command-line interfaces and why they're making a comeback in modern applications.",
            "content": """# Why I Love Terminal UIs

There's something special about terminal interfaces. They're minimal, efficient, and timeless...

## The Aesthetic

Terminal UIs have a unique charm. The monospace fonts, the blinking cursor, the immediate feedback...

## Modern Applications

Many modern apps are bringing back the terminal aesthetic:
- VS Code's integrated terminal
- Discord's developer tools
- Web-based terminal emulators

The future is retro!""",
            "tags": ["UI/UX", "Design", "Opinion"]
        },
        {
            "id": "blog3",
            "title": "My Journey into Machine Learning",
            "date": "2024-10-08",
            "excerpt": "From confusion to confidence: how I learned ML fundamentals and built my first neural network.",
            "content": """# My Journey into Machine Learning

Machine Learning seemed intimidating at first, but breaking it down made it approachable...

## Starting Simple

I began with linear regression and gradually worked my way up to neural networks...

## Resources That Helped

- Andrew Ng's ML course
- Hands-on projects
- Kaggle competitions

The key is to start coding as soon as possible!""",
            "tags": ["Machine Learning", "AI", "Learning"]
        }
    ]
    await db.blog.insert_many(blog_posts)
    print("✓ Blog posts seeded")
    
    print("\n✅ Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
