/* globals React, ReactDOM, wp, locals */
const apiFetch = wp.apiFetch
const { Component } = wp.element
const { Button, CheckboxControl, Notice } = wp.components

class SitemapOptions extends Component {

  constructor(props) {
    super(props)
    this.updateSitemap = this.updateSitemap.bind(this)
    this.state = { types: [], selectedTypes: Object.keys(locals.sitemapPostTypes), lastMod: locals.lastMod, loading: false, alert: { msg: '', type: '' } }
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

  updateSitemap(e) {
    e.preventDefault()
    this.setState({ loading: true })
    const data = new FormData()
    data.append('action', '_ws_generate_sitemap')
    fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      body: data
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            this.setState({ alert: { msg: 'Sitemap updated successfully.', type: 'success' } })
            this.setState({ lastMod: data })
          })
        }
        else {
          this.setState({ alert: { msg: 'There was an error generating the sitemap. Please try again.', type: 'error' } })
        }
      })
      .catch(err => {
        this.setState({ alert: { msg: 'There was an error generating the sitemap. Please try again.', type: 'error' } })
        console.error(err)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  render() {
    const { alert, types, selectedTypes, lastMod, loading } = this.state
    return (
      <>
        <h1>Sitemap</h1>
        <section>
          <p>The sitemap will be automatically updated once a day. If you want to manually to refresh the sitemap, use the button below.</p>
          { alert.msg && (
            <Notice
              status={ alert.type }
              onRemove={ (e) => this.setState({ alert: { msg: '', type: '' } }) }
            >
              <p>{ alert.msg }</p>
            </Notice>
          ) }
          <Button
            isSecondary
            isBusy={ loading }
            onClick={ this.updateSitemap }
          >
            Regenerate Sitemap
          </Button>
          <p><i>Last Regeneration: { lastMod || 'N/A' }</i></p>
        </section>
        <section>
          <h2>Ignore Post Types</h2>
          <p>It&apos;s not always necessary to save every post to the sitemap. Check any post types that you want to omit.</p>
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
                    name={ `sitemap_post_types[${v.slug}]` }
                  />
                </li>
              )
            }) }
          </ul>
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
  const sitemapOptions = document.querySelector('.sitemap-options')
  if (sitemapOptions) {
    ReactDOM.render(
      <SitemapOptions />,
      sitemapOptions
    )
  }
}

export { init }
