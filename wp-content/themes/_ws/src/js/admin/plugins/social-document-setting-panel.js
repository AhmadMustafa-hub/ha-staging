/* global React, wp */
import MediaSelect from 'Components/media-select.js'
const { BaseControl, TextareaControl, TextControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { PluginDocumentSettingPanel } = wp.editPost
const { __ } = wp.i18n

export const socialDocumentSettingPanel = {
  name: 'ws-social-document-setting-panel',
  args: {
    render: () => {
      const { meta, title, excerpt } = useSelect(select => ({
        meta: select('core/editor').getEditedPostAttribute('meta'),
        title: select('core/editor').getEditedPostAttribute('title'),
        excerpt: select('core/editor').getEditedPostAttribute('excerpt')
      }))
      const { editPost } = useDispatch('core/editor')
      const setMeta = keyAndValue => {
        editPost({ meta: keyAndValue })
      }
      // Prevent reusable block editor from crashing
      if (!meta) {
        return null
      }
      return (
        <PluginDocumentSettingPanel
          title={ __('Social', '_ws') }
        >
          <p>{ __('This information is placed in meta tags and used by social networks to create rich sharable objects.', '_ws') }</p>
          <TextControl
            label={ __('Title', '_ws') }
            onChange={ newValue => setMeta({ '_social_title': newValue }) }
            value={ meta['_social_title'] }
            placeholder={ meta['_seo_title'] || title }
          />
          <TextareaControl
            label={ __('Description', '_ws') }
            onChange={ newValue => setMeta({ '_social_description': newValue }) }
            value={ meta['_social_description'] }
            placeholder={ meta['_seo_description'] || excerpt }
          />
          <MediaSelect
            label={ __('Image', '_ws') }
            onChange={ ({ id }) => setMeta({ '_social_image': id }) }
            id={ meta['_social_image'] }
          />
          <BaseControl
            id="twitter-username"
            className="twitter-username"
            label={ __('Twitter Username', '_ws') }
          >
            <span>@</span>
            <TextControl
              id="twitter-username"
              className="field-container"
              onChange={ newValue => setMeta({ '_social_twitter': newValue }) }
              value={ meta['_social_twitter'] }
            />
          </BaseControl>
        </PluginDocumentSettingPanel>
      )
    }
  }
}
