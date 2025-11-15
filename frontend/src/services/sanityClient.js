import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2azshrlg', 
  dataset: 'production', 
  apiVersion: '2024-01-01', 
  useCdn: true, 
});

// Define the query to fetch the single profile document
// [0] ensures we only get the first document found (since you only have one profile)
export const profileQuery = `*[_type == "profile"][0] {
  name,
  title,
  tagline,
  bio,
  email,
  github,
  linkedin,
  location
}`;

// Optional: You can create a simple fetching function here too
export async function getProfile() {
  return await sanityClient.fetch(profileQuery);
}