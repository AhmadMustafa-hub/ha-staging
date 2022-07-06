/* global React, wp */
const { TextareaControl, TextControl } = wp.components
const { useDispatch } = wp.data
const { useEffect } = wp.element
const { __ } = wp.i18n

export const metaProject = {
  name: 'ws/meta-project',
  args: {
    title: __('Project Meta', '_ws'),
    description: __('Project template data. Only the data is used, so this block\'s position does not matter.', '_ws'),
    icon: 'portfolio',
    category: 'ws-meta',
    supports: {
      multiple: false,
      customClassName: false
    },
    attributes: {
      company: {
        type: 'string',
        source: 'meta',
        meta: '_project_company'
      },
      location: {
        type: 'string',
        source: 'meta',
        meta: '_project_location'
      },
      kpi1: {
        type: 'string',
        source: 'meta',
        meta: '_project_kpi_1'
      },
      kpiDescription1: {
        type: 'string',
        source: 'meta',
        meta: '_project_kpi_description_1'
      },
      kpi2: {
        type: 'string',
        source: 'meta',
        meta: '_project_kpi_2'
      },
      kpiDescription2: {
        type: 'string',
        source: 'meta',
        meta: '_project_kpi_description_2'
      },
      kpi3: {
        type: 'string',
        source: 'meta',
        meta: '_project_kpi_3'
      },
      kpiDescription3: {
        type: 'string',
        source: 'meta',
        meta: '_project_kpi_description_3'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { company, location, kpi1, kpiDescription1, kpi2, kpiDescription2, kpi3, kpiDescription3 } = props.attributes
      const { editPost } = useDispatch('core/editor')
      useEffect(() => {
        return () => {
          const metas = {}
          for (const attribute in metaProject.args.attributes) {
            const metaName = metaProject.args.attributes[attribute].meta
            const metaType = metaProject.args.attributes[attribute].type
            metas[metaName] = metaType === 'boolean' ? false : (metaType === 'number' ? 0 : '')
          }
          editPost({ meta: metas })
        }
      }, [])
      return (
        <div className="row">
          <div className="col-sm-6">
            <TextControl
              label={ __('Company', '_ws') }
              onChange={ newValue => setAttributes({ company: newValue }) }
              value={ company }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ __('Location', '_ws') }
              placeholder={ __('City, State', '_ws') }
              onChange={ newValue => setAttributes({ location: newValue }) }
              value={ location }
            />
          </div>
          <div className="col-sm-4">
            <TextControl
              label={ __('KPI 1', '_ws') }
              onChange={ newValue => setAttributes({ kpi1: newValue }) }
              value={ kpi1 }
            />
            <TextareaControl
              label={ __('KPI 1 Description', '_ws') }
              onChange={ newValue => setAttributes({ kpiDescription1: newValue }) }
              value={ kpiDescription1 }
            />
          </div>
          <div className="col-sm-4">
            <TextControl
              label={ __('KPI 2', '_ws') }
              onChange={ newValue => setAttributes({ kpi2: newValue }) }
              value={ kpi2 }
            />
            <TextareaControl
              label={ __('KPI 2 Description', '_ws') }
              onChange={ newValue => setAttributes({ kpiDescription2: newValue }) }
              value={ kpiDescription2 }
            />
          </div>
          <div className="col-sm-4">
            <TextControl
              label={ __('KPI 3', '_ws') }
              onChange={ newValue => setAttributes({ kpi3: newValue }) }
              value={ kpi3 }
            />
            <TextareaControl
              label={ __('KPI 3 Description', '_ws') }
              onChange={ newValue => setAttributes({ kpiDescription3: newValue }) }
              value={ kpiDescription3 }
            />
          </div>
        </div>
      )
    },
    save: props => {
      return null
    }
  }
}
