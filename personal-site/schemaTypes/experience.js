export default {
  name: 'experience',
  title: 'Work Experience',
  type: 'document',
  
  fields: [
    { name: 'title', title: 'Job Title', type: 'string' },
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    {
      name: 'period', // Changed type to use the new object
      title: 'Time Period',
      type: 'dateRange', 
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description (Key Points)',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
  orderings: [
    {
      title: 'Start Date, Newest First',
      name: 'startDateDesc',
      by: [
        {field: 'period.from', direction: 'desc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'company',
    },
  },
}