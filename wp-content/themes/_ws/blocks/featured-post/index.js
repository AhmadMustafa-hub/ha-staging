/* global React, wp */
import PostPicker from 'Components/post-picker.js'
const apiFetch = wp.apiFetch
const { BlockControls } = wp.blockEditor
const { Button, Placeholder, ToolbarGroup } = wp.components
const { useEffect, useState } = wp.element
const { __ } = wp.i18n

export const featuredPost = {
  name: 'ws/featured-post',
  args: {
    title: __('Featured Post', '_ws'),
    description: __('Highlight a specific piece of content. Typically used before an Archive block.', '_ws'),
    icon: 'star-filled',
    category: 'ws-dynamic',
    supports: {
      anchor: true
    },
    attributes: {
      postId: {
        type: 'number'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { postId } = props.attributes
      const [post, setPost] = useState(null)
      useEffect(() => {
        if (postId) {
          apiFetch({ path: `/ws/all?include=${postId}` })
            .then(res => {
              setPost(res[0] === undefined ? 'error' : res[0])
            })
            .catch(err => {
              setPost(null)
              console.error('error', err)
            })
        }
      }, [postId])
      return (
        <>
          { post ? (
            <>
              <BlockControls>
                <ToolbarGroup>
                  <Button
                    className="components-toolbar__control"
                    label={ __('Remove Post', '_ws') }
                    icon="trash"
                    onClick={ () => setPost(null) }
                  />
                </ToolbarGroup>
              </BlockControls>
              <div className="post-block">
                { post === 'error' ? (
                  <>
                    <div className="placeholder"></div>
                    <p>Post Removed</p>
                  </>
                ) : (
                  <>
                    { post.thumbnail ? (
                      <img src={ post.thumbnail } alt="Featured Image" />
                    ) : (
                      <div className="placeholder-image">
                        <img src="/wp-content/themes/_ws/logo_light.svg" alt="Haley Aldrich" />
                      </div>
                    ) }
                    <div>
                      <h3>{ post.post_title }</h3>
                      <p dangerouslySetInnerHTML={ { __html: post.post_excerpt } }></p>
                    </div>
                  </>
                ) }
              </div>
            </>
          ) : (
            <Placeholder
              icon="admin-format-aside"
              label={ __('Post', '_ws') }
              instructions={ __('Select a post to highlight.', '_ws') }
            >
              <PostPicker
                buttonText={ __('Select Post', '_ws') }
                single
                onChange={ newValue => setAttributes({ postId: newValue[0] }) }
                value={ postId }
              />
            </Placeholder>
          ) }
        </>
      )
    },
    save: props => {
      return null
    }
  },
  styles: [
    {
      name: 'default',
      label: __('Default', '_ws'),
      isDefault: true
    },
    {
      name: 'dark',
      label: __('Dark', '_ws')
    }
  ]
}
