// schemas/microblog.js
// Short, low-ceremony posts rendered as the ~/lab log feed.

export default {
  name: 'microblog',
  title: 'Microblog (Lab Log)',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      description: 'One thought. Keep it under a tweet-and-a-half.',
      validation: (Rule) => Rule.required().max(420),
    },
    {
      name: 'postedAt',
      title: 'Posted At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mood',
      title: 'Mood',
      type: 'string',
      description: 'Optional emoji or one word, e.g. "🌙" or "hyped"',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Optional — something the entry points at.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    },
  ],
  preview: {
    select: { title: 'text', subtitle: 'postedAt' },
    prepare({ title, subtitle }) {
      return {
        title: title ? (title.length > 60 ? `${title.slice(0, 60)}…` : title) : '(empty)',
        subtitle: subtitle ? new Date(subtitle).toLocaleString() : '',
      };
    },
  },
};
