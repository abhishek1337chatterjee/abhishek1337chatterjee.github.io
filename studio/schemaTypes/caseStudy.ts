import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Service Slug',
      type: 'string',
      description: 'Mono service name shown in the list, without the svc/ prefix — e.g. "account-deletion-saga"',
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9-]+$/, {name: 'kebab-case'}),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'oneLiner',
      title: 'One-liner',
      type: 'text',
      rows: 2,
      description: 'Single-sentence summary shown under the title. Public-safe only.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'domainTags',
      title: 'Domain Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Short amber chips — e.g. "durable-execution", "compliance". 2-4 tags.',
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'flagship',
      title: 'Flagship?',
      type: 'boolean',
      description: 'Flagships get the ⭐ marker; the first flagship is the default selection',
      initialValue: false,
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      description: 'e.g. "Mar 2026 → Aug 2026" or "Nov 2024 → now"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. "architect & sole implementer"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'highlights',
      title: 'Engineering Highlights',
      type: 'array',
      of: [{type: 'text', rows: 2}],
      description: '2-4 public-safe bullets shown in the detail pane',
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Teal chips in the detail pane',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'chatPrompt',
      title: 'Chatbot Prompt',
      type: 'string',
      description: 'Question pre-filled when the visitor clicks "ask the chatbot about this"',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the service list',
      validation: (Rule) => Rule.required(),
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
    select: {title: 'title', subtitle: 'slug', flagship: 'flagship'},
    prepare({title, subtitle, flagship}) {
      return {
        title: flagship ? `⭐ ${title}` : title,
        subtitle: `svc/${subtitle}`,
      }
    },
  },
})
