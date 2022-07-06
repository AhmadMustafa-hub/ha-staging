/* globals React, ReactDOM, wp, locals */
const apiFetch = wp.apiFetch
const { Component } = wp.element
const { Button, CheckboxControl, TextareaControl } = wp.components

class AMPOptions extends Component {

  constructor(props) {
    super(props)
    this.state = { types: [], selectedTypes: Object.keys(locals.ampPostTypes), triggers: locals.ampTriggers }
  }

  componentDidMount() {
    apiFetch({ path: `/wp/v2/types` })
      .then(res => {
        res = Object.values(res)
        this.setState({ types: [...res.filter(v => {
          return v.slug !== 'wp_block' && v.slug !== 'attachment'
        })] })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    const { selectedTypes, triggers, types } = this.state
    return (
      <>
        <h1>AMP (Accelerated Mobile Pages)</h1>
        <section>
          <h2>Post Types</h2>
          <p>Select the post types for which you want to generate accelerated mobile pages.</p>
          <ul>
            { types.map(v => {
              return (
                <li key={ v.slug }>
                  <CheckboxControl
                    label={ v.name }
                    onChange={ newValue => {
                      if (newValue) {
                        this.setState({ selectedTypes: [...selectedTypes, v.slug] })
                      }
                      else {
                        this.setState({ selectedTypes: [...selectedTypes.filter(vv => {
                          return vv !== v.slug
                        })] })
                      }
                    } }
                    checked={ selectedTypes.includes(v.slug) }
                    name={ `amp[${v.slug}]` }
                  />
                </li>
              )
            }) }
          </ul>
        </section>
        <section>
          <h2>Google Analytics Triggers</h2>
          <p>Accelerated Mobile Pages use a different version of analytics than their desktop counterparts. To trigger custom events, you will need to put the appropriate JSON below.</p>
          <TextareaControl
            placeholder="// Your custom triggers"
            onChange={ newValue => this.setState({ triggers: newValue }) }
            value={ triggers }
            name="amp_trigger"
          />
          <pre>{ `"vars": {
  "account": "UA-XXXXX-Y"
},
"triggers": {
  "trackPageview": {
    "on": "visible",
    "request": "pageview"
  },
  ${triggers || '// Your custom triggers'}
}` }</pre>
        </section>
        <Button
          isPrimary
          type="submit"
        >
          Save Changes
        </Button>
      </>
    )
  }

}

function init() {
  const ampOptions = document.querySelector('.amp-options')
  if (ampOptions) {
    ReactDOM.render(
      <AMPOptions />,
      ampOptions
    )
  }
}

export { init }
