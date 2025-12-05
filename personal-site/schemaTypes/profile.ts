// schemas/profile.js

export default {
  // Sets the internal name of the document type
  name: 'profile',
  // Sets the display name in the Studio sidebar
  title: 'Personal Profile',
  // Defines it as a top-level document
  type: 'document',
  
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      // Since this is a core field, we recommend marking it required
      validation: (Rule: { required: () => any; }) => Rule.required(), 
    },
    {
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'e.g., Senior Software Engineer, Technical Writer'
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short, punchy summary'
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'A brief summary or introduction about yourself',
      rows: 4, // Suggests the height of the textarea in the Studio
    },
    {
      name: 'bio',
      title: 'Biography',
      // We use the 'array' type with 'block' to create rich text (Portable Text)
      // This allows for formatting like paragraphs, bold, lists, etc.
      type: 'array',
      of: [
        { type: 'block' }
      ]
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'email', // Sanity has a dedicated email type
    },
    {
      name: 'github',
      title: 'GitHub Profile URL',
      type: 'url', // Sanity has a dedicated URL type
      description: 'e.g., https://github.com/yourusername'
    },
    {
      name: 'linkedin',
      title: 'LinkedIn Profile URL',
      type: 'url',
      description: 'e.g., https://linkedin.com/in/yourusername'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., Singapore, Remote'
    },
    {
      name: 'avatar',
      title: 'Avatar Image',
      type: 'image',
      description: 'Square image works best (e.g., 512x512).',
      options: {
        hotspot: true,
      },
    },
  ],
  
  // Optional: Add a preview for the document list
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
    },
  },
}