/* global React, wp */
import { calculatorSlide } from './calculator-slide/index.js'
import { arraysMatch, uniqid } from 'Utilities'
const { InnerBlocks } = wp.blockEditor
const { createBlock } = wp.blocks
const { Button, TextControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const calculator = {
  name: 'ws/calculator',
  args: {
    title: __('Calculator', '_ws'),
    description: __('Controls static variables and steps/questions.', '_ws'),
    icon: 'slides',
    category: 'ws-calculator',
    supports: {
      multiple: false
    },
    attributes: {
      headings: {
        type: 'array',
        default: []
      },
      fields: {
        type: 'array',
        default: []
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { headings, fields } = props.attributes
      const { insertBlock } = useDispatch('core/block-editor')
      const { getBlockCount, getBlocks } = useSelect(select => select('core/block-editor'))
      const slideHeadings = getBlocks(props.clientId).map(b => b.attributes.heading)
      if (!arraysMatch(slideHeadings, headings)) {
        setAttributes({ headings: slideHeadings })
      }
      if (!fields.length) {
        setAttributes({ fields: [{ name: __('Seats', '_ws'), slug: 'seats', value: 0 }] })
      }
      return (
        <>
          <div className="block-row">
            <InnerBlocks
              allowedBlocks={ ['ws/calculator-slide'] }
              templateLock={ false }
              renderAppender={ () => (
                <Button
                  isSecondary
                  onClick={ e => {
                    insertBlock(createBlock('ws/calculator-slide'), getBlockCount(props.clientId), props.clientId)
                  } }
                >
                  { __('Add Slide', '_ws') }
                </Button>
              ) }
            />
          </div>
          <hr />
          <fieldset>
            <legend>Hidden Fields</legend>
            { fields.map(field => {
              return (
                <TextControl
                  key={ field.slug }
                  label={ field.name }
                  type="number"
                  onChange={ newValue => setAttributes({ fields: [
                    ...fields.map((v, i) => {
                      if (i === 0) {
                        return { uid: uniqid(), name: v.name, slug: v.slug, value: newValue }
                      }
                      return v
                    })
                  ] }) }
                  value={ field.value }
                />
              )
            }) }
          </fieldset>
        </>
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  innerBlocks: [calculatorSlide]
}
