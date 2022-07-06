/* globals React, wp */
import { sortableContainer, sortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc'
const { Icon, IconButton } = wp.components
const { __ } = wp.i18n

const DragHandle = sortableHandle(() => (
  <div
    className="sortable-handle"
    draggable="true"
  >
    <Icon icon={ () => (
      <svg width="20" height="20" viewBox="0 0 18 18">
        <path d="M13,8c0.6,0,1-0.4,1-1s-0.4-1-1-1s-1,0.4-1,1S12.4,8,13,8z M5,6C4.4,6,4,6.4,4,7s0.4,1,1,1s1-0.4,1-1S5.6,6,5,6z M5,10 c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S5.6,10,5,10z M13,10c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S13.6,10,13,10z M9,6 C8.4,6,8,6.4,8,7s0.4,1,1,1s1-0.4,1-1S9.6,6,9,6z M9,10c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S9.6,10,9,10z"></path>
      </svg>
    ) } />
  </div>
))

const SortableItemHOC = sortableElement(props => (
  <li className={ `sortable-item ${props.className || ''}` }>
    <div className="card">
      <div className="sortable-header">
        <DragHandle />
        <IconButton
          icon="trash"
          label={ __('Delete', '_ws') }
          className="sortable-delete"
          onClick={ e => {
            e.preventDefault()
            props.onDelete(props.i)
          } }
        />
      </div>
      { props.children }
    </div>
  </li>
))

const SortableItem = props => {
  return (
    <SortableItemHOC
      index={ props.i }
      i={ props.i }
      onDelete={ props.onDelete }
      className={ props.className }
    >
      { props.children }
    </SortableItemHOC>
  )
}

const SortableContainerHOC = sortableContainer(({ children }) => (
  <ul className="sortable-container">{ children }</ul>
))

const SortableContainer = props => {
  return (
    <SortableContainerHOC
      onSortStart={ () => {
        document.body.classList.add('grabbing')
      } }
      onSortEnd={ ({ oldIndex, newIndex }) => {
        document.body.classList.remove('grabbing')
        props.onSortEnd(oldIndex, newIndex)
      } }
      helperClass="editor-styles-wrapper editor-block-list__block sortable-help"
      useDragHandle
      axis="xy"
    >
      { props.children }
    </SortableContainerHOC>
  )
}

const deleteItem = (attr, index) => {
  return [
    ...attr.filter((v, i) => {
      return i !== index
    })
  ]
}

const updateItem = (attr, index, key, newValue) => {
  return [
    ...attr.map((v, i) => {
      if (i === index) {
        v[key] = newValue
      }
      return v
    })
  ]
}

function uid() {
  const time = Date.now()
  const last = uid.last || time
  uid.last = time > last ? time : last + 1
  return uid.last.toString(36)
}

export { SortableContainer, SortableItem, deleteItem, updateItem, arrayMove, uid }
