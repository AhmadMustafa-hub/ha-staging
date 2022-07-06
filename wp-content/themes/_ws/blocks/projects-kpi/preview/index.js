/* global React, wp */
import ProjectPreview from "Components/project-preview.js";
const { __ } = wp.i18n;

export const previewProject = {
  name: "ws/preview-project",
  args: {
    title: __("Project Preview", "_ws"),
    icon: "format-aside",
    category: "ws-dynamic",
    supports: {
      customClassName: false,
      html: false,
    },
    parent: ["ws/projects-kpi"],
    attributes: {
      id: {
        type: "number",
      },
    },
    edit: (props) => {
      const { id } = props.attributes;
      return <ProjectPreview id={id} />;
    },
    save: (props) => {
      return null;
    },
  },
};
