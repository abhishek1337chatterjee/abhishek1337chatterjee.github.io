import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homelab',
  title: 'Homelab',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Side builds',
    }),
    defineField({
      name: 'centerpieceProject',
      title: 'Centerpiece Project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'The always-on build to feature (e.g. Glance Dashboard). Other side projects list automatically.',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      description: 'Only real, confirmed services running on the homelab — do not invent',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()},
            {name: 'metric', title: 'Metric', type: 'string', description: 'e.g. "uptime 312d"'},
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: ['compute', 'network', 'sync', 'automation', 'shell', 'learning'],
              },
            },
            {name: 'note', title: 'Note (chatbot detail)', type: 'text', rows: 2},
            {name: 'order', title: 'Order', type: 'number'},
          ],
          preview: {
            select: {title: 'label', subtitle: 'metric'},
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Homelab'}
    },
  },
})
