/* globals React, wp */
const { BaseControl, Button, DatePicker, Dropdown, TimePicker, ToggleControl } = wp.components
const { Component } = wp.element
const { __ } = wp.i18n

export default class DateTimePicker extends Component {

  constructor() {
    super(...arguments)
    this.to12Hour = this.to12Hour.bind(this)
  }

  to12Hour(h, m) {
    if (h > 12) {
      return h - 12 + ':' + ('0' + m).slice(-2) + ' PM'
    }
    return h + ':' + ('0' + m).slice(-2) + ' AM'
  }

  render() {
    const { label, date, hasTime } = this.props
    const dateObject = date ? new Date(date) : null
    const dateString = dateObject ? `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear()}` : '--/--/--'
    const timeString = dateObject && hasTime ? this.to12Hour(dateObject.getHours(), dateObject.getMinutes()) : '--:--'
    return (
      <BaseControl
        label={ label }
        className="components-date-time-picker"
      >
        <p className="date-display">{ `${dateString} ${timeString}` }</p>
        <Dropdown
          renderToggle={ ({ isOpen, onToggle }) => (
            <Button
              isSecondary
              onClick={ onToggle }
              aria-expanded={ isOpen }
            >
              { __('Edit', '_ws') + ' ' + label }
            </Button>
          ) }
          renderContent={ () => (
            <>
              <div className={ hasTime ? '' : 'no-time' }>
                <TimePicker
                  is12Hour="true"
                  onChange= { newValue => this.props.onChange(newValue, hasTime) }
                  currentTime={ date }
                />
              </div>
              <ToggleControl
                label={ __('Time', '_ws') }
                className="time-toggle"
                onChange= { newValue => this.props.onChange(date, newValue) }
                checked={ hasTime }
              />
              <DatePicker
                onChange= { newValue => this.props.onChange(newValue, hasTime) }
                currentDate={ date }
              />
            </>
          ) }
        />
      </BaseControl>
    )
  }

}
