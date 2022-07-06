/* global React, wp */
const { __ } = wp.i18n

export const marketsServices = {
  name: 'ws/markets-services',
  args: {
    title: __('Markets & Services Feature', '_ws'),
    description: __('Large section featuring the Markets amd Services.', '_ws'),
    icon: 'star-filled',
    category: 'ws-layout',
    supports: {
      anchor: true
    },
    edit: props => {
      return (
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <h3>Markets</h3>
            </div>
            <div className="card">
              <h3>Services</h3>
            </div>
          </div>
        </div>
      )
    },
    save: props => {
      return null
    }
  }
}
