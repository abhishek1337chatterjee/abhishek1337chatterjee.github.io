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
      initialValue: 'Homelab',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Current state of the home server (offline right now)',
      options: {
        list: [
          {title: 'Offline', value: 'OFFLINE'},
          {title: 'Healthy', value: 'HEALTHY'},
          {title: 'Standby', value: 'STANDBY'},
        ],
        layout: 'radio',
      },
      initialValue: 'OFFLINE',
    }),
    defineField({
      name: 'lastSeen',
      title: 'Last Seen',
      type: 'string',
      description: 'Shown when status is OFFLINE/STANDBY, e.g. "2026-05"',
    }),
    defineField({
      name: 'node',
      title: 'Node',
      type: 'string',
      description: 'Light hardware mention, e.g. "Radxa Zero 3E" — no private IPs',
    }),
    defineField({
      name: 'homeUrl',
      title: 'Glance — Home URL (self-hosted)',
      type: 'url',
      description: 'Self-hosted Glance on the home node (may be down)',
    }),
    defineField({
      name: 'emergencyUrl',
      title: 'Glance — Emergency URL (Render)',
      type: 'url',
      description: 'Always-on failover copy on Render (live)',
    }),
    defineField({
      name: 'centerpieceProject',
      title: 'Centerpiece Project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'The home-server project to feature (e.g. Glance Dashboard)',
    }),
    defineField({
      name: 'secondaryProject',
      title: 'Secondary Project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'A second build to feature (e.g. Pulse)',
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
