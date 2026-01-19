import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'responsibilities',
      title: 'Responsibilities',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'deployedUrl',
      title: 'Live Demo URL (Primary)',
      type: 'url',
      description: 'Main deployed URL for the project',
    }),
    defineField({
      name: 'additionalUrls',
      title: 'Additional URLs',
      type: 'array',
      description: 'Additional deployed URLs (e.g., sub-services, dashboards)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Link Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'teamSize',
      title: 'Team Size',
      type: 'number',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "5 days", "3 months"',
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          {title: 'Showcase', value: 'showcase'},
          {title: 'Experience', value: 'experience'},
          {title: 'Personal', value: 'personal'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Project Source',
      type: 'string',
      options: {
        list: [
          {title: 'Side Project', value: 'side-project'},
          {title: 'Masai School', value: 'masai'},
          {title: 'Professional', value: 'professional'},
        ],
      },
    }),
    defineField({
      name: 'isDiscontinued',
      title: 'Is Discontinued?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hasDemo',
      title: 'Has Demo?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'hasCode',
      title: 'Has Code?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'projectType',
      media: 'image',
    },
  },
})
