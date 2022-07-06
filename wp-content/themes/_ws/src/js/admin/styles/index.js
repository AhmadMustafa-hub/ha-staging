/* global wp */
const { unregisterBlockStyle } = wp.blocks
const { __ } = wp.i18n

export function removeStyles() {
  unregisterBlockStyle('core/button', 'default')
  unregisterBlockStyle('core/button', 'fill')
  unregisterBlockStyle('core/button', 'outline')
  unregisterBlockStyle('core/button', 'squared')

  unregisterBlockStyle('core/quote', 'default')
  unregisterBlockStyle('core/quote', 'large')

  unregisterBlockStyle('core/pullquote', 'default')
  unregisterBlockStyle('core/pullquote', 'solid-color')

  unregisterBlockStyle('core/separator', 'default')
  unregisterBlockStyle('core/separator', 'wide')
  unregisterBlockStyle('core/separator', 'dots')
}

export const styles = [
  {
    name: 'core/button',
    args: {
      name: 'default',
      label: __('Default', '_ws'),
      isDefault: true
    }
  },
  {
    name: 'core/button',
    args: {
      name: 'outline',
      label: __('Outline', '_ws')
    }
  },
  {
    name: 'core/button',
    args: {
      name: 'simple',
      label: __('Simple', '_ws')
    }
  },
  {
    name: 'core/button',
    args: {
      name: 'arrow',
      label: __('Arrow', '_ws')
    }
  },
  {
    name: 'core/image',
    args: {
      name: 'shadows',
      label: __('Shadows', '_ws')
    }
  }
]
