export default {
  name: 'artPhoto',
  title: 'Photography & Art',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Photography', value: 'Photography'},
          {title: 'Digital Art', value: 'Digital Art'},
          {title: 'Illustration', value: 'Illustration'},
          {title: 'Mixed Media', value: 'Mixed Media'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for accessibility.',
      validation: (Rule) => Rule.required().min(8),
    },
    {
      name: 'capturedAt',
      title: 'Captured / Created Date',
      type: 'datetime',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
  ],
  orderings: [
    {
      title: 'Captured Date, Newest First',
      name: 'capturedAtDesc',
      by: [{field: 'capturedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
}
