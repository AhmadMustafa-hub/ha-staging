/* globals React, ReactDOM, wp, locals */
import { SortableContainer, SortableItem, deleteItem, updateItem, arrayMove, uid } from 'Components/sortable.js'
const { Component } = wp.element
const { Button, FormFileUpload, Notice, TextControl } = wp.components

class RedirectOptions extends Component {

  constructor(props) {
    super(props)
    this.redirectImport = this.redirectImport.bind(this)
    this.state = {
      redirects: locals.redirects,
      alert: { msg: '', type: '' }
    }
  }

  redirectImport(e) {
    const { redirects } = this.state
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const results = reader.result.split('\n')
        this.setState({ redirects: [...results.map(v => {
          const result = v.split(',')
          return { uid: uid(), old: result[0], new: result[1] }
        }), ...redirects] })
        this.setState({ alert: { msg: 'Successfully imported.', type: 'success' } })
      }
      catch (err) {
        console.error(err)
        this.setState({ alert: { msg: 'There was an error importing the file. Confirm that the file type is correct is and that the data is valid.', type: 'error' } })
      }
    }
    if (e.target.files.length) {
      reader.readAsText(e.target.files[0])
    }
  }

  render() {
    const { redirects, alert } = this.state
    return (
      <>
        <h1>301 Redirects</h1>
        <section>
          <p>301 Redirects are an HTTP header that redirects the user, and more importantly, any search engine crawlers from an old url to a new one. For more complex queries (regex), write directly to the .htaccess file.</p>
          { alert.msg && (
            <Notice
              status={ alert.type }
              onRemove={ (e) => this.setState({ alert: { msg: '', type: '' } }) }
            >
              <p>{ alert.msg }</p>
            </Notice>
          ) }
          <FormFileUpload
            id="redirect-import"
            accept=".csv"
            onChange={ this.redirectImport }
            className="is-secondary"
          >
            Import Redirects
          </FormFileUpload>
          <Button
            isPrimary
            id="first-svg-submit"
            type="submit"
          >
            Save Changes
          </Button>
          <div className="redirect-list">
            <Button
              isSecondary
              onClick={ (e) => {
                e.preventDefault()
                this.setState({ redirects: [{ uid: uid(), old: '', new: '' }, ...redirects] })
              } }
            >
              Add Redirect
            </Button>
            <SortableContainer
              onSortEnd={ (oldIndex, newIndex) => {
                this.setState({ redirects: arrayMove(redirects, oldIndex, newIndex) })
              } }
            >
              { redirects.map((v, i) => (
                <SortableItem
                  key={ v.uid }
                  i={ i }
                  onDelete={ (index) => {
                    this.setState({ redirects: deleteItem(redirects, index) })
                  } }
                >
                  <div className="redirect">
                    <input name={ `redirects[${i}][uid]` } type="hidden" value={ v.uid } />
                    <div className="old">
                      <TextControl
                        label="Old URL"
                        name={ `redirects[${i}][old]` }
                        onChange={ newValue => this.setState({ redirects: updateItem(redirects, i, 'old', newValue) }) }
                        value={ v.old }
                      />
                    </div>
                    <div className="new">
                      <TextControl
                        label="New URL"
                        name={ `redirects[${i}][new]` }
                        onChange={ newValue => this.setState({ redirects: updateItem(redirects, i, 'new', newValue) }) }
                        value={ v.new }
                      />
                    </div>
                  </div>
                </SortableItem>
              )) }
            </SortableContainer>
            <Button
              isSecondary
              onClick={ (e) => {
                e.preventDefault()
                this.setState({ redirects: [...redirects, { uid: uid(), old: '', new: '' }] })
              } }
            >
              Add Redirect
            </Button>
          </div>
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
  const redirectOptions = document.querySelector('.redirect-options')
  if (redirectOptions) {
    ReactDOM.render(
      <RedirectOptions />,
      redirectOptions
    )
  }
}

export { init }
