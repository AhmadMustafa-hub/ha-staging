/* globals React, wp */
const { MediaUpload, MediaUploadCheck } = wp.blockEditor
const { BaseControl, Button, FocalPointPicker } = wp.components
const { Component } = wp.element
const { __ } = wp.i18n

export default class MediaSelect extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      mediaObject: null
    }
  }

  componentDidMount() {
    if (this.props.id) {
      wp.media.attachment(this.props.id).fetch().then(data => {
        this.setState({ mediaObject: data })
      })
    }
  }

  componentDidUpdate(oldProps) {
    if (oldProps.id !== this.props.id) {
      wp.media.attachment(this.props.id).fetch().then(data => {
        this.setState({ mediaObject: data })
      })
    }
  }

  render() {
    const {
      allowedTypes,
      buttonText,
      clearText,
      className,
      focalPoint,
      label,
      onChange,
      posterImage,
      size,
      id
    } = this.props
    const attributes = {
      id: id,
      focalPoint: focalPoint,
      posterImage: posterImage
    }
    const { mediaObject } = this.state
    let selection = (
      <MediaUploadCheck>
        <MediaUpload
          onSelect={ newValue => onChange({ ...attributes, id: newValue.id }) }
          allowedTypes={ allowedTypes || [] }
          render={ ({ open }) => (
            <Button
              isSecondary
              className="media-selector-button"
              onClick={ open }
            >
              { buttonText || __('Select Image', '_ws') }
            </Button>
          ) }
        />
      </MediaUploadCheck>
    )
    let preview = (
      <span className="file-name">{ __('File Not Found', '_ws') }</span>
    )
    if (id && mediaObject && mediaObject.url) {
      let url = mediaObject.url
      preview = (
        <span className="file-name">{ url.replace(/^.*[/]/, '') }</span>
      )
      if (mediaObject.type === 'image') {
        const dimensions = {
          width: mediaObject.width,
          height: mediaObject.height
        }
        if (size && mediaObject.sizes[size]) {
          url = mediaObject.sizes[size].url
          dimensions.width = mediaObject.sizes[size].width
          dimensions.height = mediaObject.sizes[size].height
        }
        if (focalPoint) {
          preview = (
            <FocalPointPicker
              url={ url }
              dimensions={ dimensions }
              onChange={ newValue => onChange({ ...attributes, focalPoint: newValue }) }
              value={ focalPoint }
            />
          )
        }
        else {
          preview = (
            <img src={ url } alt={ mediaObject.alt } />
          )
        }
      }
      else if (mediaObject.type === 'video') {
        preview = (
          <>
            <span className="file-name">{ url.replace(/^.*[/]/, '') }</span>
            <MediaSelect
              buttonText={ __('Select Poster Image', '_ws') }
              clearText={ __('Remove Poster Image', '_ws') }
              onChange={ ({ id }) => onChange({ ...attributes, posterImage: id }) }
              allowedTypes={ ['image'] }
              id={ posterImage }
            />
          </>
        )
      }
      selection = (
        <>
          { preview }
          <div className="clear-media-button">
            <Button
              isSecondary
              isSmall
              onClick={ e => {
                this.props.onChange({
                  id: null,
                  focalPoint: {
                    x: 0.5,
                    y: 0.5
                  },
                  posterImage: null
                })
                this.setState({ mediaObject: null })
              } }
            >
              { clearText || __('Clear Media', '_ws') }
            </Button>
          </div>
        </>
      )
    }
    return (
      <BaseControl
        label={ label }
        className={ `components-media-selector ${className || ''}` }
      >
        { selection }
      </BaseControl>
    )
  }

}
