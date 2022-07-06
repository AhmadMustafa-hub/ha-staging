/* global locals, wp */
import * as blocks from '../../../blocks/index.js'
import * as filters from './filters/index.js'
import * as formats from './formats/index.js'
import * as plugins from './plugins/index.js'
import { removeStyles, styles } from './styles/index.js'
const { registerBlockStyle, registerBlockType, unregisterBlockType } = wp.blocks
const { registerPlugin } = wp.plugins
const { registerFormatType } = wp.richText

// Add filters (must come before block registration)
for (let prop in filters) {
  wp.hooks.addFilter(filters[prop].hook, filters[prop].name, filters[prop].func)
}

// Register blocks
function registerBlock(block) {
  registerBlockType(block.name, block.args)
  if (block.styles) {
    block.styles.forEach(style => {
      registerBlockStyle(block.name, style)
    })
  }
  if (block.innerBlocks) {
    block.innerBlocks.forEach(innerBlock => {
      registerBlock(innerBlock)
    })
  }
}
for (let prop in blocks) {
  registerBlock(blocks[prop])
}

// Register formats
for (let prop in formats) {
  registerFormatType(formats[prop].name, formats[prop].args)
}

// Register plugins
for (let prop in plugins) {
  registerPlugin(plugins[prop].name, plugins[prop].args)
}

// Remove/modify some default styles and add our own
wp.domReady(() => {
  removeStyles()
  styles.forEach(v => {
    registerBlockStyle(v.name, v.args)
  })
})

// Remove some default blocks
wp.domReady(() => {
  unregisterBlockType('core/columns')
  unregisterBlockType('core/media-text')
  unregisterBlockType('core/spacer')
  if (['location', 'news', 'person', 'post', 'project', 'publication'].includes(locals.postType)) {
    unregisterBlockType('ws/section')
  }
})
