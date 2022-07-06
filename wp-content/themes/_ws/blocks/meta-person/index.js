/* global React, wp */
import PostPicker from 'Components/post-picker.js'
const { InnerBlocks } = wp.blockEditor
const { createBlock } = wp.blocks
const { BaseControl, TextControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { useEffect } = wp.element
const { __ } = wp.i18n

export const metaPerson = {
  name: 'ws/meta-person',
  args: {
    title: __('Person Meta', '_ws'),
    description: __('Person template data. Only the data is used, so this block\'s position does not matter.', '_ws'),
    icon: 'groups',
    category: 'ws-meta',
    supports: {
      multiple: false,
      customClassName: false
    },
    attributes: {
      suffixes: {
        type: 'string',
        source: 'meta',
        meta: '_person_suffixes'
      },
      position: {
        type: 'string',
        source: 'meta',
        meta: '_person_position'
      },
      linkedin: {
        type: 'string',
        source: 'meta',
        meta: '_person_linkedin'
      },
      email: {
        type: 'string',
        source: 'meta',
        meta: '_person_email'
      },
      twitter: {
        type: 'string',
        source: 'meta',
        meta: '_person_twitter'
      },
      googleScholar: {
        type: 'string',
        source: 'meta',
        meta: '_person_google_scholar'
      },
      resources: {
        type: 'array',
        source: 'meta',
        meta: '_person_resources'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { suffixes, position, linkedin, email, twitter, googleScholar } = props.attributes
      const { editPost } = useDispatch('core/editor')
      const { insertBlock } = useDispatch('core/block-editor')
      const { blockCount, getBlocks } = useSelect(select => ({
        blockCount: select('core/block-editor').getBlockOrder(props.clientId).length,
        getBlocks: select('core/block-editor').getBlocks
      }))
      useEffect(() => {
        return () => {
          const metas = {}
          for (const attribute in metaPerson.args.attributes) {
            const metaName = metaPerson.args.attributes[attribute].meta
            const metaType = metaPerson.args.attributes[attribute].type
            metas[metaName] = metaType === 'boolean' ? false : (metaType === 'number' ? 0 : '')
          }
          editPost({ meta: metas })
        }
      }, [])
      useEffect(() => {
        setAttributes({ resources: getBlocks(props.clientId).map(block => block.attributes.id) })
      }, [blockCount])
      return (
        <div className="row">
          <div className="col-sm-6">
            <TextControl
              label={ __('Suffixes', '_ws') }
              onChange={ newValue => setAttributes({ suffixes: newValue }) }
              value={ suffixes }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ __('Position/Title', '_ws') }
              onChange={ newValue => setAttributes({ position: newValue }) }
              value={ position }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ __('LinkedIn', '_ws') }
              onChange={ newValue => setAttributes({ linkedin: newValue }) }
              value={ linkedin }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ __('Email', '_ws') }
              onChange={ newValue => setAttributes({ email: newValue }) }
              value={ email }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ __('Twitter', '_ws') }
              onChange={ newValue => setAttributes({ twitter: newValue }) }
              value={ twitter }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ __('Google Scholar', '_ws') }
              onChange={ newValue => setAttributes({ googleScholar: newValue }) }
              value={ googleScholar }
            />
          </div>
          <div className="col-xs-12">
            <BaseControl
              label={ __('Related Resources', '_ws') }
            >
              <div className="block-row preview-row">
                <InnerBlocks
                  allowedBlocks={ ['ws/preview'] }
                  templateLock={ false }
                  renderAppender={ () => (
                    <PostPicker
                      onChange={ newValue => {
                        newValue.forEach(id => {
                          insertBlock(createBlock('ws/preview', { id: id }), blockCount, props.clientId)
                        })
                      } }
                    />
                  ) }
                />
              </div>
            </BaseControl>
          </div>
        </div>
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
