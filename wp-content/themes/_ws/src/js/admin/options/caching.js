/* globals React, ReactDOM, wp, locals */
const { Component } = wp.element
const { Button, TextControl } = wp.components

class CachingOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cacheMedia: locals.cache.media,
      cacheCss: locals.cache.css,
      cacheJs: locals.cache.js,
      cacheHtml: locals.cache.html
    }
  }

  render() {
    const {
      cacheMedia,
      cacheCss,
      cacheJs,
      cacheHtml
    } = this.state
    return (
      <>
        <h1>Caching</h1>
        <section>
          <p>Browser caching helps speed up the user&apos;s experience on repeat views by saving files locally so they don&apos;t have to be requested for every page. Here you can define the maximum age files are stored in seconds.</p>
          <p><i>0 = No Caching<br />One hour = 3600<br />One day = 86400<br />One week = 604800<br />One month = 2628000<br />One year = 31536000</i></p>
          <TextControl
            label={ <>Media <small> Images, Icons, Fonts</small></> }
            type="number"
            min="0"
            onChange={ newValue => this.setState({ cacheMedia: newValue }) }
            value={ cacheMedia || 604800 }
            name="cache[media]"
          />
          <TextControl
            label="CSS"
            type="number"
            min="0"
            onChange={ newValue => this.setState({ cacheCss: newValue }) }
            value={ cacheCss || 86400 }
            name="cache[css]"
          />
          <TextControl
            label="JavaScript"
            type="number"
            min="0"
            onChange={ newValue => this.setState({ cacheJs: newValue }) }
            value={ cacheJs || 86400 }
            name="cache[js]"
          />
          <TextControl
            label="HTML"
            type="number"
            min="0"
            onChange={ newValue => this.setState({ cacheHtml: newValue }) }
            value={ cacheHtml || 86400 }
            name="cache[html]"
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
  const cachingOptions = document.querySelector('.caching-options')
  if (cachingOptions) {
    ReactDOM.render(
      <CachingOptions />,
      cachingOptions
    )
  }
}

export { init }
