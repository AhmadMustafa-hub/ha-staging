/* global React, wp */
import MediaSelect from 'Components/media-select.js'
import PostPicker from 'Components/post-picker.js'
const apiFetch = wp.apiFetch
const { BlockControls } = wp.blockEditor
const { Button, Placeholder, TextControl, ToolbarGroup } = wp.components
const { useEffect, useState } = wp.element
const { __ } = wp.i18n

export const person = {
  name: 'ws/person',
  args: {
    title: __('Person', '_ws'),
    description: __('Featured a person with links to bio and social media', '_ws'),
    icon: 'admin-users',
    category: 'ws-dynamic',
    supports: {
      anchor: true
    },
    attributes: {
      personType: {
        type: 'string'
      },
      personId: {
        type: 'number'
      },
      personImage: {
        type: 'number'
      },
      personName: {
        type: 'string'
      },
      personTitle: {
        type: 'string'
      },
      personEmail: {
        type: 'string'
      },
      personTwitter: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { personType, personId, personImage, personName, personTitle, personEmail, personTwitter } = props.attributes
      const [person, setPerson] = useState(null)
      useEffect(() => {
        if (personId) {
          apiFetch({ path: `/ws/all?include=${personId}` })
            .then(res => {
              setPerson(res[0] === undefined ? 'error' : res[0])
            })
            .catch(err => {
              setPerson(null)
              console.error('error', err)
            })
        }
        else {
          setPerson(null)
        }
      }, [personId])
      return (
        <>
          { (personType === 'team' && person) || personType === 'custom' ? (
            <>
              <BlockControls>
                <ToolbarGroup>
                  <Button
                    className="components-toolbar__control"
                    label={ __('Remove Person', '_ws') }
                    icon="trash"
                    onClick={ () => setAttributes({ personType: '', personId: 0 }) }
                  />
                </ToolbarGroup>
              </BlockControls>
              <div className="person-block">
                { personType === 'team' && (
                  <>
                    { person === 'error' ? (
                      <>
                        <div className="placeholder"></div>
                        <div className="info">
                          <p>Person Removed</p>
                        </div>
                      </>
                    ) : (
                      <>
                        { person.thumbnail ? (
                          <img src={ person.thumbnail } alt="Profile Image" />
                        ) : (
                          <div className="placeholder"></div>
                        ) }
                        <div className="info">
                          <p>{ person.post_title }</p>
                        </div>
                      </>
                    ) }
                  </>
                ) }
                { personType === 'custom' && (
                  <>
                    <MediaSelect
                      size="thumbnail"
                      onChange={ ({ id }) => setAttributes({ personImage: id }) }
                      id={ personImage }
                    />
                    <div className="info">
                      <TextControl
                        label={ __('Name', '_ws') }
                        onChange={ newValue => setAttributes({ personName: newValue }) }
                        value={ personName }
                      />
                      <TextControl
                        label={ __('Title', '_ws') }
                        onChange={ newValue => setAttributes({ personTitle: newValue }) }
                        value={ personTitle }
                      />
                      <div className="row">
                        <div className="col-xs-6">
                          <TextControl
                            label={ __('Email', '_ws') }
                            onChange={ newValue => setAttributes({ personEmail: newValue }) }
                            value={ personEmail }
                          />
                        </div>
                        <div className="col-xs-6">
                          <TextControl
                            label={ __('Twitter', '_ws') }
                            onChange={ newValue => setAttributes({ personTwitter: newValue }) }
                            value={ personTwitter }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) }
              </div>
            </>
          ) : (
            <Placeholder
              icon="admin-users"
              label={ __('Person', '_ws') }
              instructions={ __('Select a person to highlight.', '_ws') }
            >
              <PostPicker
                buttonText={ __('Select Person', '_ws') }
                postTypes={ ['person'] }
                single
                onChange={ newValue => setAttributes({ personType: 'team', personId: newValue[0] }) }
                value={ personId }
              />
              <Button
                isSecondary
                onClick={ () => setAttributes({ personType: 'custom' }) }
              >
                { __('Create Person', '_ws') }
              </Button>
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
