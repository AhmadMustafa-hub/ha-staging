/* globals React, wp */
const { TextControl, ToggleControl } = wp.components
const { Component } = wp.element
const { __ } = wp.i18n

export default class URLControl extends Component {

  render() {
    const { onChange, value } = this.props
    return (
      <div className="components-url-control">
        <TextControl
          label={ __('Link URL', '_ws') }
          onChange={ newValue => onChange({ ...value, url: newValue }) }
          value={ value.url }
        />
        <ToggleControl
          label={ __('Open in new tab', '_ws') }
          onChange={ newValue => onChange({ ...value, opensInNewTab: newValue }) }
          checked={ value.opensInNewTab }
        />
      </div>
    )
  }

}
