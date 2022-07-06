/* global React, wp */
const { InnerBlocks } = wp.blockEditor
const { __ } = wp.i18n

export const sideAttached = {
  name: 'ws/side-attached',
  args: {
    title: __('Side Attached Block', '_ws'),
    description: __('Wrapper content in a sub-section that extends to the right or left of the window.', '_ws'),
    icon: 'leftright',
    category: 'ws-layout',
    supports: {
      anchor: true,
      textColor: true,
      background: true
    },
    edit: props => {
      return (
        <InnerBlocks />
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  styles: [
    {
      name: 'left',
      label: __('Left Attached', '_ws')
    },
    {
      name: 'right',
      label: __('Right Attached', '_ws'),
      isDefault: true
    }
  ]
}
