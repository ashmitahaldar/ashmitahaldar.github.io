import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2azshrlg', 
  dataset: 'production', 
  apiVersion: '2024-01-01', 
  useCdn: true, 
});

// [0] ensures we only get the first document found (since we only have one profile)
export const profileQuery = `*[_type == "profile"][0] {
  name,
  title,
  tagline,
  bio,
  email,
  github,
  linkedin,
  location,
  "avatarUrl": avatar.asset->url
}`;

// 1. Fetch all Experiences, ordered by period
export const experiencesQuery = `*[_type == "experience"] | order(period.from desc) {
  _id,
  title,
  company,
  location,
  period,
  description,
  technologies
}`;

// 2. Fetch all Projects
export const projectsQuery = `*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  description,
  technologies,
  github,
  demo,
  "imageUrl": image.asset->url, // Fetches the actual URL for the Sanity image asset
}`;

// 3. Fetch all Education records
export const educationQuery = `*[_type == "education"] | order(period.from desc) {
  _id,
  degree,
  school,
  location,
  period,
  gpa,
  relevant,
  description
}`;

// 4. Fetch the single Skills document
export const skillsQuery = `*[_type == "skills"][0] {
  languages,
  frameworks,
  tools,
  interests
}`;

export async function getProfile() {
  return await sanityClient.fetch(profileQuery);
}

export async function getExperiences() {
  return await sanityClient.fetch(experiencesQuery);
}

export async function getProjects() {
  return await sanityClient.fetch(projectsQuery);
}

export async function getEducation() {
  return await sanityClient.fetch(educationQuery);
}

// 5. Fetch all Blog Posts
export const blogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  content,
  tags
}`;

export async function getSkills() {
  return await sanityClient.fetch(skillsQuery);
}

export async function getBlogPosts() {
  return await sanityClient.fetch(blogPostsQuery);
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug) {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    content,
    tags
  }`;
  return await sanityClient.fetch(query, { slug });
}