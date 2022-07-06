/* global React, wp */
const apiFetch = wp.apiFetch
const { BlockControls } = wp.blockEditor
const { Button, Placeholder, SelectControl, ToolbarGroup } = wp.components
const { useEffect, useState } = wp.element
const { __ } = wp.i18n

function menuToHtml(menus) {
  let output = '<ul>'
  menus.forEach(menu => {
    output += menu.children ? `<li>${menu.title}${menuToHtml(menu.children)}</li>` : `<li>${menu.title}</li>`
  })
  return `${output}</ul>`
}

export const menu = {
  name: 'ws/menu',
  args: {
    title: __('Menu', '_ws'),
    description: __('Display a WordPress registered menu', '_ws'),
    icon: 'menu',
    category: 'ws-dynamic',
    supports: {
      anchor: true
    },
    attributes: {
      menuId: {
        type: 'string',
        default: ''
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { menuId } = props.attributes
      const [menu, setMenu] = useState(null)
      const [menus, setMenus] = useState([])
      useEffect(() => {
        apiFetch({ path: `/ws/menus/` })
          .then(res => {
            const menus = [
              { label: 'Select', value: '', disabled: true },
              ...res.map(menu => ({
                label: menu.name, value: menu.id
              }))
            ]
            setMenus(menus)
          })
          .catch(err => {
            setMenus([])
            console.error('error', err)
          })
      }, [])
      useEffect(() => {
        if (menuId) {
          apiFetch({ path: `/ws/menus/?id=${menuId}` })
            .then(res => {
              setMenu(res[0] === undefined ? 'error' : res[0])
            })
            .catch(err => {
              setMenu(null)
              console.error('error', err)
            })
        }
        else {
          setMenu(null)
        }
      }, [menuId])
      return (
        <>
          { menu ? (
            <>
              <BlockControls>
                <ToolbarGroup>
                  <Button
                    className="components-toolbar__control"
                    label={ __('Remove Menu', '_ws') }
                    icon="trash"
                    onClick={ () => setAttributes({ menuId: '' }) }
                  />
                </ToolbarGroup>
              </BlockControls>
              <div className="person-block">
                { menu === 'error' ? (
                  <>
                    <div className="placeholder"></div>
                    <p>Menu Removed</p>
                  </>
                ) : (
                  <div dangerouslySetInnerHTML={ { __html: menuToHtml(menu.menu_items) } }></div>
                ) }
              </div>
            </>
          ) : (
            <Placeholder
              icon="admin-users"
              label={ __('Menu', '_ws') }
              instructions={ __('Select a menu.', '_ws') }
            >
              <SelectControl
                options={ menus }
                onChange={ newValue => setAttributes({ menuId: newValue }) }
                value={ menuId }
              />
            </Placeholder>
          ) }
        </>
      )
    },
    save: props => {
      return null
    }
  }
}
