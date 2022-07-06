/* global React, wp */
import { panel } from './panel/index.js'
const { InnerBlocks, RichText } = wp.blockEditor
const { createBlock } = wp.blocks
const { Button } = wp.components
const { useDispatch, useSelect } = wp.data
const { useEffect, useState } = wp.element
const { __ } = wp.i18n

export const tabbedPanels = {
  name: 'ws/tabbed-panels',
  args: {
    title: __('Tabbed Panels', '_ws'),
    description: __('Tabbable panels of content.', '_ws'),
    icon: 'table-row-after',
    category: 'ws-layout',
    supports: {
      anchor: true
    },
    edit: props => {
      const { className } = props.attributes
      const [activeTabId, setActiveTabId] = useState('')
      const [style, setStyle] = useState('')
      const {
        insertBlock,
        moveBlocksDown,
        moveBlocksUp,
        removeBlock,
        selectBlock,
        updateBlockAttributes
      } = useDispatch('core/block-editor')
      const { blockCount, getNextBlockClientId, getPreviousBlockClientId, panels } = useSelect(select => ({
        blockCount: select('core/block-editor').getBlockCount(props.clientId),
        getNextBlockClientId: select('core/block-editor').getNextBlockClientId,
        getPreviousBlockClientId: select('core/block-editor').getPreviousBlockClientId,
        panels: select('core/block-editor').getBlocks(props.clientId)
      }))
      useEffect(() => {
        if (panels.length) {
          setActiveTabId(panels[0].clientId)
        }
      }, [])
      useEffect(() => {
        panels.forEach(panel => {
          updateBlockAttributes(panel.clientId, { isActive: false })
        })
        if (activeTabId) {
          updateBlockAttributes(activeTabId, { isActive: true })
        }
      }, [activeTabId])
      useEffect(() => {
        setStyle(className && className.includes('is-style-horizontal') ? 'horizontal' : 'vertical')
      }, [className])
      return (
        <div className={ `row tabs-panels ${className || ''}` }>
          <div className="col tabs">
            { panels.map((panel, index) => {
              return (
                <div
                  className="tab-container"
                  key={ panel.clientId }
                >
                  <div className="movers">
                    <Button
                      label={ __(style === 'vertical' ? 'Move Up' : 'Move Left', '_ws') }
                      onClick={ () => moveBlocksUp([panel.clientId], props.clientId) }
                      icon="arrow-up-alt2"
                    />
                    <Button
                      label={ __(style === 'vertical' ? 'Move Down' : 'Move Right', '_ws') }
                      onClick={ () => moveBlocksDown([panel.clientId], props.clientId) }
                      icon="arrow-down-alt2"
                    />
                  </div>
                  <button
                    className={ `tab ${activeTabId === panel.clientId ? 'is-active' : ''}` }
                    onClick={ () => setActiveTabId(panel.clientId) }
                  >
                    <RichText
                      placeholder={ __('Tab Name', '_ws') }
                      keepPlaceholderOnFocus={ true }
                      onChange={ newValue => updateBlockAttributes(panel.clientId, { heading: newValue }) }
                      value={ panel.attributes.heading }
                    />
                  </button>
                  <Button
                    className="remove-button"
                    label={ __('Remove Tab', '_ws') }
                    onClick={ () => {
                      const nextBlockId = getNextBlockClientId(panel.clientId)
                      const previousBlockId = getPreviousBlockClientId(panel.clientId)
                      removeBlock(panel.clientId)
                        .then(data => {
                          selectBlock(props.clientId)
                          if (activeTabId === panel.clientId) {
                            setActiveTabId(nextBlockId || (previousBlockId || ''))
                          }
                        })
                    } }
                    icon="no-alt"
                  />
                </div>
              )
            }) }
            <Button
              isSecondary
              className="add-tab-button"
              onClick={ () => {
                insertBlock(createBlock('ws/panel'), blockCount, props.clientId)
                  .then(data => {
                    selectBlock(props.clientId)
                    setActiveTabId(data.blocks[0].clientId)
                    document.querySelector(`#block-${props.clientId} .tab-container:nth-child(${data.index + 1}) .rich-text`).focus()
                  })
              } }
            >
              Add Tab
            </Button>
          </div>
          <div className="col panels">
            <div className="panels-outline">
              <InnerBlocks
                allowedBlocks={ ['ws/panel'] }
                template={ [
                  ['ws/panel']
                ] }
                renderAppender={ false }
              />
            </div>
          </div>
        </div>
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  innerBlocks: [panel],
  styles: [
    {
      name: 'vertical',
      label: __('Vertical', '_ws'),
      isDefault: true
    },
    {
      name: 'horizontal',
      label: __('Horizontal', '_ws')
    }
  ]
}
