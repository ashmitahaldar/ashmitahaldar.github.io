// schemas/blogPost.js

export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 2,
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array', // The body of the post, using Portable Text
      of: [
        { type: 'block' },
        { type: 'image' }, // Allows embedding images within the body
      ],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags' // Optional: display as clickable tags in the Studio
      }
    },
  ],
}