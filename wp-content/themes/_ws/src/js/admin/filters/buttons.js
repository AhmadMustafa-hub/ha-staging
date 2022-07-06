export const buttonsControls = {
  hook: 'blocks.registerBlockType',
  name: 'ws/with-buttons-controls',
  func: settings => {
    if (settings.name === 'core/buttons') {
      return {
        ...settings,
        supports: {
          ...settings.supports,
          align: false,
          textAlign: true
        }
      }
    }
    return settings
  }
}
