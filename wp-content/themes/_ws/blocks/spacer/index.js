/* global React, wp */
const { InspectorControls } = wp.blockEditor
const { PanelBody, Path, SelectControl, SVG } = wp.components
const { __ } = wp.i18n

export const spacer = {
  name: 'ws/spacer',
  args: {
    title: __('Spacer', '_ws'),
    description: __('Add white space between blocks and customize its height.', '_ws'),
    icon: (
      <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path d="M13 4v2h3.59L6 16.59V13H4v7h7v-2H7.41L18 7.41V11h2V4h-7" /></SVG>
    ),
    category: 'layout',
    attributes: {
      height: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { height } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Spacer Settings', '_ws') }
            >
              <SelectControl
                label={ __('Height', '_ws') }
                options={ [
                  { label: 'Section Divider', value: 'spacer-100' },
                  { label: 'Short Section Divider', value: 'spacer-50' }
                ] }
                onChange={ newValue => setAttributes({ height: newValue }) }
                value={ height }
              />
            </PanelBody>
          </InspectorControls>
          <div className={ `spacer ${height || ''}` }></div>
        </>
      )
    },
    save: props => {
      return null
    }
  }
}
