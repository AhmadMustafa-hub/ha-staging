/* global React, wp */
const { Button, Notice } = wp.components
const { useSelect } = wp.data
const { PluginPostStatusInfo } = wp.editPost
const { useState } = wp.element
const { __ } = wp.i18n

export const seoPostStatusInfo = {
  name: 'ws-seo-post-status-info',
  args: {
    render: () => {
      const [expanded, setExpanded] = useState(true)
      const { postType, meta, title, excerpt, content } = useSelect(select => ({
        postType: select('core/editor').getCurrentPostType(),
        meta: select('core/editor').getEditedPostAttribute('meta'),
        title: select('core/editor').getEditedPostAttribute('title'),
        excerpt: select('core/editor').getEditedPostAttribute('excerpt'),
        content: select('core/editor').getEditedPostContent()
      }))

      // Prevent reusable block editor from crashing
      if (!meta) {
        return null
      }

      let errors = []
      let warnings = []

      checkH1s(postType, meta, title, excerpt, content, warnings, errors)
      checkMetaDescription(postType, meta, title, excerpt, content, warnings, errors)
      checkAnchorText(postType, meta, title, excerpt, content, warnings, errors)
      checkAltText(postType, meta, title, excerpt, content, warnings, errors)

      return (
        <PluginPostStatusInfo
          className="seo-post-status-info"
        >
          <div className="seo-audit">
            <p>{ __('SEO Audit', '_ws') }</p>
            <Button
              isLink
              onClick={ e => {
                setExpanded(!expanded)
              } }
            >
              { expanded ? 'Hide' : 'Show' }
            </Button>
          </div>
          { expanded && (
            <ul>
              { errors.map((error, i) => (
                <li key={ i }>
                  <Notice
                    status="error"
                    isDismissible={ false }
                  >
                    { error }
                  </Notice>
                </li>
              )) }
              { warnings.map((warning, i) => (
                <li key={ i }>
                  <Notice
                    status="warning"
                    isDismissible={ false }
                  >
                    { warning }
                  </Notice>
                </li>
              )) }
            </ul>
          ) }
        </PluginPostStatusInfo>
      )
    }
  }
}

function checkH1s(postType, meta, title, excerpt, content, warnings, errors) {
  let h1s = []
  let matches = null

  // Most post types will use their own template, so they will already have an h1 built-in.
  if (postType !== 'page') {
    h1s.push(title)
  }

  // Check page title blocks
  if (content.match(/<!-- wp:ws\/page-title/g)) {
    const pageTitleRegex = new RegExp(/<!-- wp:ws\/page-title {"heading":"(.+?)"} \/-->/, 'g')
    matches = pageTitleRegex.exec(content)
    if (matches && matches[1]) {
      h1s.push(matches[1])
    }
    else {
      h1s.push(title)
    }
  }

  // Check heading blocks
  const headingRegex = new RegExp(/<h1.*?>(.*?)<\/h1>/, 'g')
  matches = headingRegex.exec(content)
  while (matches != null) {
    if (matches && matches[1]) {
      h1s.push(matches[1])
    }
    matches = headingRegex.exec(content)
  }

  // Push warnings and errors
  if (h1s.length === 0) {
    errors.push(__('Page is missing an h1.', '_ws'))
  }
  if (h1s.length > 1) {
    errors.push(__('Page has multiple h1\'s.', '_ws'))
  }
  if (h1s.length === 1 && h1s[0].length < 20) {
    warnings.push(__('The h1 is short. The ideal h1 length is 20-70 characters.', '_ws'))
  }
  if (h1s.length === 1 && h1s[0].length > 70) {
    warnings.push(__('The h1 is long. The ideal h1 length is 20-70 characters.', '_ws'))
  }
}

function checkMetaDescription(postType, meta, title, excerpt, content, warnings, errors) {
  if (postType !== 'person') {
    if (!meta['_seo_description'] && !excerpt) {
      warnings.push(__('Page is missing meta description.', '_ws'))
    }
  }
}

function checkAnchorText(postType, meta, title, excerpt, content, warnings, errors) {
  let anchors = []
  let matches = null

  // Check anchors
  const anchorRegex = new RegExp(/<a\s.*?>(.*?)<\/a>/, 'g')
  matches = anchorRegex.exec(content)
  while (matches != null) {
    if (matches && matches[1]) {
      anchors.push(matches[1])
    }
    matches = anchorRegex.exec(content)
  }

  // Check buttons
  const buttonTextRegex = new RegExp(/"buttonText":"(.*?)"/, 'g')
  matches = buttonTextRegex.exec(content)
  while (matches != null) {
    if (matches && matches[1]) {
      anchors.push(matches[1])
    }
    matches = buttonTextRegex.exec(content)
  }
  anchors = anchors.filter(anchor => ['click here', 'click this', 'go', 'here', 'this', 'start', 'right here', 'more', 'learn more'].includes(anchor.toLowerCase()))

  // Push warnings
  anchors.forEach(anchor => {
    warnings.push(`${__('Link does not have descriptive text.', '_ws')} (${anchor})`)
  })
}

function checkAltText(postType, meta, title, excerpt, content, warnings, errors) {
  let alts = []
  let matches = null

  const altTextRegex = new RegExp(/<img\s((?![^>]*?alt)|(?![^>]*?alt="[^"]+?")).*?src="(.*?)".*?>/, 'g')
  matches = altTextRegex.exec(content)
  while (matches != null) {
    if (matches && matches[2]) {
      alts.push(matches[2])
    }
    matches = altTextRegex.exec(content)
  }

  // Push warnings
  alts.forEach(alt => {
    warnings.push(`${__('Image does not have alt text.', '_ws')} (${alt})`)
  })
}
