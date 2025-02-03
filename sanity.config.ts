import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { structure } from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode';
import {RobotIcon } from '@sanity/icons'
import {theme} from './theme'
import {media} from 'sanity-plugin-media'

export default defineConfig({
  theme,
  name: 'default',
  title: 'Day one with Sanity',
  subtitle: 'This is a test project',
  projectId: 'eopxgfnn',
  dataset: 'production',
  icon: RobotIcon,
  plugins: [structureTool({
    structure,
    defaultDocumentNode,
  }), visionTool(), media()],

  schema: {
    types: schemaTypes,
  },
  tools: (prev, {currentUser}) => {
    console.log('prev', prev)
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')

    if (isAdmin) {
      return prev
    }

    return prev.filter((tool) => tool.name !== 'vision')
  },
})
