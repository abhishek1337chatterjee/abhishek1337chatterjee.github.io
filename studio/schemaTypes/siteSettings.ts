import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'whatsappUrl',
      title: 'WhatsApp URL',
      type: 'url',
    }),
    defineField({
      name: 'resumeFile',
      title: 'Resume PDF',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'openSourceDescription',
      title: 'Open Source Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'openSourceActivities',
      title: 'Open Source Activities',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'githubUsername',
      title: 'GitHub Username',
      type: 'string',
      description: 'Used for GitHub stats and contribution graph',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
