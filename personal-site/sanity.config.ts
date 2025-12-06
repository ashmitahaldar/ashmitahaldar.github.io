import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'Personal Site',

  projectId: '2azshrlg',
  dataset: 'production',

  plugins: [structureTool({
    structure: (S, context) =>
      S.list()
        .title('Content')
        .items([
          // Projects (orderable)
          orderableDocumentListDeskItem({
            type: 'project',
            title: 'Projects',
            S,
            context,
          }),

          // Standard lists
          S.documentTypeListItem('experience').title('Experience'),
          S.documentTypeListItem('education').title('Education'),
          S.documentTypeListItem('blogPost').title('Blog Posts'),

          // Fallback: include any other types not explicitly listed
          S.divider(),
          ...S.documentTypeListItems().filter((item) => {
            const id = item.getId?.();
            return id ? !['project'].includes(id) : true;
          }),
        ]),
  }), 
  visionTool()],

  schema: {
    types: schemaTypes,
  },
})
