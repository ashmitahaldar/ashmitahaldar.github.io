export default {
  name: 'resume',
  title: 'Resume',
  type: 'document',
  
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "My Resume"',
      initialValue: 'Resume',
    },
    {
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      description: 'Upload your resume PDF here',
      options: {
        accept: 'application/pdf',
      },
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      description: 'Automatically set when document is saved',
    },
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
}
