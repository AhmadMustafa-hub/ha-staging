/* globals React, ReactDOM, wp, locals */
import MediaSelect from 'Components/media-select.js'
const { ColorPalette } = wp.blockEditor
const { Component } = wp.element
const { BaseControl, Button, ColorIndicator, TextControl } = wp.components

class PWAOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pwaName: locals.pwa.name || '',
      pwaShortName: locals.pwa.short_name || '',
      pwaIconSmall: locals.pwa.icon_small || '',
      pwaIconLarge: locals.pwa.icon_large || '',
      pwaBackgroundColor: locals.pwa.background_color || ''
    }
  }

  render() {
    const {
      pwaName,
      pwaShortName,
      pwaIconSmall,
      pwaIconLarge,
      pwaBackgroundColor
    } = this.state
    return (
      <>
        <h1>PWA (Progressive Web App)</h1>
        <section>
          <h2>Look & Feel</h2>
          <TextControl
            label="Name*"
            onChange={ newValue => this.setState({ pwaName: newValue }) }
            value={ pwaName }
            name="pwa[name]"
          />
          <TextControl
            label="Short Name"
            onChange={ newValue => this.setState({ pwaShortName: newValue }) }
            value={ pwaShortName }
            name="pwa[short_name]"
          />
          <MediaSelect
            label="Small Icon* (192px x 192px)"
            className="small-icon"
            onChange={ ({ id }) => this.setState({ pwaIconSmall: id }) }
            id={ pwaIconSmall }
          />
          <input type="hidden" name="pwa[icon_small]" value={ pwaIconSmall } />
          <MediaSelect
            label="Large Icon* (512px x 512px)"
            className="large-icon"
            onChange={ ({ id }) => this.setState({ pwaIconLarge: id }) }
            id={ pwaIconLarge }
          />
          <input type="hidden" name="pwa[icon_large]" value={ pwaIconLarge } />
          <BaseControl
            className="editor-color-palette-control"
            label={
              <>
                Background Color
                { pwaBackgroundColor &&
                  <ColorIndicator
                    colorValue={ pwaBackgroundColor }
                  />
                }
              </>
            }
          >
            <ColorPalette
              disableCustomColors
              className="editor-color-palette-control__color-palette"
              colors={ locals.colors }
              onChange={ (newValue) => {
                this.setState({ pwaBackgroundColor: newValue })
                if (newValue === undefined) {
                  this.setState({ pwaBackgroundColor: '' })
                }
              } }
              value={ pwaBackgroundColor }
            />
          </BaseControl>
          <input type="hidden" name="pwa[background_color]" value={ pwaBackgroundColor } />
          <Button
            isPrimary
            type="submit"
          >
            Save Changes
          </Button>
        </section>
      </>
    )
  }

}

function init() {
  const pwaOptions = document.querySelector('.pwa-options')
  if (pwaOptions) {
    ReactDOM.render(
      <PWAOptions />,
      pwaOptions
    )
  }
}

export { init }
