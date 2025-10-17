import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const api = {
  // Profile
  getProfile: () => axios.get(`${API}/profile`),
  updateProfile: (data) => axios.put(`${API}/profile`, data),

  // Skills
  getSkills: () => axios.get(`${API}/skills`),
  updateSkills: (data) => axios.put(`${API}/skills`, data),

  // Experience
  getExperience: () => axios.get(`${API}/experience`),
  createExperience: (data) => axios.post(`${API}/experience`, data),
  updateExperience: (id, data) => axios.put(`${API}/experience/${id}`, data),
  deleteExperience: (id) => axios.delete(`${API}/experience/${id}`),

  // Education
  getEducation: () => axios.get(`${API}/education`),
  createEducation: (data) => axios.post(`${API}/education`, data),
  updateEducation: (id, data) => axios.put(`${API}/education/${id}`, data),
  deleteEducation: (id) => axios.delete(`${API}/education/${id}`),

  // Projects
  getProjects: () => axios.get(`${API}/projects`),
  createProject: (data) => axios.post(`${API}/projects`, data),
  updateProject: (id, data) => axios.put(`${API}/projects/${id}`, data),
  deleteProject: (id) => axios.delete(`${API}/projects/${id}`),

  // Blog
  getBlogPosts: (tag = null) => axios.get(`${API}/blog`, { params: tag ? { tag } : {} }),
  getBlogPost: (id) => axios.get(`${API}/blog/${id}`),
  createBlogPost: (data) => axios.post(`${API}/blog`, data),
  updateBlogPost: (id, data) => axios.put(`${API}/blog/${id}`, data),
  deleteBlogPost: (id) => axios.delete(`${API}/blog/${id}`),
};