/* globals React, wp */
const apiFetch = wp.apiFetch
const { Button, CheckboxControl, Modal, RadioControl, TextControl } = wp.components
const { Component } = wp.element
const { __ } = wp.i18n

export default class PostPicker extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      postSelectorVisible: false,
      selection: [],
      filter: '',
      postType: '',
      postList: [],
      postTypes: []
    }
  }

  componentDidMount() {
    apiFetch({ path: `/wp/v2/types` })
      .then(res => {
        res = Object.values(res)
        this.setState({ postTypes: res.filter(v => {
          if (Array.isArray(this.props.postTypes)) {
            return this.props.postTypes.includes(v.slug)
          }
          return v.slug !== 'attachment' && v.slug !== 'wp_block' && v.slug !== 'wp_area'
        }) })
        if (Array.isArray(this.props.postTypes) && this.props.postTypes.length === 1) {
          this.setState({ postType: this.props.postTypes[0] })
          this.getPostList(this.state.postType)
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  getPostList(type) {
    apiFetch({ path: `/ws/all?post_type=${type}` })
      .then(res => {
        this.setState({ postList: res })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    const { postSelectorVisible, selection, filter, postType, postList, postTypes } = this.state
    const { className, buttonText, single } = this.props
    return (
      <>
        <Button
          isSecondary
          className={ className }
          onClick={ () => this.setState({ postSelectorVisible: true }) }
        >
          { buttonText || __('Add Posts', '_ws') }
        </Button>
        { postSelectorVisible &&
          <Modal
            title={ __('Select Posts', '_ws') }
            onRequestClose={ () => this.setState({ postSelectorVisible: false, selection: [], filter: '' }) }
          >
            <div className="post-selector">
              { !!postTypes.length &&
                <div className="button-list post-type-list">
                  <RadioControl
                    label={ __('Post Type', '_ws') }
                    selected={ postType }
                    options={ postTypes.map(v => {
                      return {
                        label: v.name, value: v.slug
                      }
                    }) }
                    onChange={ newValue => {
                      this.setState({ postType: newValue })
                      this.getPostList(newValue)
                    } }
                  />
                </div>
              }
              <div className="button-list post-list">
                <fieldset>
                  { !!postTypes.length &&
                    <legend>{ __('Posts', '_ws') }</legend>
                  }
                  <TextControl
                    aria-label={ __('Filter', '_ws') }
                    className="post-filter"
                    placeholder="Filter..."
                    onChange={ newValue => this.setState({ filter: newValue }) }
                    value={ filter }
                  />
                  { postList && postList.map(v => {
                    return (
                      <CheckboxControl
                        key={ v.ID }
                        label={ v.post_title }
                        className={ `checkbox ${!v.post_title.toUpperCase().includes(filter.toUpperCase()) ? 'hide' : ''}` }
                        checked={ selection.includes(v.ID) }
                        onChange={ newValue => {
                          if (single) {
                            if (newValue) {
                              this.setState({ selection: [v.ID] })
                            }
                            else {
                              this.setState({ selection: [] })
                            }
                          }
                          else {
                            const index = selection.indexOf(v.ID)
                            let s = []
                            if (newValue) {
                              s = [...selection, v.ID]
                            }
                            else if (index > -1) {
                              s = [...selection]
                              s.splice(index, 1)
                            }
                            this.setState({ selection: s })
                          }
                        } }
                      />
                    )
                  }) }
                </fieldset>
              </div>
            </div>
            <div className="modal-buttons">
              <Button
                isPrimary
                disabled={ !selection.length }
                onClick={ newValue => {
                  this.props.onChange([...selection])
                  this.setState({ postSelectorVisible: false, selection: [], filter: '' })
                } }
              >
                { __('Select Posts', '_ws') }
              </Button>
            </div>
          </Modal>
        }
      </>
    )
  }

}
