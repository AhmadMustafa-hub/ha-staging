/* global React, wp */
import MediaSelect from 'Components/media-select.js'
const { __ } = wp.i18n

export const collage = {
  name: 'ws/collage',
  args: {
    title: __('Collage', '_ws'),
    description: __('Four narrow images with parallax effect.', '_ws'),
    icon: 'format-gallery',
    category: 'ws-bit',
    supports: {
      anchor: true
    },
    attributes: {
      image1: {
        type: 'number'
      },
      image2: {
        type: 'number'
      },
      image3: {
        type: 'number'
      },
      image4: {
        type: 'number'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { image1, image2, image3, image4 } = props.attributes
      return (
        <div className="row collage-row">
          <div className="col-sm-6 col-md-3">
            <MediaSelect
              onChange={ ({ id }) => setAttributes({ image1: id }) }
              id={ image1 }
            />
          </div>
          <div className="col-sm-6 col-md-3">
            <MediaSelect
              onChange={ ({ id }) => setAttributes({ image2: id }) }
              id={ image2 }
            />
          </div>
          <div className="col-sm-6 col-md-3">
            <MediaSelect
              onChange={ ({ id }) => setAttributes({ image3: id }) }
              id={ image3 }
            />
          </div>
          <div className="col-sm-6 col-md-3">
            <MediaSelect
              onChange={ ({ id }) => setAttributes({ image4: id }) }
              id={ image4 }
            />
          </div>
        </div>
      )
    },
    save: props => {
      return null
    }
  },
  styles: [
    {
      name: 'columns',
      label: __('Columns', '_ws'),
      isDefault: true
    },
    {
      name: 'windows',
      label: __('Windows', '_ws')
    }
  ]
}
