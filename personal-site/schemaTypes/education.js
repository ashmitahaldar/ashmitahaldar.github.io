// schemas/education.js

export default {
  name: 'education',
  title: 'Education',
  type: 'document',
  
  fields: [
    { name: 'degree', title: 'Degree', type: 'string' },
    { name: 'school', title: 'School / University', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    {
      name: 'period',
      title: 'Time Period',
      type: 'dateRange',
    },
    { name: 'gpa', title: 'GPA', type: 'string' },
    {
      name: 'relevant',
      title: 'Relevant Courses',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'description',
      title: 'Extracurricular / Notes',
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
      title: 'school',
      subtitle: 'degree',
    },
  },
}