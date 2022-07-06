/* globals React, ReactDOM, wp, locals */
const { MediaUpload } = wp.blockEditor
const { BaseControl, Button, Spinner } = wp.components
const { useSelect } = wp.data
const { Component } = wp.element
const { __ } = wp.i18n

// MediaUploadCheck doesn't work outside of posts, so we have to do our own permissions check
function CanUpload(props) {
  const canUpload = useSelect(select => {
    return select('core').canUser('create', 'media')
  })
  return canUpload ? props.children : <p>Insuffiencent Permissions</p>
}

class AuthorOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mediaObject: null,
      customAvatar: locals.customAvatar
    }
  }

  componentDidMount() {
    if (this.state.customAvatar) {
      wp.media.attachment(this.state.customAvatar).fetch().then(data => {
        this.setState({ mediaObject: data })
      })
    }
  }

  render() {
    const { mediaObject, customAvatar } = this.state
    return (
      <CanUpload>
        <h3>Custom Avatar</h3>
        <BaseControl>
          { mediaObject && mediaObject.url
            ? <>
              <div>
                { mediaObject.type === 'image' ? (
                  <img
                    src={ mediaObject.sizes.thumbnail ? mediaObject.sizes.thumbnail.url : mediaObject.url }
                    alt={ mediaObject.alt }
                  />
                ) : (
                  <span>{ mediaObject.url.replace(/^.*[/]/, '') }</span>
                ) }
              </div>
              <Button
                isSecondary
                isSmall
                onClick={ e => this.setState({ mediaObject: null, customAvatar: '' }) }
              >
                { __('Clear Media', '_ws') }
              </Button>
            </>
            : <MediaUpload
              onSelect={ newValue => {
                this.setState({ customAvatar: newValue.id })
                wp.media.attachment(newValue.id).fetch().then(data => {
                  this.setState({ mediaObject: data })
                })
              } }
              render={ ({ open }) => (
                <Button
                  isSecondary
                  className="media-selector-button"
                  onClick={ open }
                >
                  { __('Select Image', '_ws') }
                  { customAvatar > 0 && !mediaObject && (
                    <Spinner />
                  ) }
                </Button>
              ) }
            />
          }
        </BaseControl>
        <input name="custom_avatar" type="hidden" value={ customAvatar } />
      </CanUpload>
    )
  }

}

function init() {
  const authorOptions = document.querySelector('.author-options')
  if (authorOptions) {
    ReactDOM.render(
      <AuthorOptions />,
      authorOptions
    )
  }
}

export { init }
