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
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describe the image for accessibility',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
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

    // ── // now section ──────────────────────────────────────
    {
      name: 'nowUpdated',
      title: 'Now — Last Updated',
      type: 'string',
      description: 'Displayed as "updated <value>", e.g. "May 2026"',
    },
    {
      name: 'nowItems',
      title: 'Now — Items',
      type: 'array',
      description: 'What you\'re currently doing. Icon must be one of: build | read | learn | listen | travel',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Build',   value: 'build'  },
                  { title: 'Read',    value: 'read'   },
                  { title: 'Learn',   value: 'learn'  },
                  { title: 'Listen',  value: 'listen' },
                  { title: 'Travel',  value: 'travel' },
                ],
                layout: 'radio',
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. "building", "reading", "learning"',
            },
            {
              name: 'text',
              title: 'Text',
              type: 'string',
              description: 'The current value, e.g. "a side project in Rust"',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'text' },
          },
        },
      ],
    },

    // ── fun facts ───────────────────────────────────────────
    {
      name: 'funFacts',
      title: 'Fun Facts',
      type: 'array',
      description: 'Key/value pairs shown in the fun facts section on the home page',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'k',
              title: 'Key',
              type: 'string',
              description: 'e.g. "coffee", "IDE theme"',
            },
            {
              name: 'v',
              title: 'Value',
              type: 'string',
              description: 'e.g. "oat flat white"',
            },
            {
              name: 'note',
              title: 'Note (optional)',
              type: 'string',
              description: 'Small italicised aside, e.g. "two, no more"',
            },
          ],
          preview: {
            select: { title: 'k', subtitle: 'v' },
          },
        },
      ],
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