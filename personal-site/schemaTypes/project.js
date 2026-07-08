// schemas/project.js

export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
    },
    { name: 'github', title: 'GitHub Link', type: 'url' },
    { name: 'demo', title: 'Live Demo Link', type: 'url' },
    {
      name: 'image',
      title: 'Project Image',
      type: 'image',
      description: 'The main image for the project card.',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Optional extra screenshots — shown as a carousel in the project modal.',
    },
    {
      name: 'blogPost',
      title: 'Blog Write-up',
      type: 'reference',
      to: [{ type: 'blogPost' }],
      description: 'Optional — a blog post about this project, linked from the modal.',
    },
    {
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true, // hides it from the editor UI
    },
  ],
}