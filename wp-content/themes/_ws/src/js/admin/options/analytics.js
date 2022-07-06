/* globals React, ReactDOM, wp, locals */
const { Component } = wp.element
const { Button, TextControl } = wp.components

class AnalyticsOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tagManagerId: locals.tagManagerId,
      pardotEmail: locals.pardotEmail,
      pardotPassword: locals.pardotPassword,
      pardotKey: locals.pardotKey,
      pardotAccount: locals.pardotAccount,
      marketoEndpoint: locals.marketoEndpoint,
      marketoToken: locals.marketoToken
    }
  }

  render() {
    const {
      tagManagerId,
      pardotEmail,
      pardotPassword,
      pardotKey,
      pardotAccount,
      marketoEndpoint,
      marketoToken
    } = this.state
    return (
      <>
        <h1>Tracking &amp; Analytics</h1>
        <section>
          <h2>Google Tag Manager</h2>
          <TextControl
            label="Google Tag Manager ID"
            placeholder="GTM-XXXXXXX"
            onChange={ newValue => this.setState({ tagManagerId: newValue }) }
            value={ tagManagerId }
            name="tag_manager_id"
          />
        </section>
        <section>
          <h2>Pardot API</h2>
          <TextControl
            label="Email"
            type="email"
            onChange={ newValue => this.setState({ pardotEmail: newValue }) }
            value={ pardotEmail }
            name="pardot_email"
          />
          <TextControl
            label="Password"
            type="password"
            onChange={ newValue => this.setState({ pardotPassword: newValue }) }
            value={ pardotPassword }
            name="pardot_password"
          />
          <TextControl
            label="User Key"
            onChange={ newValue => this.setState({ pardotKey: newValue }) }
            value={ pardotKey }
            name="pardot_key"
          />
          <TextControl
            label="Account ID"
            onChange={ newValue => this.setState({ pardotAccount: newValue }) }
            value={ pardotAccount }
            name="pardot_account"
          />
        </section>
        <section>
          <h2>Marketo API</h2>
          <TextControl
            label="Endpoint URL"
            onChange={ newValue => this.setState({ marketoEndpoint: newValue }) }
            value={ marketoEndpoint }
            name="marketo_endpoint"
          />
          <TextControl
            label="Access Token"
            onChange={ newValue => this.setState({ marketoToken: newValue }) }
            value={ marketoToken }
            name="marketo_token"
          />
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
  const analyticsOptions = document.querySelector('.analytics-options')
  if (analyticsOptions) {
    ReactDOM.render(
      <AnalyticsOptions />,
      analyticsOptions
    )
  }
}

export { init }
