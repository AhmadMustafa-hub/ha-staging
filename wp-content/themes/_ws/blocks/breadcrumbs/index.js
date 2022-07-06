/* global React, wp */
const apiFetch = wp.apiFetch
const { InspectorControls } = wp.blockEditor
const { PanelBody, TextControl, ToggleControl } = wp.components
const { useSelect } = wp.data
const { Fragment, useEffect, useState } = wp.element
const { __ } = wp.i18n

export const breadcrumbs = {
  name: 'ws/breadcrumbs',
  args: {
    title: __('Breadcrumbs', '_ws'),
    description: __('List of parent pages according to url structure.', '_ws'),
    icon: 'arrow-right',
    category: 'ws-dynamic',
    supports: {
      customClassName: false
    },
    attributes: {
      separator: {
        type: 'string'
      },
      includeCurrent: {
        type: 'boolean'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { separator, includeCurrent } = props.attributes
      const [breadcrumbs, setBreadcrumbs] = useState([])
      const { currentPostId } = useSelect(select => ({
        currentPostId: select('core/editor').getCurrentPostId()
      }))
      useEffect(() => {
        if (currentPostId) {
          apiFetch({ path: `/ws/breadcrumbs/${currentPostId}${includeCurrent ? '?include_current=1' : ''}` })
            .then(res => {
              setBreadcrumbs(res)
            })
            .catch(err => {
              setBreadcrumbs([])
              console.error('error', err)
            })
        }
      }, [includeCurrent])
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Children Pages Options', '_ws') }
            >
              <TextControl
                label={ __('Separator', '_ws') }
                onChange={ newValue => setAttributes({ separator: newValue }) }
                placeholder="/"
                value={ separator }
              />
              <ToggleControl
                label={ __('Include current page', '_ws') }
                onChange={ newValue => setAttributes({ includeCurrent: newValue }) }
                checked={ includeCurrent }
              />
            </PanelBody>
          </InspectorControls>
          { breadcrumbs.map((b, i) => (
            <Fragment key={ b.id }>
              <span>{ b.title }</span>
              { i < breadcrumbs.length - 1 && (
                <span className="separator">{ separator || '/' }</span>
              ) }
            </Fragment>
          )) }
          { breadcrumbs.length === 0 && (
            <p><i>No Parent Pages</i></p>
          ) }
        </>
      )
    },
    save: props => {
      return null
    }
  }
}
