from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_KEY']
supabase: Client = create_client(supabase_url, supabase_key)

def seed_database():
    print("Seeding database...")
    # Clear existing data
    # Clear tables with UUID id columns
    for table in ["profile", "skills"]:
        supabase.table(table).delete().not_.is_("id", None).execute()
    # Clear tables with text id columns
    for table in ["experience", "education", "projects", "blog"]:
        supabase.table(table).delete().gte("id", "").execute()

    # Insert profile
    profile = {
        "name": "Ashmita Haldar",
        "title": "Computer Science + Entrepreneurship @ NUS",
        "tagline": "// building the future, one line at a time",
        "bio": "Passionate CS student who loves merging creativity with tech and impact.",
        "email": "ashmita.haldar@u.nus.edu",
        "github": "github.com/ashmitahaldar",
        "linkedin": "linkedin.com/in/ashmita-haldar",
        "location": "Singapore | India"
    }
    supabase.table("profile").insert(profile).execute()
    print("✓ Profile seeded")

    # Insert skills
    skills = {
        "languages": ["Python", "JavaScript", "Java", "C++", "TypeScript", "SQL"],
        "frameworks": ["React", "Node.js", "Express", "FastAPI", "TailwindCSS"],
        "tools": ["Git", "Docker", "MongoDB", "PostgreSQL", "VS Code"],
        "interests": ["AI/ML", "Web Development", "Game Development", "UI/UX Design"]
    }
    supabase.table("skills").insert(skills).execute()
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
    for exp in experiences:
        supabase.table("experience").insert(exp).execute()
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
    for edu in education:
        supabase.table("education").insert(edu).execute()
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
    for proj in projects:
        supabase.table("projects").insert(proj).execute()
    print("✓ Projects seeded")

    # Insert blog posts
    blog_posts = [
        {
            "id": "blog1",
            "title": "Building My First Game Engine",
            "date": "2024-12-15",
            "excerpt": "A journey into low-level programming and game development. Lessons learned from building a 2D game engine from scratch.",
            "content": """# Building My First Game Engine\n\nWhen I started learning game development, I was fascinated by how games actually work under the hood...\n\n## The Beginning\n\nI decided to build a simple 2D game engine using C++ and SDL2. The goal was to understand the fundamentals...\n\n## Key Learnings\n\n1. **Entity Component Systems** - Managing game objects efficiently\n2. **Render Pipeline** - Understanding how graphics are drawn\n3. **Physics Integration** - Implementing collision detection\n\n## Conclusion\n\nBuilding a game engine taught me more about programming than any tutorial could. Highly recommend it!""",
            "tags": ["Game Development", "C++", "Tutorial"]
        },
        {
            "id": "blog2",
            "title": "Why I Love Terminal UIs",
            "date": "2024-11-22",
            "excerpt": "Exploring the beauty of command-line interfaces and why they're making a comeback in modern applications.",
            "content": """# Why I Love Terminal UIs\n\nThere's something special about terminal interfaces. They're minimal, efficient, and timeless...\n\n## The Aesthetic\n\nTerminal UIs have a unique charm. The monospace fonts, the blinking cursor, the immediate feedback...\n\n## Modern Applications\n\nMany modern apps are bringing back the terminal aesthetic:\n- VS Code's integrated terminal\n- Discord's developer tools\n- Web-based terminal emulators\n\nThe future is retro!""",
            "tags": ["UI/UX", "Design", "Opinion"]
        },
        {
            "id": "blog3",
            "title": "My Journey into Machine Learning",
            "date": "2024-10-08",
            "excerpt": "From confusion to confidence: how I learned ML fundamentals and built my first neural network.",
            "content": """# My Journey into Machine Learning\n\nMachine Learning seemed intimidating at first, but breaking it down made it approachable...\n\n## Starting Simple\n\nI began with linear regression and gradually worked my way up to neural networks...\n\n## Resources That Helped\n\n- Andrew Ng's ML course\n- Hands-on projects\n- Kaggle competitions\n\nThe key is to start coding as soon as possible!""",
            "tags": ["Machine Learning", "AI", "Learning"]
        }
    ]
    for post in blog_posts:
        supabase.table("blog").insert(post).execute()
    print("✓ Blog posts seeded")

    print("\n✅ Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
