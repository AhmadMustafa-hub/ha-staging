/* global React, wp */
import SVGPicker from 'Components/svg-picker.js'
const { ColorPalette, InspectorControls, RichText } = wp.blockEditor
const { createBlock } = wp.blocks
const { BaseControl, ColorIndicator, PanelBody } = wp.components
const { useSelect, useDispatch } = wp.data
const { __ } = wp.i18n

export const iconListItem = {
  name: 'ws/icon-list-item',
  args: {
    title: __('Icon List Item', '_ws'),
    icon: 'saved',
    category: 'ws-bit',
    supports: {
      customClassName: false,
      html: false
    },
    parent: ['ws/icon-list'],
    attributes: {
      icon: {
        type: 'string'
      },
      iconColor: {
        type: 'string'
      },
      text: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { icon, iconColor, text } = props.attributes
      const { colors } = useSelect(select => {
        // const parent = select('core/block-editor').getBlockParents(props.clientId, true)[0]
        return {
          // children: select('core/block-editor').getBlockOrder(parent).length,
          colors: select('core/editor').getEditorSettings().colors || null
          // parent: parent
        }
      })
      const { removeBlocks, replaceBlocks } = useDispatch('core/block-editor')
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Icon Options', '_ws') }
            >
              <BaseControl
                label={
                  <>
                    { __('Icon Color', '_ws') }
                    { iconColor &&
                      <ColorIndicator
                        colorValue={ iconColor }
                      />
                    }
                  </>
                }
              >
                <ColorPalette
                  className="block-editor-color-palette-control__color-palette"
                  onChange={ newValue => setAttributes({ iconColor: newValue }) }
                  value={ iconColor }
                />
              </BaseControl>
            </PanelBody>
          </InspectorControls>
          <div className="icon-list-item">
            <SVGPicker
              label={ false }
              className={ colors && iconColor ? `has-color has-${colors.filter(c => c.color === iconColor)[0].slug}-color` : '' }
              onChange={ newValue => setAttributes({ icon: newValue }) }
              value={ icon }
            />
            <RichText
              placeholder={ __('List Item', '_ws') }
              tagName="p"
              keepPlaceholderOnFocus={ true }
              onChange={ newValue => setAttributes({ text: newValue }) }
              onSplit={ value => {
                if (!value) {
                  return createBlock('ws/icon-list-item', {
                    ...props.attributes,
                    text: ''
                  })
                }
                return createBlock('ws/icon-list-item', {
                  ...props.attributes,
                  text: value
                })
              } }
              onReplace={ (blocks, indexToSelect) => {
                replaceBlocks([props.clientId], blocks, indexToSelect)
              } }
              onRemove={ forward => {
                removeBlocks([props.clientId], !forward)
              } }
              value={ text }
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
