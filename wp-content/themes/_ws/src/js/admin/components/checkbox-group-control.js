/* globals React, wp */
const { CheckboxControl } = wp.components
const { Component } = wp.element

function CheckboxList(props) {
  const { onChange, options, value } = props
  return (
    <ul>
      { options.map((option, index) => (
        <li
          key={ index }
        >
          <CheckboxControl
            label={ option.label }
            onChange={ newValue => {
              if (newValue) {
                onChange([...value, option.value])
              }
              else {
                const index = value.indexOf(option.value)
                const temp = [...value]
                temp.splice(index, 1)
                onChange(temp)
              }
            } }
            checked={ value.includes(option.value) }
          />
          { option.children && !!option.children.length && (
            <CheckboxList { ...props } options={ option.children } />
          ) }
        </li>
      ))}
    </ul>
  )
}

export default class CheckboxGroupControl extends Component {

  render() {
    const { legend } = this.props
    return (
      <fieldset className="components-checkbox-group-control">
        { !!legend && (
          <legend>{ legend }</legend>
        ) }
        <CheckboxList { ...this.props } />
      </fieldset>
    )
  }

}
