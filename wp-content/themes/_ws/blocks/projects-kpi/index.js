/* global React, wp */
import { previewProject } from "./preview/index.js";
import ProjectPicker from "Components/project-picker.js";
const { InnerBlocks, InspectorControls } = wp.blockEditor;
const { createBlock } = wp.blocks;
const { PanelBody, ToggleControl } = wp.components;
const { useDispatch, useSelect } = wp.data;
const { useEffect } = wp.element;
const { __ } = wp.i18n;

export const projectsKPI = {
  name: "ws/projects-kpi",
  args: {
    title: __("Projects Kpi", "_ws"),
    description: __(
      "Highlight hand-picked content unrelated to post date or taxonomy.",
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
              allowedBlocks={["ws/preview-project"]}
              templateLock={false}
              renderAppender={() => (
                <ProjectPicker
                  postTypes={["project"]}
                  onChange={(newValue) => {
                    newValue.forEach((id) => {
                      insertBlock(
                        createBlock("ws/preview-project", { id: id }),
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
  innerBlocks: [previewProject],
};
