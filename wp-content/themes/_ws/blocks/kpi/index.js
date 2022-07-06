/* global React, wp */
const { InspectorControls, RichText } = wp.blockEditor
const { PanelBody, CheckboxControl } = wp.components
const { __ } = wp.i18n

export const kpi = {
  name: 'ws/kpi',
  args: {
    title: __('KPI', '_ws'),
    description: __('KPI with secondary text.', '_ws'),
    icon: 'chart-line',
    category: 'ws-bit',
    supports: {
      anchor: true,
      textColor: true,
      textAlign: true
    },
    attributes: {
      kpi: {
        type: 'string'
      },
      label: {
        type: 'string'
      },
      animate: {
        type: 'boolean'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { kpi, label, animate } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('KPI Options', '_ws') }
            >
              <CheckboxControl
                label={ __('Counting Animation', '_ws') }
                onChange={ newValue => setAttributes({ animate: newValue }) }
                checked={ animate }
              />
            </PanelBody>
          </InspectorControls>
          <div className="text-center">
            <RichText
              placeholder={ __('??', '_ws') }
              multiline={ false }
              keepPlaceholderOnFocus={ true }
              tagName="h3"
              onChange={ newValue => setAttributes({ kpi: newValue }) }
              value={ kpi }
            />
            <RichText
              placeholder={ __('KPI Label', '_ws') }
              multiline={ false }
              keepPlaceholderOnFocus={ true }
              tagName="p"
              onChange={ newValue => setAttributes({ label: newValue }) }
              value={ label }
            />
          </div>
        </>
      )
    },
    save: props => {
      return null
    }
  }
}
