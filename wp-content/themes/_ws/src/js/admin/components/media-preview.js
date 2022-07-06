/* globals React, wp */
const { Button } = wp.components
const { Component } = wp.element

export default class MediaPreview extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      mediaObject: null
    }
  }

  componentDidMount() {
    if (this.props.id) {
      wp.media.attachment(this.props.id).fetch().then(data => {
        this.setState({ mediaObject: wp.media.attachment(this.props.id).attributes })
      })
    }
  }

  componentDidUpdate(oldProps) {
    if (oldProps.id !== this.props.id) {
      wp.media.attachment(this.props.id).fetch().then(data => {
        this.setState({ mediaObject: wp.media.attachment(this.props.id).attributes })
      })
    }
  }

  render() {
    const { className, size, id, x, y } = this.props
    const { mediaObject } = this.state
    if (id && mediaObject && mediaObject.url) {
      return (
        <div className={ `components-media-preview ${className}` }>
          { mediaObject.type === 'image' ? (
            <img
              src={ size && mediaObject.sizes[size] ? mediaObject.sizes[size].url : mediaObject.url }
              alt={ mediaObject.alt }
              style={ { objectPosition: x && y ? `${x}% ${y}%` : false } }
            />
          ) : (
            <span>{ mediaObject.url.replace(/^.*[/]/, '') }</span>
          ) }
          <Button
            icon="no-alt"
            label="Remove"
            onClick={ e => {
              this.props.onChange(null)
              this.setState({ mediaObject: null })
            } }
          />
        </div>
      )
    }
    return null
  }

}
