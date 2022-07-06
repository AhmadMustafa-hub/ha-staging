export const separatorControls = {
  hook: 'blocks.registerBlockType',
  name: 'ws/with-separator-controls',
  func: settings => {
    if (settings.name === 'core/separator') {
      return {
        ...settings,
        supports: {
          ...settings.supports,
          textAlign: true
        }
      }
    }
    return settings
  }
}
