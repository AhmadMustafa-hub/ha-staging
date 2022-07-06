/* global React, wp */
const { ToggleControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { PluginDocumentSettingPanel } = wp.editPost
const { __ } = wp.i18n

export const headerFooterDocumentSettingPanel = {
  name: 'ws-header-footer-document-setting-panel',
  args: {
    render: () => {
      const { meta } = useSelect(select => ({
        meta: select('core/editor').getEditedPostAttribute('meta')
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
          title={ __('Header & Footer', '_ws') }
        >
          <p>{ __('These options modify the appearance of the page\'s header and footer.', '_ws') }</p>
          <ToggleControl
            label={ __('Hide Header Nav', '_ws') }
            onChange={ newValue => setMeta({ '_header_footer_hide_header': newValue }) }
            checked={ meta['_header_footer_hide_header'] }
          />
          <ToggleControl
            label={ __('Hide Footer', '_ws') }
            onChange={ newValue => setMeta({ '_header_footer_hide_footer': newValue }) }
            checked={ meta['_header_footer_hide_footer'] }
          />
        </PluginDocumentSettingPanel>
      )
    }
  }
}
