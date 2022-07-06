/* globals React, wp */
const apiFetch = wp.apiFetch
const { SelectControl } = wp.components
const { Component } = wp.element

export default class PostTypeControl extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      options: []
    }
  }

  componentDidMount() {
    apiFetch({ path: `/wp/v2/types` })
      .then(res => {
        res = Object.values(res)
        this.setState({ options: res.filter(v => {
          return v.slug !== 'attachment' && v.slug !== 'wp_block' && v.slug !== 'wp_area'
        }).map(v => {
          return { label: v.name, value: v.slug }
        }) })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    const { label, help, value, onChange } = this.props
    return (
      <SelectControl
        label={ label }
        help={ help }
        options={ this.state.options }
        value={ value }
        onChange={ newValue => onChange(newValue) }
      />
    )
  }

}
