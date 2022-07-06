/* globals React, ReactDOM, wp, locals */
import lottie from 'lottie-web/build/player/lottie_light'
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc'
import { updateItem, arrayMove, uid } from 'Components/sortable.js'
const { Component } = wp.element
const { Button, FormFileUpload, Notice, TextareaControl, TextControl, Icon, IconButton } = wp.components
const { __ } = wp.i18n

class SVGOptions extends Component {

  constructor(props) {
    super(props)
    this.import = this.import.bind(this)
    this.export = this.export.bind(this)
    this.duplicate = this.duplicate.bind(this)
    this.state = {
      svgs: locals.svgs,
      alert: { msg: '', type: '' }
    }
  }

  componentDidMount() {
    this.animateSVGIcons()
  }

  animateSVGIcons() {
    document.querySelectorAll('.svg-animation').forEach(el => {
      el.innerHTML = ''
      lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: JSON.parse(decodeURIComponent(el.getAttribute('data-src'))),
        rendererSettings: {
          className: 'svg-preview'
        }
      })
    })
  }

  validViewbox(viewbox) {
    if (viewbox) {
      const match = viewbox.match(/(-?\d+(\.\d+)?) (-?\d+(\.\d+)?) (-?\d+(\.\d+)?) (-?\d+(\.\d+)?)/g)
      if ((match && match[0] === viewbox) || viewbox === '') {
        return viewbox
      }
    }
    return false
  }

  import(e) {
    const { svgs } = this.state
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const result = reader.result.replace(/[\n\t\r]+/g, '')
        const parser = new DOMParser()
        const xml = parser.parseFromString(result, 'text/xml')
        const icons = [].slice.call(xml.querySelectorAll('symbol').length ? xml.querySelectorAll('symbol') : xml.querySelectorAll('svg'))
        const newSvgs = icons.map(v => {
          const id = v.id || ''
          const title = v.querySelector('title') ? v.querySelector('title').innerHTML : id
          const viewbox = v.getAttribute('viewBox') || `0 0 ${v.getAttribute('width')} ${v.getAttribute('height')}`
          // Remove elements
          const defs = v.querySelectorAll('defs, title')
          defs.forEach(el => {
            v.removeChild(el)
          })
          // Remove wrapped elements
          const gs = v.querySelectorAll('g')
          gs.forEach(g => {
            while (g.firstChild) {
              v.insertBefore(g.firstChild, g)
            }
            v.removeChild(g)
          })
          // Remove attributes
          v.querySelectorAll('*').forEach(el => {
            el.removeAttribute('class')
          })
          const path = v.innerHTML.replace(/></g, '>\n<')
          return {
            uid: uid(),
            id: id,
            title: title,
            viewbox: viewbox,
            path: path.replace(/\sxmlns=["'].*?["']/g, '') // This is the only way to remove the xmlns attribute for some reason
          }
        })
        this.setState({ svgs: [...newSvgs, ...svgs] })
        this.setState({ alert: { msg: 'Successfully imported.', type: 'success' } })
      }
      catch (err) {
        console.error(err)
        this.setState({ alert: { msg: 'There was an error importing the file. Confirm that the file type is correct is and that the data is valid.', type: 'error' } })
      }
    }
    if (e.target.files.length) {
      reader.readAsText(e.target.files[0])
    }
  }

  export(e) {
    const { svgs } = this.state
    let blob = '<svg>'
    svgs.forEach(svg => {
      blob += `<symbol id="${svg.id}" viewBox="${svg.viewbox}">${svg.title ? `<title>${svg.title}</title>` : ''}${svg.path}</symbol>`
    })
    blob += '</svg>'
    const svgFile = new Blob([blob], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    a.download = `svgs_${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}-${today.getFullYear()}`
    a.href = URL.createObjectURL(svgFile)
    a.click()
  }

  duplicate(id) {
    let c = 0
    this.state.svgs.forEach(v => {
      if (id === v.id) {
        c++
      }
    })
    return c > 1 ? 'invalid' : ''
  }

  render() {
    const { alert, svgs } = this.state
    console.log(svgs)
    return (
      <>
        <h1>SVG Manager</h1>
        <section>
          <p><b>ID</b> - Unique name used by the SVG shortcode to identify the icon. Hyphen delimited.</p>
          <p><b>Title</b> - Description of SVG. Used by screenreaders to identify/describe the icon.</p>
          <p><b>ViewBox</b> - Defines the dimensions of the icon, usually coorelating to Illustrator Artboard dimensions. Must be 4 numbers (float) with the first two numbers being the x,y coordinates of the top left of the artboard (typically 0, 0), and the last two numbers being the width and height of the artboard, respectively.</p>
          <p><b>Paths</b> - This is the actual path data. It is encouraged that you only use path elements, so as too prevent stroke styles or fill rules from changing expected behavior, but all valid SVG elements are allowed. The result will be displayed in real-time with a black fill property. Colors and styles will most likely be different in actual implementation.</p>
          <p><i><b>Tips:</b> Icon should fill most, if not all, of the ViewBox and should likely be a perfect square. All styles and colors will be stripped if using the import tool.</i></p>
          <hr />
          <p>Remember to save changes after adding any new SVG&apos;s. If you accidentally delete an SVG, just refresh the page without saving changes.</p>
          { alert.msg && (
            <Notice
              status={ alert.type }
              onRemove={ e => this.setState({ alert: { msg: '', type: '' } }) }
            >
              <p>{ alert.msg }</p>
            </Notice>
          ) }
          <div className="row">
            <div className="col">
              <FormFileUpload
                id="svg-import"
                accept=".svg"
                onChange={ this.import }
                className="is-secondary"
              >
                Import
              </FormFileUpload>
            </div>
            <div className="col">
              <Button
                onClick={ this.export }
                className="is-secondary"
              >
                Export
              </Button>
            </div>
          </div>
          <Button
            isPrimary
            id="first-svg-submit"
            type="submit"
          >
            Save Changes
          </Button>
          <div className="svg-list">
            <div className="row">
              <div className="col">
                <Button
                  isSecondary
                  onClick={ e => {
                    e.preventDefault()
                    this.setState({ svgs: [{ uid: uid(), type: 'static', id: '', title: '', viewbox: '', path: '' }, ...svgs] })
                  }}
                >
                  Add SVG
                </Button>
              </div>
              <div className="col">
                <Button
                  isSecondary
                  onClick={ e => {
                    e.preventDefault()
                    this.setState({ svgs: [{ uid: uid(), type: 'animation', id: '', title: '', viewbox: '', json: '' }, ...svgs] })
                  }}
                >
                  Add SVG Animation
                </Button>
              </div>
            </div>

            <SortableContainer_
              items={svgs}
              setState={this.setState.bind(this)}
              validViewbox={(...args) => this.validViewbox(...args)}
              duplicate={this.duplicate}
              animateSVGIcons={this.animateSVGIcons.bind(this)}
              onSortEnd={ ({ oldIndex, newIndex }) => this.setState({ svgs: arrayMove(svgs, oldIndex, newIndex) }) }
              onDelete={ index => console.log('onDelete', index) || this.setState({ svgs: svgs.filter((_, i) => i !== index) }) }
              useDragHandle
              svgs={svgs}
            />


            { !!svgs.length && (
              <div className="row">
                <div className="col">
                  <Button
                    isSecondary
                    onClick={ e => {
                      e.preventDefault()
                      this.setState({ svgs: [...svgs, { uid: uid(), type: 'static', id: '', title: '', viewbox: '', path: '' }] })
                    }}
                  >
                    Add SVG
                  </Button>
                </div>
                <div className="col">
                  <Button
                    isSecondary
                    onClick={ e => {
                      e.preventDefault()
                      this.setState({ svgs: [...svgs, { uid: uid(), type: 'animation', id: '', title: '', viewbox: '', json: '' }] })
                    }}
                  >
                    Add SVG Animation
                  </Button>
                </div>
              </div>
            ) }
          </div>
          <Button
            isPrimary
            type="submit"
          >
            Save Changes
          </Button>
        </section>
      </>
    )
  }

}

const SortableContainer_ = SortableContainer(({ items, ...props }) => (
  <ul>
    {items.map((item, index) => (
      <SortableElement_ key={item.uid} index={index} value={item} i={index} {...props}/>
    ))}
  </ul>
))

const SortableElement_ = SortableElement(({ value: v, i, setState, validViewbox, duplicate, animateSVGIcons, onDelete, svgs }) => (
  <div className="card">
    <div className="sortable-header">
      <DragHandle />
      <IconButton
        icon="trash"
        label={ __('Delete', '_ws') }
        className="sortable-delete"
        onClick={ e => {
          console.log(onDelete, i)
          e.preventDefault()
          onDelete(i)
        } }
      />
    </div>
    {
      v.type === 'animation' ? (
        <div className="row options-page">
          <input name={ `svg[${i}][uid]` } type="hidden" value={ v.uid } />
          <input name={ `svg[${i}][type]` } type="hidden" value={ v.type } />
          <div className="col-xs-6">
            <div
              className="svg-animation-container svg-animation"
              data-name={ v.id }
              data-src={ v.json }
            ></div>
          </div>
          <div className="col-xs-6">
            <TextControl
              label="ID"
              name={ `svg[${i}][id]` }
              className={ duplicate(v.id) }
              onChange={ newValue => setState({ svgs: updateItem(svgs, i, 'id', newValue) }) }
              value={ v.id }
            />
          </div>
          <div className="col-xs-12">
            <TextareaControl
              label="JSON"
              name={ `svg[${i}][json]` }
              onChange={ newValue => {
                setState({ svgs: updateItem(svgs, i, 'json', newValue) })
                setTimeout(animateSVGIcons, 0)
              } }
              value={ v.json }
            />
          </div>
        </div>
      ) : (
        <div className="row options-page">
          <input name={ `svg[${i}][uid]` } type="hidden" value={ v.uid } />
          <input name={ `svg[${i}][type]` } type="hidden" value={ v.type } />
          <div className="col-xs-6">
            { validViewbox(v.viewbox) &&
              <svg
                className="svg-preview"
                viewBox={ validViewbox(v.viewbox) }
                dangerouslySetInnerHTML={ { __html: v.path } }
                fillRule="evenodd">
              </svg>
            }
          </div>
          <div className="col-xs-6">
            <TextControl
              label="ID"
              name={ `svg[${i}][id]` }
              className={ duplicate(v.id) }
              onChange={ newValue => setState({ svgs: updateItem(svgs, i, 'id', newValue) }) }
              value={ v.id }
            />
            <TextControl
              label="Title"
              name={ `svg[${i}][title]` }
              onChange={ newValue => setState({ svgs: updateItem(svgs, i, 'title', newValue) }) }
              value={ v.title }
            />
            <TextControl
              label="ViewBox"
              name={ `svg[${i}][viewbox]` }
              className={ validViewbox(v.viewbox) ? '' : 'invalid' }
              onChange={ newValue => setState({ svgs: updateItem(svgs, i, 'viewbox', newValue) }) }
              value={ v.viewbox }
            />
          </div>
          <div className="col-xs-12">
            <TextareaControl
              label="Paths"
              name={ `svg[${i}][path]` }
              onChange={ newValue => setState({ svgs: updateItem(svgs, i, 'path', newValue) }) }
              value={ v.path }
            />
          </div>
        </div>
      )
    }
  </div>
))

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

function init() {
  const svgList = document.querySelector('.svg-options')
  if (svgList) {
    ReactDOM.render(
      <SVGOptions />,
      svgList
    )
  }
}

export { init }
