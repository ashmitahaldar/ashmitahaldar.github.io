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
        "tagline": "// Exploring where tech, design, and entrepreneurship collide.",
        "bio": "Passionate CS student and aspiring technopreneur. I love exploring how technology can tell stories, solve problems, and empower people in small but meaningful ways",
        "email": "ashmita.haldar@u.nus.edu",
        "github": "github.com/ashmitahaldar",
        "linkedin": "linkedin.com/in/ashmita-haldar",
        "location": "Singapore | India"
    }
    supabase.table("profile").insert(profile).execute()
    print("✓ Profile seeded")

    # Insert skills
    skills = {
        "languages": ["Java", "Ruby", "Javascript", "Python", "C", "HTML", "CSS", "Dart", "SQL"],
        "frameworks": ["React", "JavaFX", "Ruby on Rails", "Flutter", "FastAPI"],
        "tools": ["Git", "Docker", "MongoDB", "PostgreSQL", "VS Code", "Amazon Web Services", "Kubernetes", "RSpec"],
        "interests": ["Software Development", "Web Development", "Game Development", "UI/UX Design"]
    }
    supabase.table("skills").insert(skills).execute()
    print("✓ Skills seeded")

    # Insert experience
    experiences = [
        {
            "id": "exp1",
            "title": "Web Development Intern",
            "company": "Pixta Vietnam Ltd.",
            "location": "Hanoi, Vietnam",
            "period": "May 2025 – Aug 2025",
            "description": "Accelerated multiple item downloads by ~80% by replacing a legacy multi-step download flow with a real-time ZIP streaming implementation, improving user experience and reducing server processing load. \n Corrected 950,000+ item tag mistranslations by identifying and fixing root cause in automated tag translation pipeline, improving search accuracy and metadata reliability. \n Resolved high-priority contributor upload limit blocker affecting 2 users by diagnosing backend logic flaw, applying targeted data fixes, and validating success post-deployment. \n Strengthened product reliability across major updates by writing unit tests using RSpec, manually verifying controllers and endpoints, and resolving production bugs reported by users. \n Delivered a technical seminar on Google BigQuery architecture, exploring integrations with cloud storage and applications in agentic AI, fostering knowledge sharing within the team.",
            "technologies": ["Ruby on Rails", "Ruby", "Docker", "Amazon Web Services", "Google BigQuery", "RSpec", "Kubernetes"]
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
            "period": "2024 - 2028 (Expected)",
            "gpa": "4.25/5.00",
            "relevant": ["Data Structures & Algorithms", "Software Engineering", "Entrepreneurship"],
            "description": [
                "Embarking on NUS Overseas College (NOC) Vietnam 3-months program to blend tech skills with entrepreneurial ventures",
                "Member of Women in Tech - NUS Computing",
                "Undergraduate Teaching Assistant for CS1101S - Programming Methodology",
                "Participated in hackathons and coding competitions"
            ]
        },
        {
            "id": "edu2",
            "degree": "International Baccalaureate (IB) Diploma",
            "school": "Pathways World School, Gurgaon",
            "location": "Gurugram, India",
            "period": "2022 - 2024",
            "gpa": "45/45 (IB Diploma)",
            "relevant": ["IB Computer Science HL", "IB Mathematics Analysis and Approaches HL", "IB Physics HL"],
            "description": [
                "Valedictorian of graduating class",
                "Founded coding club with 20+ members"
            ]
        },
        {
            "id": "edu3",
            "degree": "High School Diploma",
            "school": "Taipei American School",
            "location": "Taipei, Taiwan",
            "period": "2020 - 2022",
            "gpa": "4.43/4.8 (Weighted GPA)",
            "relevant": ["AP Computer Science A"],
            "description": [
                "Completed AP Computer Science A with a score of 5",
                "Member of Art Honor Society",
                "Programming Head of JV FRC Robotics Team - Raid One"
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
