# API Contracts & Integration Plan

## Backend Implementation Plan

### Database Models

#### 1. Profile
- `name`: string
- `title`: string
- `tagline`: string
- `bio`: string
- `email`: string
- `github`: string
- `linkedin`: string
- `location`: string

#### 2. Skills
- `languages`: array of strings
- `frameworks`: array of strings
- `tools`: array of strings
- `interests`: array of strings

#### 3. Experience
- `id`: string
- `title`: string
- `company`: string
- `location`: string
- `period`: string
- `description`: string
- `technologies`: array of strings

#### 4. Education
- `id`: string
- `degree`: string
- `school`: string
- `location`: string
- `period`: string
- `gpa`: string
- `relevant`: array of strings (coursework)
- `description`: array of strings (highlights/bullet points)

#### 5. Projects
- `id`: string
- `title`: string
- `description`: string
- `technologies`: array of strings
- `github`: string
- `demo`: string (nullable)
- `image`: string (type identifier)

#### 6. BlogPosts
- `id`: string
- `title`: string
- `date`: string
- `excerpt`: string
- `content`: string (markdown)
- `tags`: array of strings

---

## API Endpoints

### Profile & Skills
- `GET /api/profile` - Get profile data
- `PUT /api/profile` - Update profile data
- `GET /api/skills` - Get skills data
- `PUT /api/skills` - Update skills data

### Experience
- `GET /api/experience` - Get all experience entries
- `POST /api/experience` - Create new experience entry
- `PUT /api/experience/:id` - Update experience entry
- `DELETE /api/experience/:id` - Delete experience entry

### Education
- `GET /api/education` - Get all education entries
- `POST /api/education` - Create new education entry
- `PUT /api/education/:id` - Update education entry
- `DELETE /api/education/:id` - Delete education entry

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get single blog post
- `GET /api/blog/tags/:tag` - Filter blog posts by tag
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

---

## Frontend Integration Steps

### Current Mock Data Location
- `/frontend/src/data/mock.js` - All mock data

### Files to Update for Backend Integration

1. **Home.jsx**
   - Fetch profile data from `/api/profile`
   - Terminal commands will still use local data but could be enhanced

2. **About.jsx**
   - Fetch profile data from `/api/profile`
   - Fetch skills data from `/api/skills`

3. **Experience.jsx**
   - Fetch experience data from `/api/experience`

4. **Education.jsx**
   - Fetch education data from `/api/education`

5. **Projects.jsx**
   - Fetch projects data from `/api/projects`

6. **Blog.jsx**
   - Fetch blog posts from `/api/blog`
   - Tag filtering will work with backend data

7. **BlogPost.jsx**
   - Fetch single post from `/api/blog/:id`

8. **Resume.jsx**
   - Fetch all data from respective endpoints
   - PDF download will reference `/public/resume.pdf`

---

## Implementation Notes

- All API calls will use `axios` (already installed)
- Backend URL is in `.env` as `REACT_APP_BACKEND_URL`
- Error handling for API failures
- Loading states for better UX
- No authentication required for viewing portfolio
- Admin routes (POST, PUT, DELETE) can be added later if needed

---

## Testing Strategy

1. Test each API endpoint with backend testing agent
2. Verify data flows correctly to frontend
3. Test error scenarios (404, 500, etc.)
4. Verify mobile responsiveness maintained
