/* globals React, ReactDOM, wp */
const apiFetch = wp.apiFetch
const { Component } = wp.element
const { Button, CheckboxControl, FormFileUpload, Notice } = wp.components

class BulkEditOptions extends Component {

  constructor(props) {
    super(props)
    this.getBulk = this.getBulk.bind(this)
    this.setBulk = this.setBulk.bind(this)
    this.state = { types: [], selectedTypes: [], alert: { msg: '', type: '' }, loading: false }
  }

  componentDidMount() {
    apiFetch({ path: `/wp/v2/types` })
      .then(res => {
        res = Object.values(res)
        this.setState({ types: [...res.filter(v => {
          return v.slug !== 'wp_block'
        })] })
      })
      .catch(err => {
        console.error(err)
      })
  }

  getBulk(e) {
    e.preventDefault()
    this.setState({ loading: true })
    const { selectedTypes } = this.state
    fetch(`/wp-admin/admin-ajax.php?action=_ws_get_bulk&types=${selectedTypes.join()}`)
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            this.setState({ alert: { msg: '', type: '' } })
            const csvFile = new Blob([data], { type: 'text/csv' })
            const a = document.createElement('a')
            const today = new Date()
            const month = today.getMonth() + 1
            const day = today.getDate()
            a.download = `bulk_data_${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}-${today.getFullYear()}`
            a.href = URL.createObjectURL(csvFile)
            a.click()
          })
        }
        else {
          this.setState({ alert: { msg: 'Something went wrong. Please try again.', type: 'error' } })
        }
      })
      .catch(err => {
        this.setState({ alert: { msg: 'Something went wrong. Please try again.', type: 'error' } })
        console.err(err)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  setBulk(e) {
    e.preventDefault()
    this.setState({ loading: true })
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new FormData()
      data.append('action', '_ws_set_bulk')
      data.append('csv', e.target.result)
      fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: data
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({ alert: { msg: 'Fields updated successfully.', type: 'success' } })
          }
          else {
            this.setState({ alert: { msg: 'There was an error importing the file. Confirm that the file type is correct is and that the data is valid.', type: 'error' } })
          }
        })
        .catch(err => {
          this.setState({ alert: { msg: 'There was an error importing the file. Confirm that the file type is correct is and that the data is valid.', type: 'error' } })
          console.error(err)
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    }
    if (e.target.files.length) {
      reader.readAsText(e.target.files[0])
    }
  }

  render() {
    const { alert, selectedTypes, types, loading } = this.state
    return (
      <>
        <h1>Bulk Edit</h1>
        <section>
          <h2>Export</h2>
          <p>Download a .csv file of all public posts/pages.</p>
          <fieldset>
            <legend>Post Types</legend>
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
                    />
                  </li>
                )
              }) }
            </ul>
          </fieldset>
          <Button
            isSecondary
            isBusy={ loading }
            id="bulk-download"
            onClick={ this.getBulk }
          >
            Download
          </Button>
        </section>
        <section>
          <h2>Import</h2>
          <p>Upload a .csv file with all fields that you want to update. First column should be the post/page id, but the rest of the columns can be any meta field or post field that you want to update. Be sure to include the field name in the first row. If using the previously exported csv file, delete the &quot;url&quot; column. It is only included to help associate a post id with the title. If you want to create a new post, set the ID to &quot;0&quot;. You can set terms for different taxonomies by using the column heading <i>tax_TAXONOMY_SLUG</i> and listing desired terms separated by commas. This will overwrite any previous terms.</p>
          <p><i>Example:</i></p>
          <table className="bulk-table">
            <thead>
              <tr>
                <td>id</td>
                <td>_seo_title</td>
                <td>_seo_description</td>
                <td>post_content</td>
                <td>tax_category</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Title 1</td>
                <td>Description 1</td>
                <td>&lt;p&gt;Post Content 1&lt;/p&gt;</td>
                <td>retail</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Title 2</td>
                <td>Description 2</td>
                <td>&lt;p&gt;Post Content 2&lt;/p&gt;</td>
                <td>industrial,commercial</td>
              </tr>
            </tbody>
          </table>
          { alert.msg && (
            <Notice
              status={ alert.type }
              onRemove={ (e) => this.setState({ alert: { msg: '', type: '' } }) }
            >
              <p>{ alert.msg }</p>
            </Notice>
          ) }
          <FormFileUpload
            accept=".csv"
            isBusy={ loading }
            onChange={ this.setBulk }
            className="is-secondary"
          >
            Import Data
          </FormFileUpload>
        </section>
      </>
    )
  }

}

function init() {
  const bulkEditOptions = document.querySelector('.bulk-edit-options')
  if (bulkEditOptions) {
    ReactDOM.render(
      <BulkEditOptions />,
      bulkEditOptions
    )
  }
}

export { init }
