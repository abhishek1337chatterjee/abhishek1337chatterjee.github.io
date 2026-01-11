import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'careerPhase',
  title: 'Career Phase',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Phase Title',
      type: 'string',
      description: 'e.g., "Serverless Engineer", "Frontend Developer"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    }),
    defineField({
      name: 'companyWebsite',
      title: 'Company Website',
      type: 'url',
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'e.g., "2024 - Present", "2023 - 2024"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights/Technologies',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key technologies or achievements',
    }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'project'}],
        },
      ],
      description: 'Projects completed during this phase',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (most recent)',
    }),
    defineField({
      name: 'isEducation',
      title: 'Is Education?',
      type: 'boolean',
      description: 'Check if this is an education entry (e.g., Masai School)',
      initialValue: false,
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
      title: 'title',
      subtitle: 'companyName',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle || 'No company',
      }
    },
  },
})
