/* global React, wp */
const { RichTextToolbarButton } = wp.blockEditor
const { __ } = wp.i18n
const { toggleFormat } = wp.richText

export const formatSmall = {
  name: 'ws/format-small',
  args: {
    title: __('Small', '_ws'),
    tagName: 'small',
    className: null,
    edit: props => {
      return (
        <RichTextToolbarButton
          title={ __('Small', '_ws') }
          icon={ <svg viewBox="0 0 20 20"><path d="M11.3,5v1.8h-3V15H6.2V6.7h-3V5H11.3z"/><path d="M16.9,8.6v1.1h-1.9V15h-1.4V9.7h-1.9V8.6H16.9z"/></svg> }
          onClick={ () => props.onChange(toggleFormat(
            props.value,
            { type: 'ws/format-small' }
          )) }
          isActive={ props.isActive }
        />
      )
    }
  }
}

export const formatSuperscript = {
  name: 'ws/format-superscript',
  args: {
    title: __('Superscript', '_ws'),
    tagName: 'sup',
    className: null,
    edit: props => {
      return (
        <RichTextToolbarButton
          title={ __('Superscript', '_ws') }
          icon={ <svg viewBox="0 0 20 20"><path d="M5.5,15.5H2.8l3.5-5.6L3,4.5h2.7l1.9,3.6l2-3.6h2.6L9,9.8l3.6,5.7H9.7l-2.1-3.7L5.5,15.5z"/><path d="M14,6.3c0.2-0.4,0.5-0.8,1.1-1.2c0.5-0.4,0.8-0.6,1-0.8c0.2-0.2,0.3-0.5,0.3-0.8c0-0.2-0.1-0.4-0.2-0.6S16,2.7,15.7,2.7c-0.3,0-0.6,0.1-0.7,0.4c-0.1,0.1-0.1,0.4-0.1,0.7h-1.1c0-0.5,0.1-0.9,0.3-1.2c0.3-0.6,0.8-0.8,1.6-0.8c0.6,0,1.1,0.2,1.4,0.5s0.5,0.8,0.5,1.3c0,0.4-0.1,0.8-0.4,1.1c-0.2,0.2-0.4,0.5-0.8,0.7L16,5.7c-0.3,0.2-0.5,0.3-0.6,0.4s-0.2,0.2-0.3,0.3h2.5v1h-3.9C13.8,7,13.9,6.6,14,6.3z"/></svg> }
          onClick={ () => props.onChange(toggleFormat(
            props.value,
            { type: 'ws/format-superscript' }
          )) }
          isActive={ props.isActive }
        />
      )
    }
  }
}

export const formatSubscript = {
  name: 'ws/format-subscript',
  args: {
    title: __('Subscript', '_ws'),
    tagName: 'sub',
    className: null,
    edit: props => {
      return (
        <RichTextToolbarButton
          title={ __('Subscript', '_ws') }
          icon={ <svg viewBox="0 0 20 20"><path d="M5.5,15.5H2.8l3.5-5.6L3,4.5h2.7l1.9,3.6l2-3.6h2.6L9,9.8l3.6,5.7H9.7l-2.1-3.7L5.5,15.5z"/><path d="M14,17.1c0.2-0.4,0.5-0.8,1.1-1.2c0.5-0.4,0.8-0.6,1-0.8c0.2-0.2,0.3-0.5,0.3-0.8c0-0.2-0.1-0.4-0.2-0.6s-0.3-0.2-0.6-0.2c-0.3,0-0.6,0.1-0.7,0.4c-0.1,0.1-0.1,0.4-0.1,0.7h-1.1c0-0.5,0.1-0.9,0.3-1.2c0.3-0.6,0.8-0.8,1.6-0.8c0.6,0,1.1,0.2,1.4,0.5s0.5,0.8,0.5,1.3c0,0.4-0.1,0.8-0.4,1.1c-0.2,0.2-0.4,0.5-0.8,0.7L16,16.5c-0.3,0.2-0.5,0.3-0.6,0.4s-0.2,0.2-0.3,0.3h2.5v1h-3.9C13.8,17.8,13.9,17.4,14,17.1z"/></svg> }
          onClick={ () => props.onChange(toggleFormat(
            props.value,
            { type: 'ws/format-subscript' }
          )) }
          isActive={ props.isActive }
        />
      )
    }
  }
}
