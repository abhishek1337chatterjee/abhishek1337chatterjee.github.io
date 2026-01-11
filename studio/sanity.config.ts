import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Singleton document types
const singletonTypes = new Set(['about', 'siteSettings'])

// Custom structure for organizing the studio
const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Singletons first
      S.listItem()
        .title('About Me')
        .id('about')
        .child(S.document().schemaType('about').documentId('about')),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      // Content sections
      S.listItem()
        .title('Career Timeline')
        .schemaType('careerPhase')
        .child(S.documentTypeList('careerPhase').title('Career Phases')),
      S.listItem()
        .title('Projects')
        .schemaType('project')
        .child(S.documentTypeList('project').title('Projects')),
      S.listItem()
        .title('Skills')
        .schemaType('skill')
        .child(S.documentTypeList('skill').title('Skills')),
      S.listItem()
        .title('Social Links')
        .schemaType('social')
        .child(S.documentTypeList('social').title('Social Links')),
    ])

export default defineConfig({
  name: 'default',
  title: 'abhishek-portfolio',

  projectId: '1ewtvnrz',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Filter out singletons from new document menu
    templates: (templates) =>
      templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singletons, filter out duplicate actions
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : input,
  },
})
