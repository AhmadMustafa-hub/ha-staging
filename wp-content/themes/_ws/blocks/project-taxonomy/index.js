/* global React, wp */
import { projecttaxPrev } from "./preview/index.js";
import ProjectPicker from "Components/project-picker.js";
const { InnerBlocks, InspectorControls } = wp.blockEditor;
const { createBlock } = wp.blocks;
const { PanelBody, ToggleControl } = wp.components;
const { useDispatch, useSelect } = wp.data;
const { useEffect } = wp.element;
const { __ } = wp.i18n;

export const projectTax = {
  name: "ws/project-taxonomy",
  args: {
    title: __("Project taxonomy", "_ws"),
    description: __(
      "This block will be sticky on the right side of the screen the position in admin area doesn't matter",
      "_ws"
    ),
    icon: "screenoptions",
    category: "ws-dynamic",
    supports: {
      anchor: true,
    },
    attributes: {
      ids: {
        type: "array",
        default: [],
      },
      horizontalScroll: {
        type: "boolean",
      },
    },
    edit: (props) => {
      const { setAttributes } = props;
      const { className, horizontalScroll } = props.attributes;
      const { insertBlock } = useDispatch("core/block-editor");
      const { blockCount, getBlocks } = useSelect((select) => ({
        blockCount: select("core/block-editor").getBlockOrder(props.clientId)
          .length,
        getBlocks: select("core/block-editor").getBlocks,
      }));
      useEffect(() => {
        setAttributes({
          ids: getBlocks(props.clientId).map((block) => block.attributes.id),
        });
      }, [blockCount]);
      return (
        <>
          <InspectorControls>
            <PanelBody title={__("Select Content Options", "_ws")}>
              <ToggleControl
                label={__(
                  "Horizontal scroll on mobile (only works for cards)",
                  "_ws"
                )}
                onChange={(newValue) =>
                  setAttributes({ horizontalScroll: newValue })
                }
                checked={horizontalScroll}
              />
            </PanelBody>
          </InspectorControls>
          <div className={`block-row preview-row ${className || ""}`}>
            <InnerBlocks
              allowedBlocks={["ws/project-taxonomy-preview"]}
              templateLock={false}
              renderAppender={() => (
                <ProjectPicker
                  postTypes={["project"]}
                  onChange={(newValue) => {
                    newValue.forEach((id) => {
                      insertBlock(
                        createBlock("ws/project-taxonomy-preview", { id: id }),
                        blockCount,
                        props.clientId
                      );
                    });
                  }}
                />
              )}
            />
          </div>
        </>
      );
    },
    save: (props) => {
      return <InnerBlocks.Content />;
    },
  },
  innerBlocks: [projecttaxPrev],
};
