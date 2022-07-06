/* global React, wp, locals */
const { TextareaControl, TextControl, ToggleControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { PluginDocumentSettingPanel } = wp.editPost
const { __ } = wp.i18n

export const seoDocumentSettingPanel = {
  name: 'ws-seo-document-setting-panel',
  args: {
    render: () => {
      const { meta, url, title, excerpt } = useSelect(select => ({
        meta: select('core/editor').getEditedPostAttribute('meta'),
        url: select('core/editor').getPermalink(),
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
          title={ __('SEO', '_ws') }
        >
          <p>{ __('These options provide control over Search Engine Optimization via meta tags.', '_ws') }</p>
          <b>{ __('Example of Google Search Result') }</b>
          <div className="seo-preview">
            <p id="seo-preview-title"><span className="title">{ meta['_seo_title'] || title }</span><span className="appended">{ locals.seoMetaTitle ? ` ${locals.seoMetaTitle}` : '' }</span></p>
            <p id="seo-preview-url">{ url }</p>
            <p id="seo-preview-description">{ meta['_seo_description'] || excerpt }</p>
          </div>
          <TextControl
            label={ __('Title', '_ws') }
            onChange={ newValue => setMeta({ '_seo_title': newValue }) }
            value={ meta['_seo_title'] }
            placeholder={ title }
          />
          <TextareaControl
            label={ __('Description', '_ws') }
            onChange={ newValue => setMeta({ '_seo_description': newValue }) }
            value={ meta['_seo_description'] }
            placeholder={ excerpt }
          />
          <TextControl
            label={ __('Keywords', '_ws') }
            onChange={ newValue => setMeta({ '_seo_keywords': newValue }) }
            value={ meta['_seo_keywords'] }
          />
          <TextControl
            label={ __('Canonical', '_ws') }
            onChange={ newValue => setMeta({ '_seo_canonical': newValue }) }
            value={ meta['_seo_canonical'] }
            placeholder={ url }
          />
          <ToggleControl
            label={ __('No Index', '_ws') }
            onChange={ newValue => setMeta({ '_seo_no_index': newValue }) }
            checked={ meta['_seo_no_index'] }
          />
          <ToggleControl
            label={ __('No Follow', '_ws') }
            onChange={ newValue => setMeta({ '_seo_no_follow': newValue }) }
            checked={ meta['_seo_no_follow'] }
          />
          <ToggleControl
            label={ __('Disallow Search', '_ws') }
            onChange={ newValue => setMeta({ '_seo_disallow_search': newValue }) }
            checked={ meta['_seo_disallow_search'] }
          />
        </PluginDocumentSettingPanel>
      )
    }
  }
}
