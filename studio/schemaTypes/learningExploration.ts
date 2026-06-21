import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'learningExploration',
  title: 'Learning Exploration',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Technology / Concept',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'e.g. "in progress", "exploring"',
    }),
    defineField({
      name: 'motivation',
      title: 'Why learning this?',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'status',
    },
  },
})
