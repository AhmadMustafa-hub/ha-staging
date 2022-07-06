/* global React, wp */
const { SelectControl, TextControl, ToggleControl } = wp.components
const { useDispatch, useSelect } = wp.data
const { PluginDocumentSettingPanel } = wp.editPost
const { __ } = wp.i18n

export const sitemapDocumentSettingPanel = {
  name: 'ws-sitemap-document-setting-panel',
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
          title={ __('Sitemap', '_ws') }
        >
          <p>{ __('Change these fields to overrite the XML sitemap\'s default values.', '_ws') }</p>
          <SelectControl
            label={ __('Change Frequency', '_ws') }
            options={ [
              { label: __('Always', '_ws'), value: 'always' },
              { label: __('Hourly', '_ws'), value: 'hourly' },
              { label: __('Daily', '_ws'), value: 'daily' },
              { label: __('Weekly', '_ws'), value: 'weekly' },
              { label: __('Monthly', '_ws'), value: 'monthly' },
              { label: __('Yearly', '_ws'), value: 'yearly' },
              { label: __('Never', '_ws'), value: 'never' }
            ] }
            onChange={ newValue => setMeta({ '_sitemap_freq': newValue }) }
            value={ meta['_sitemap_freq'] || 'monthly' }
          />
          <TextControl
            label={ __('Priority', '_ws') }
            type="number"
            min="0"
            max="1"
            step="0.1"
            onChange={ newValue => setMeta({ '_sitemap_priority': newValue }) }
            value={ meta['_sitemap_priority'] === '' ? 0.5 : meta['_sitemap_priority'] }
          />
          <ToggleControl
            label={ __('Remove page from sitemap', '_ws') }
            onChange={ newValue => setMeta({ '_sitemap_remove': newValue }) }
            checked={ meta['_sitemap_remove'] }
          />
        </PluginDocumentSettingPanel>
      )
    }
  }
}
