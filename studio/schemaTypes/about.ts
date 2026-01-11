import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'e.g., "Serverless Engineer | React Developer"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'experience',
      title: 'Years of Experience',
      type: 'string',
      description: 'e.g., "3+ years"',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 6,
      description: 'Short bio/about text. Use double line breaks for paragraphs.',
    }),
    defineField({
      name: 'highlightedPhrases',
      title: 'Highlighted Phrases',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Phrase',
              type: 'string',
              description: 'Exact text to highlight (case-sensitive)',
            },
            {
              name: 'color',
              title: 'Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Cyan (Primary)', value: 'cyan'},
                  {title: 'Pink (Accent)', value: 'pink'},
                  {title: 'Green', value: 'green'},
                  {title: 'Orange', value: 'orange'},
                  {title: 'Purple', value: 'purple'},
                ],
              },
              initialValue: 'cyan',
            },
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'color',
            },
          },
        },
      ],
      description: 'Phrases in the bio to highlight with colors',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key highlights to showcase',
    }),
    defineField({
      name: 'interests',
      title: 'Interests & Hobbies',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'profileImage',
    },
  },
})
