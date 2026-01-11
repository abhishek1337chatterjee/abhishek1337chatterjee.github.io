import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'social',
  title: 'Social Link',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Platform Name',
      type: 'string',
      description: 'e.g., "LinkedIn", "GitHub", "Email"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'Full URL or mailto: link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon Key',
      type: 'string',
      description: 'Lucide icon name (e.g., "linkedin", "github", "mail")',
      options: {
        list: [
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'GitHub', value: 'github'},
          {title: 'Email', value: 'mail'},
          {title: 'Twitter/X', value: 'twitter'},
          {title: 'Resume/File', value: 'file-text'},
          {title: 'WhatsApp', value: 'message-circle'},
          {title: 'Phone', value: 'phone'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Background Color',
      type: 'string',
      description: 'Tailwind class or hex (e.g., "bg-[#0077B5]")',
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
      subtitle: 'url',
    },
  },
})
