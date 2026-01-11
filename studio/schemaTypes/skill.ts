import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'iconUrl',
      title: 'Icon URL',
      type: 'url',
      description: 'Full URL to the icon (e.g., from devicons CDN)',
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name (AWS only)',
      type: 'string',
      description: 'Short abbreviation for AWS services (e.g., "λ" for Lambda, "SF" for Step Functions)',
      hidden: ({document}) => document?.category !== 'cloud',
    }),
    defineField({
      name: 'color',
      title: 'Brand Color',
      type: 'string',
      description: 'Hex color for the skill badge (e.g., "#FF9900" for AWS orange)',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Frontend', value: 'frontend'},
          {title: 'Backend', value: 'backend'},
          {title: 'Cloud & Serverless', value: 'cloud'},
          {title: 'Tools & Platforms', value: 'tools'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first within category',
    }),
  ],
  orderings: [
    {
      title: 'Category, then Order',
      name: 'categoryOrder',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
  },
})
