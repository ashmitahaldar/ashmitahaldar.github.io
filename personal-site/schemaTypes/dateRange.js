export default {
  name: 'dateRange',
  title: 'Time Period',
  type: 'object',
  fields: [
    {
      name: 'from',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        calendarTodayLabel: 'Today'
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'to',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        calendarTodayLabel: 'Today'
      },
      description: 'Leave blank if the position is current (Present).',
    },
    {
      name: 'isCurrent',
      title: 'Currently Working Here?',
      type: 'boolean',
      description: 'Check this box if the End Date should be displayed as "Present".',
      initialValue: false,
    }
  ],
}