/* globals React, wp */
import * as theme from 'Theme'
import CheckboxGroupControl from 'Components/checkbox-group-control.js'
import GradientPicker from 'Components/gradient-picker.js'
import MediaSelect from 'Components/media-select.js'
const { ColorPalette, getColorObjectByColorValue, InspectorControls } = wp.blockEditor
const { hasBlockSupport } = wp.blocks
const { BaseControl, ColorIndicator, PanelBody, SelectControl, ToggleControl } = wp.components
const { createHigherOrderComponent } = wp.compose
const { useSelect } = wp.data
const { useEffect, useState } = wp.element
const { __ } = wp.i18n

function backgroundClasses(props, colors) {
  const {
    textColor,
    backgroundShape,
    backgroundColor,
    backgroundGradient,
    backgroundMedia,
    backgroundSize
  } = props.attributes
  const textColorObject = textColor ? getColorObjectByColorValue(colors, textColor) : null
  const backgroundColorObject = backgroundColor ? getColorObjectByColorValue(colors, backgroundColor) : null
  const classes = ['ws-block-container']
  if (textColor) {
    classes.push('has-text-color')
  }
  if (textColorObject) {
    classes.push(`has-${textColorObject.slug}-color`)
  }
  if (backgroundColor || backgroundGradient || backgroundMedia) {
    classes.push('has-background')
  }
  if (backgroundShape) {
    classes.push(`has-${backgroundShape}-background-shape`)
  }
  if (backgroundColorObject) {
    classes.push(`has-${backgroundColorObject.slug}-background-color`)
  }
  if (backgroundGradient) {
    classes.push(`has-${backgroundGradient}-background-gradient`)
  }
  if (backgroundSize) {
    classes.push(`has-background-size-${backgroundSize}`)
  }
  return classes.join(' ')
}

export const backgroundControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-background-controls',
  func: createHigherOrderComponent(BlockEdit => {
    return props => {
      if (!props.name.startsWith('ws/')) {
        return <BlockEdit { ...props } />
      }
      if (props.name.startsWith('ws/meta-')) {
        return (
          <div
            className={ `ws-block-container has-background` }
          >
            <BlockEdit { ...props } />
          </div>
        )
      }
      const shapes = [
        { label: 'Default', value: '' },
        { label: 'Rectangle Left', value: 'rectangle-left' },
        { label: 'Rectangle Right', value: 'rectangle-right' }
      ]
      const gradients = theme.global.gradients
      const { setAttributes } = props
      const {
        textColor,
        backgroundShape,
        backgroundColor,
        backgroundGradient,
        backgroundGeometric,
        backgroundMedia,
        backgroundVideoPoster,
        backgroundX,
        backgroundY,
        backgroundSize,
        backgroundOverlay,
        backgroundParallax
      } = props.attributes
      const { colors } = useSelect(select => ({
        colors: select('core/editor').getEditorSettings().colors || null
      }))
      const [mediaObject, setMediaObject] = useState(null)
      useEffect(() => {
        if (backgroundMedia) {
          wp.media.attachment(backgroundMedia).fetch()
            .then(data => {
              setMediaObject(wp.media.attachment(backgroundMedia).attributes)
            }, err => {
              console.error(err)
              setMediaObject(null)
            })
        }
        else {
          setMediaObject(null)
        }
      }, [backgroundMedia])
      const supportsBackground = hasBlockSupport(props.name, 'background')
      const supportsTextColor = hasBlockSupport(props.name, 'textColor')
      return (
        <>
          <div
            className={ backgroundClasses(props, colors) }
            style={ { color: !getColorObjectByColorValue(colors, textColor) ? textColor : '' } }
          >
            { supportsBackground && (
              <div
                className="background-container"
                style={ { backgroundColor: !getColorObjectByColorValue(colors, backgroundColor) ? backgroundColor : '' } }
              >
                <div
                  className={ `background-image ${backgroundOverlay ? 'has-background-overlay' : ''} ${backgroundParallax ? 'parallax-bg' : ''}` }
                  style={ {
                    backgroundImage: mediaObject && mediaObject.url ? `url(${mediaObject.url})` : '',
                    backgroundPosition: backgroundX && backgroundY ? `${backgroundX * 100}% ${backgroundY * 100}%` : ''
                  } }
                ></div>
              </div>
            ) }
            <BlockEdit { ...props } />
          </div>
          { (supportsBackground || supportsTextColor) && (
            <InspectorControls>
              <PanelBody
                title={ __('Background & Text Settings', '_ws') }
              >
                { supportsTextColor && (
                  <BaseControl
                    label={ (
                      <>
                        { __('Text Color', '_ws') }
                        { textColor && (
                          <ColorIndicator colorValue={ textColor } />
                        ) }
                      </>
                    ) }
                  >
                    <ColorPalette
                      className="block-editor-color-palette-control__color-palette"
                      onChange={ newValue => setAttributes({ textColor: newValue }) }
                      value={ textColor }
                    />
                  </BaseControl>
                ) }
                { supportsBackground && (
                  <>
                    { !!shapes.length && (
                      <SelectControl
                        label={ __('Background Shape', '_ws') }
                        options={ shapes }
                        onChange={ newValue => setAttributes({ backgroundShape: newValue }) }
                        value={ backgroundShape }
                      />
                    ) }
                    <BaseControl
                      label={ (
                        <>
                          { __('Background Color', '_ws') }
                          { backgroundColor && (
                            <ColorIndicator colorValue={ backgroundColor } />
                          ) }
                        </>
                      ) }
                    >
                      <ColorPalette
                        className="block-editor-color-palette-control__color-palette"
                        onChange={ newValue => setAttributes({ backgroundColor: newValue }) }
                        value={ backgroundColor }
                      />
                    </BaseControl>
                    { !!gradients.length && (
                      <GradientPicker
                        label={ __('Background Gradient', '_ws') }
                        gradients={ gradients }
                        onChange={ newValue => setAttributes({ backgroundGradient: newValue }) }
                        value={ backgroundGradient }
                      />
                    ) }
                    <CheckboxGroupControl
                      legend={ __('Geometric Shape', '_ws') }
                      options={ [
                        { label: 'Top Left', value: 'top-left' },
                        { label: 'Top Right', value: 'top-right' },
                        { label: 'Bottom Left', value: 'bottom-left' },
                        { label: 'Bottom Right', value: 'bottom-right' }
                      ] }
                      onChange={ newValue => setAttributes({ backgroundGeometric: newValue }) }
                      value={ backgroundGeometric }
                    />
                    <MediaSelect
                      label={ __('Background Image/Video', '_ws') }
                      buttonText={ __('Select Background Image/Video', '_ws') }
                      onChange={ ({ id, focalPoint, posterImage }) => setAttributes({
                        backgroundMedia: id,
                        backgroundX: focalPoint && focalPoint.x ? focalPoint.x : null,
                        backgroundY: focalPoint && focalPoint.y ? focalPoint.y : null,
                        backgroundVideoPoster: posterImage
                      }) }
                      id={ backgroundMedia }
                      focalPoint={ {
                        x: backgroundX,
                        y: backgroundY
                      } }
                      posterImage={ backgroundVideoPoster }
                    />
                    { backgroundMedia && (
                      <>
                        <SelectControl
                          label={ __('Image/Video Position', '_ws') }
                          options={ [
                            { label: 'Cover', value: 'cover' },
                            { label: 'Left Half', value: 'left-half' },
                            { label: 'Right Half', value: 'right-half' }
                          ] }
                          onChange={ newValue => setAttributes({ backgroundSize: newValue }) }
                          value={ backgroundSize }
                        />
                        <ToggleControl
                          label={ __('Overlay', '_ws') }
                          onChange={ newValue => setAttributes({ backgroundOverlay: newValue }) }
                          checked={ backgroundOverlay }
                        />
                        <ToggleControl
                          label={ __('Parallax', '_ws') }
                          onChange={ newValue => setAttributes({ backgroundParallax: newValue }) }
                          checked={ backgroundParallax }
                        />
                      </>
                    ) }
                  </>
                ) }
              </PanelBody>
            </InspectorControls>
          ) }
        </>
      )
    }
  }, 'withBackgroundControls')
}

export const backgroundAttributes = {
  hook: 'blocks.registerBlockType',
  name: 'ws/with-background-attributes',
  func: (props, name) => {
    if (!name.startsWith('ws/') || name.startsWith('ws/meta-') || name.startsWith('ws/calculator-')) {
      return props
    }
    props.attributes = {
      ...props.attributes,
      anchor: {
        type: 'string'
      },
      textColor: {
        type: 'string'
      },
      backgroundShape: {
        type: 'string'
      },
      backgroundColor: {
        type: 'string'
      },
      backgroundGradient: {
        type: 'string'
      },
      backgroundGeometric: {
        type: 'array',
        default: []
      },
      backgroundMedia: {
        type: 'number'
      },
      backgroundVideoPoster: {
        type: 'number'
      },
      backgroundX: {
        type: 'string',
        default: '0.5'
      },
      backgroundY: {
        type: 'string',
        default: '0.5'
      },
      backgroundSize: {
        type: 'string'
      },
      backgroundOverlay: {
        type: 'boolean'
      },
      backgroundParallax: {
        type: 'boolean'
      }
    }
    return props
  }
}
