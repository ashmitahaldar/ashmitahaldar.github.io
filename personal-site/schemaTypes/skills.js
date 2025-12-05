// schemas/skills.js

export default {
  name: 'skills',
  title: 'Skills & Interests',
  type: 'document',
  // You might want to restrict this to only one document in the dataset
  __experimental_actions: ['update', 'publish'], 
  
  fields: [
    {
      name: 'languages',
      title: 'Programming Languages',
      type: 'array', // Use an array of strings for simple lists
      of: [{ type: 'string' }],
    },
    {
      name: 'frameworks',
      title: 'Frameworks',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'tools',
      title: 'Tools & Technologies',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'interests',
      title: 'Interests',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}