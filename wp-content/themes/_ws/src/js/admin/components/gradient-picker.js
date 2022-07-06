/* globals React, wp */
const { BaseControl, Button, Dashicon, Tooltip } = wp.components
const { Component } = wp.element
const { __ } = wp.i18n

export default class GradientPicker extends Component {

  render() {
    const { label, gradients, value } = this.props
    return (
      <BaseControl
        className="editor-color-palette-control components-gradient-picker"
        label={ label || __('Select a Gradient', '_ws') }
      >
        <div className="components-circular-option-picker">
          { gradients && gradients.map(gradient => {
            return (
              <Tooltip
                key={ gradient.slug }
                text={ gradient.name }
              >
                <div className="components-circular-option-picker__option-wrapper">
                  <button
                    type="button"
                    className={ `components-circular-option-picker__option ${value === gradient.slug ? 'is-pressed' : ''}` }
                    style={ { backgroundImage: `linear-gradient(to right, ${gradient.start}, ${gradient.end})` } }
                    onClick={ () => {
                      if (value === gradient.slug) {
                        this.props.onChange(null)
                      }
                      else {
                        this.props.onChange(gradient.slug)
                      }
                    } }
                    aria-label={ gradient.name }
                    aria-pressed={ value === gradient.slug }
                  />
                  { value === gradient.slug && <Dashicon size={ 24 } icon="saved" /> }
                </div>
              </Tooltip>
            )
          }) }
          <div className="components-circular-option-picker__custom-clear-wrapper">
            <Button
              isSecondary
              isSmall
              onClick={ () => this.props.onChange(null) }
            >
              Clear
            </Button>
          </div>
        </div>
      </BaseControl>
    )
  }

}
