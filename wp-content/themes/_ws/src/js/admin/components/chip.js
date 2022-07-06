/* globals React, wp */
const { Dashicon } = wp.components
const { Component } = wp.element

export default class Chip extends Component {

  render() {
    return (!!this.props.value && (
      <div className="chip">
        <span>{ this.props.value }</span>
        <button className="close-button" onClick={ this.props.onDelete }>
          <Dashicon icon="no-alt" />
        </button>
      </div>
    ))
  }

}
