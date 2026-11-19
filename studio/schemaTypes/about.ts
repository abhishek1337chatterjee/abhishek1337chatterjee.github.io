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
      description:
        'Short "|"-separated parts; the hero types each one after "abhishek." (e.g. "Backend Engineer | Serverless | AWS")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'taglineLead',
      title: 'Hero tagline: lead',
      type: 'string',
      description: 'Text before the green phrase, e.g. "Backend engineer building "',
    }),
    defineField({
      name: 'taglineAccent',
      title: 'Hero tagline: accent (green)',
      type: 'string',
      description: 'The highlighted phrase, e.g. "event-driven systems on AWS"',
    }),
    defineField({
      name: 'taglineTail',
      title: 'Hero tagline: tail',
      type: 'string',
      description: 'Text after the green phrase, e.g. " — and the AI agents and React frontends on top."',
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
            {
              name: 'proofKind',
              title: 'Proves it',
              type: 'string',
              description:
                'Where on the page this claim is proven. Leave empty to keep the phrase as plain coloured text.',
              options: {
                list: [
                  {title: 'A role in Journey', value: 'role'},
                  {title: 'One case study in Work', value: 'study'},
                  {title: 'All case studies in Work', value: 'allStudies'},
                  {title: 'A skill group in Skills', value: 'skillGroup'},
                ],
              },
            },
            {
              name: 'proofRole',
              title: 'Role',
              type: 'reference',
              to: [{type: 'careerPhase'}],
              hidden: ({parent}: {parent?: {proofKind?: string}}) => parent?.proofKind !== 'role',
            },
            {
              name: 'proofStudy',
              title: 'Case study',
              type: 'reference',
              to: [{type: 'caseStudy'}],
              hidden: ({parent}: {parent?: {proofKind?: string}}) => parent?.proofKind !== 'study',
            },
            {
              name: 'proofSkillGroup',
              title: 'Skill group',
              type: 'string',
              options: {
                list: [
                  {title: 'Frontend', value: 'frontend'},
                  {title: 'Backend', value: 'backend'},
                  {title: 'Cloud & Serverless', value: 'cloud'},
                  {title: 'Tools & Platforms', value: 'tools'},
                ],
              },
              hidden: ({parent}: {parent?: {proofKind?: string}}) =>
                parent?.proofKind !== 'skillGroup',
            },
            {
              name: 'proofHot',
              title: 'Highlight in peek',
              type: 'string',
              description:
                'Optional: the chip to light up in the peek card, e.g. "React" among a role\'s highlights',
              hidden: ({parent}: {parent?: {proofKind?: string}}) => parent?.proofKind !== 'role',
            },
          ],
          preview: {
            select: {
              title: 'text',
              color: 'color',
              proof: 'proofKind',
            },
            prepare: ({title, color, proof}: {title?: string; color?: string; proof?: string}) => ({
              title,
              subtitle: [color, proof ? `proves it: ${proof}` : 'no proof link'].join(' · '),
            }),
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
      name: 'currentlyExploring',
      title: 'Currently Exploring',
      type: 'array',
      description: 'Technologies, concepts, and tools you are currently learning or exploring',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  {title: 'Technology', value: 'technology'},
                  {title: 'Concept', value: 'concept'},
                  {title: 'Tool', value: 'tool'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Brief note, e.g., "Building CLI tools"',
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
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Display order (lower = first)',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'category',
            },
          },
        },
      ],
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
