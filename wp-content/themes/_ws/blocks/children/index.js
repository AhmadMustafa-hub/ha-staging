/* global React, wp */
import PostPicker from 'Components/post-picker.js'
import PostPreview from 'Components/post-preview.js'
const { InspectorControls } = wp.blockEditor
const { BaseControl, PanelBody, RangeControl, ToggleControl } = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

export const children = {
  name: 'ws/children',
  args: {
    title: __('Child Pages', '_ws'),
    description: __('List all hierarchical children of the current or selected page.', '_ws'),
    icon: 'networking',
    category: 'ws-dynamic',
    supports: {
      anchor: true
    },
    attributes: {
      parent: {
        type: 'number'
      },
      allPosts: {
        type: 'boolean'
      },
      numPosts: {
        type: 'number',
        default: 3
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { className, parent, allPosts, numPosts } = props.attributes
      const { children } = useSelect(select => {
        const postId = select('core/editor').getCurrentPostId()
        const postType = select('core/editor').getCurrentPostType()
        return {
          children: postId && postType ? select('core').getEntityRecords('postType', postType, { parent: parent || postId, per_page: -1 }) : []
        }
      })
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Child Pages Options', '_ws') }
            >
              <BaseControl
                label={ __('Parent Page', '_ws') }
              >
                { parent ? (
                  <PostPreview
                    id={ parent }
                    onDelete={ () => setAttributes({ parent: null }) }
                  />
                ) : (
                  <PostPicker
                    buttonText={ __('Select Parent', '_ws') }
                    postTypes={ ['page'] }
                    single={ true }
                    onChange={ newValue => setAttributes({ parent: newValue[0] }) }
                  />
                ) }
              </BaseControl>
              <ToggleControl
                label={ __('Show All Child Pages', '_ws') }
                onChange={ newValue => setAttributes({ allPosts: newValue }) }
                checked={ allPosts }
              />
              { !allPosts && (
                <RangeControl
                  label={ __('Number of Child Pages', '_ws') }
                  min="1"
                  max="8"
                  onChange={ newValue => setAttributes({ numPosts: newValue }) }
                  value={ numPosts }
                />
              ) }
            </PanelBody>
          </InspectorControls>
          <div className={ `preview-row ${className || ''}` }>
            { children && children.map((v, i) => {
              if (i < 4) {
                return (
                  <div key={ v.id } className="col">
                    <PostPreview id={ v.id } />
                  </div>
                )
              }
            }) }
          </div>
          { children && children.length === 0 ? (<small className="no-posts">{ __('No child pages found.', '_ws') }</small>) : '' }
          { children && children.length > 4 ? (<p className="no-posts">And { children.length - 4 } others</p>) : '' }
        </>
      )
    },
    save: props => {
      return null
    }
  },
  styles: [
    {
      name: 'default',
      label: __('Default', '_ws'),
      isDefault: true
    },
    {
      name: 'cards',
      label: __('Cards', '_ws')
    },
    {
      name: 'tiles',
      label: __('Tiles', '_ws')
    },
    {
      name: 'list',
      label: __('List', '_ws')
    }
  ]
}
