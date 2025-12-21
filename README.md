# Personal Portfolio Website

A modern, fully-featured personal portfolio built with React, Sanity CMS, and a terminal-inspired UI. Showcasing projects, blog posts, experience, and skills with smooth animations and interactive components.

## 🌟 Features

- **Terminal-Inspired UI** – Interactive terminal component with command history and custom commands
- **Dynamic Content Management** – Sanity CMS headless backend for easy content updates without redeploying
- **Rich Text Support** – PortableText rendering for formatted blog posts and descriptions
- **Pixelated Avatar System** – Customizable avatar with image upload and emoji fallback
- **Interactive Components** – Typing effects, snake game mini-game, smooth animations with Framer Motion
- **Responsive Design** – Mobile-friendly layouts with CSS Modules and Tailwind CSS
- **3D Visualization** – Lazy-loaded Spline 3D scenes for visual appeal
- **Performance Optimized** – Code-splitting, CSS Modules for scoped styling, efficient image handling
- **SEO-Ready** – Structured content with Sanity integration

## 🛠️ Tech Stack

### Frontend

- **React** – Component-based UI framework
- **TypeScript/JavaScript** – Type-safe and dynamic scripting
- **CSS Modules** – Scoped, maintainable styling
- **Tailwind CSS** – Utility-first CSS framework
- **Framer Motion** – Smooth animations and transitions
- **Lucide Icons** – Lightweight SVG icon library
- **@portabletext/react** – Rich text rendering from Sanity
- **@splinetool/react-spline** – 3D scene integration (lazy-loaded)

### Backend & CMS

- **Sanity CMS** – Headless CMS for content management
- **Sanity Client** – Query and fetch content from Sanity

### Build & Deployment

- **Create React App** – Zero-config React setup
- **PostCSS** – CSS transformations for @apply directives
- **GitHub Pages** – Static site hosting

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components (Home, About, Projects, Blog, etc.)
│   ├── styles/           # CSS Module files for each page
│   ├── hooks/            # Custom React hooks (useTypingEffect, useSnakeGame, useToast)
│   ├── services/         # Sanity client and queries
│   ├── lib/              # Utility functions
│   ├── App.js            # Main app component with routing
│   └── index.js          # React entry point
├── public/               # Static assets
└── package.json          # Frontend dependencies

personal-site/
├── schemaTypes/          # Sanity CMS schema definitions
│   ├── profile.ts        # Profile document (name, bio, avatar, etc.)
│   ├── blogPost.js       # Blog post schema
│   ├── project.js        # Project portfolio items
│   ├── experience.js     # Work experience timeline
│   ├── education.js      # Education records
│   └── skills.js         # Skills categorized by type
├── sanity.config.ts      # Sanity configuration with custom desk structure
└── package.json          # Backend dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Sanity account (free tier available)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ashmitahaldar/ashmitahaldar.github.io.git
cd ashmitahaldar.github.io
```

2. **Setup Frontend**

```bash
cd frontend
npm install
```

3. **Setup Sanity CMS**

```bash
cd ../personal-site
npm install
```

4. **Configure Environment Variables**

In `frontend/.env.local`:

```
REACT_APP_SANITY_PROJECT_ID=your_project_id
REACT_APP_SANITY_DATASET=production
```

5. **Run Development Servers**

Frontend (from `frontend/` directory):

```bash
npm start
```

Sanity Studio (from `personal-site/` directory):

```bash
npm run dev
```

The website will be available at `http://localhost:3000` and Sanity Studio at `http://localhost:3333`.

## 📝 Content Management

### Adding/Editing Content in Sanity Studio

1. Navigate to `http://localhost:3333` (while running `npm run dev` in `personal-site/`)
2. Access the custom desk structure:

   - **Profile** – Main about info, bio, avatar, contact details
   - **Projects** – Portfolio items with descriptions, tech stack, links
   - **Experience** – Work history and roles
   - **Education** – Degree and coursework info
   - **Blog Posts** – Articles with rich text support
   - **Skills** – Languages, frameworks, tools, interests

3. Changes sync in real-time to the frontend

## 🎨 Customization

### Styling

- Page styles are in `frontend/src/styles/` (CSS Modules)
- Global theme colors: pink (`#ec4899`), teal (`#14b8a6`)
- Modify Tailwind config in `frontend/tailwind.config.js`

### Components

- Reusable components in `frontend/src/components/`
- Page layouts in `frontend/src/pages/`
- Custom hooks in `frontend/src/hooks/`

### Adding New Pages

1. Create a new page component in `frontend/src/pages/`
2. Create corresponding CSS Module in `frontend/src/styles/`
3. Add route in `frontend/src/App.js`
4. Add navigation link as needed

## 🔄 Build & Deploy

### Build for Production

```bash
cd frontend
npm run build
```

The optimized build is in `frontend/build/`.

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 📚 Key Features Explained

### Terminal Component

- Custom command system with built-in commands (help, about, skills, etc.)
- Command history navigation with arrow keys
- Scroll-to-bottom on command submission
- Extensible for custom commands

### Typing Effect

- Smooth character-by-character animation
- Used for page titles and subtitles
- Configurable speed and delays

### Snake Game Mini-Game

- Easter egg hidden in the website
- Full keyboard controls
- Collision detection and score tracking

### Sanity Integration

- Queries for all content types (profile, projects, experience, education, blog posts, skills)
- URL transformation for image assets
- Real-time preview in Sanity Studio

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

- **Email** – ashmita \[dot] haldar \[at] u \[dot] nus \[dot] edu
- **GitHub** – [@ashmitahaldar](https://github.com/ashmitahaldar)
- **LinkedIn** – [My LinkedIn profile](https://www.linkedin.com/in/ashmita-haldar/)

---

**Last Updated:** December 2025
