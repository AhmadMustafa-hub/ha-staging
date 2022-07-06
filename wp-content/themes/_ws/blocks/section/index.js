/* global React, wp */
const { InnerBlocks } = wp.blockEditor
const { __ } = wp.i18n

export const section = {
  name: 'ws/section',
  args: {
    title: __('Section', '_ws'),
    description: __('Generic wrapper for transforming any combination of blocks into a section with background and padding rules.', '_ws'),
    icon: <svg viewBox="-4 -4 32 32"><path d="M8 0v2h8v-2h-8zm0 24v-2h8v2h-8zm10-24h6v6h-2v-4h-4v-2zm-18 8h2v8h-2v-8zm0-2v-6h6v2h-4v4h-2zm24 10h-2v-8h2v8zm0 2v6h-6v-2h4v-4h2zm-18 6h-6v-6h2v4h4v2zm12-18h-12v12h12v-12z"/></svg>,
    category: 'ws-layout',
    supports: {
      anchor: true,
      textColor: true,
      background: true,
      padding: true
    },
    edit: props => {
      const { className } = props.attributes
      return (
        <div
          className={ className || '' }
        >
          <InnerBlocks />
        </div>
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
      name: 'narrow',
      label: __('Narrow', '_ws')
    },
    {
      name: 'slim',
      label: __('Slim', '_ws')
    },
    {
      name: 'default',
      label: __('Default', '_ws'),
      isDefault: true
    },
    {
      name: 'wide',
      label: __('Wide', '_ws')
    }
  ]
}
