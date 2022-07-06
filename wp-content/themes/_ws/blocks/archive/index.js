/* global React, wp, locals */
import CheckboxGroupControl from 'Components/checkbox-group-control.js'
import PostPreview from 'Components/post-preview.js'
import PostTypeControl from 'Components/post-type-control.js'
const { InspectorControls } = wp.blockEditor
const { BaseControl, CheckboxControl, PanelBody, TextControl, ToggleControl } = wp.components
const { useSelect } = wp.data
const { __ } = wp.i18n

export const archive = {
  name: 'ws/archive',
  args: {
    title: __('Archive', '_ws'),
    description: __('List all posts of a chosen type with optional filters. Display for each post type is determined by the theme.', '_ws'),
    icon: 'schedule',
    category: 'ws-dynamic',
    supports: {
      anchor: true,
      multiple: false
    },
    attributes: {
      resourceCenter: {
        type: 'boolean'
      },
      postType: {
        type: 'string',
        default: 'post'
      },
      allPosts: {
        type: 'boolean'
      },
      numPosts: {
        type: 'string',
        default: locals.postsPerPage
      },
      filters: {
        type: 'array',
        default: []
      },
      search: {
        type: 'boolean'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { resourceCenter, postType, allPosts, numPosts, filters, search } = props.attributes
      const { posts, taxonomies, years } = useSelect(select => {
        let tax = select('core').getTaxonomies()
        tax = tax
          ? tax.filter(t => {
            return t.types.includes(postType)
          }).map(t => {
            return {
              ...t,
              terms: select('core').getEntityRecords('taxonomy', t.slug)
            }
          })
          : null
        let filters = { per_page: -1 }
        if (postType === 'event') {
          filters.upcoming = 'all'
        }
        const posts = select('core').getEntityRecords('postType', postType, filters)
        const years = []
        if (posts) {
          posts.forEach(post => {
            const year = post.date.substring(0, 4)
            if (!years.includes(year)) {
              years.push(year)
            }
          })
        }
        return {
          posts: posts,
          taxonomies: tax,
          years: years.sort()
        }
      })
      let filtersList = []
      if (taxonomies && taxonomies.some(v => v.terms && v.terms.length)) {
        filtersList = taxonomies.map(tax => (
          { label: tax.name, value: tax.slug }
        ))
        filtersList.push({ label: 'Year', value: 'year' })
        if (postType === 'event') {
          filtersList.push({ label: 'Past & Upcoming', value: 'timeline' })
        }
      }
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Archive Options', '_ws') }
            >
              <ToggleControl
                label={ __('Resource Center', '_ws') }
                onChange={ newValue => setAttributes({ resourceCenter: newValue }) }
                checked={ resourceCenter }
              />
              { !resourceCenter && (
                <PostTypeControl
                  label={ __('Post Type', '_ws') }
                  onChange={ newValue => setAttributes({ postType: newValue, filters: [] }) }
                  value={ postType }
                />
              ) }
              <ToggleControl
                label={ __('Show All Posts', '_ws') }
                onChange={ newValue => setAttributes({ allPosts: newValue }) }
                checked={ allPosts }
              />
              { !allPosts && (
                <TextControl
                  label={ __('Posts Per Page', '_ws') }
                  help={ `Default: ${locals.postsPerPage}` }
                  min="1"
                  max="99"
                  type="number"
                  onChange={ newValue => setAttributes({ numPosts: newValue }) }
                  value={ numPosts }
                />
              ) }
              { filtersList.length > 0 && (
                <CheckboxGroupControl
                  legend={ __('Filters', '_ws') }
                  options={ filtersList }
                  onChange={ newValue => setAttributes({ filters: newValue }) }
                  value={ filters }
                />
              ) }
              <BaseControl
                label={ __('Search', '_ws') }
              >
                <CheckboxControl
                  label={ __('Search', '_ws') }
                  checked={ search }
                  onChange={ newValue => setAttributes({ search: newValue }) }
                />
              </BaseControl>
            </PanelBody>
          </InspectorControls>
          <div className="archive-filters">
            { filters && filters.length > 0 && (
              filters.map(filter => {
                if (filter === 'year') {
                  return (
                    <div className="archive-filter">
                      <span>{ __('Year', '_ws') }</span>
                      <ul>
                        { years.map(v => {
                          return (
                            <li key={ v }>{ v }</li>
                          )
                        }) }
                      </ul>
                    </div>
                  )
                }
                if (filter === 'timeline') {
                  return (
                    <div className="archive-filter">
                      <span>{ __('Past & Upcoming', '_ws') }</span>
                      <ul>
                        <li>{ __('Upcoming', '_ws') }</li>
                        <li>{ __('Past', '_ws') }</li>
                      </ul>
                    </div>
                  )
                }
                if (taxonomies) {
                  return taxonomies.map(tax => {
                    if (tax.slug === filter) {
                      return (
                        <div className="archive-filter">
                          <span>{ tax.name }</span>
                          <ul>
                            { tax.terms && tax.terms.map(term => {
                              return (
                                <li key={ term.id }>{ term.name }</li>
                              )
                            }) }
                          </ul>
                        </div>
                      )
                    }
                  })
                }
              })
            ) }
            { search && (<div className="archive-search">Search</div>) }
          </div>
          <div className={ `sortable-container archive-posts` }>
            { posts && posts.map((v, i) => {
              if (i < 4) {
                return (
                  <div key={ v.id } className="col-sm-6 sortable-item">
                    <div className="card">
                      <PostPreview id={ v.id } />
                    </div>
                  </div>
                )
              }
            }) }
          </div>
          { posts && posts.length === 0 ? (<small className="no-posts">No posts of type <i>{ postType }</i> found.</small>) : '' }
          { posts && posts.length > 4 ? (<p className="no-posts">And { posts.length - 4 } others</p>) : '' }
        </>
      )
    },
    save: props => {
      return null
    }
  }
}
