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
    defineField({
      name: 'telemetryStats',
      title: 'Hero Telemetry Stats',
      type: 'array',
      description: 'Stats shown in the hero, e.g. p99 latency / 1.24k rpm',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()},
            {name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required()},
            {name: 'sublabel', title: 'Sublabel', type: 'string'},
          ],
          preview: {select: {title: 'value', subtitle: 'sublabel'}},
        },
      ],
    }),
    defineField({
      name: 'colorScheme',
      title: 'Default Color Scheme',
      type: 'string',
      options: {
        list: [
          {title: 'Teal + Amber', value: 'teal+amber'},
          {title: 'Cyan + Pink', value: 'cyan+pink'},
          {title: 'Cyan Only', value: 'cyan-only'},
        ],
        layout: 'radio',
      },
      initialValue: 'teal+amber',
    }),
    defineField({
      name: 'version',
      title: 'Telemetry Version',
      type: 'string',
      description: 'Shown in the hero breadcrumb, e.g. "v2026.6"',
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
