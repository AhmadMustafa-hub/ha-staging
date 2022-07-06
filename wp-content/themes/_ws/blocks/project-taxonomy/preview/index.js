/* global React, wp */
import ProjectTax from "Components/project-taxonomy.js";
const { __ } = wp.i18n;

export const projecttaxPrev = {
  name: "ws/project-taxonomy-preview",
  args: {
    title: __("Project Preview", "_ws"),
    icon: "format-aside",
    category: "ws-dynamic",
    supports: {
      customClassName: false,
      html: false,
    },
    parent: ["ws/project-taxonomy"],
    attributes: {
      id: {
        type: "number",
      },
    },
    edit: (props) => {
      const { id } = props.attributes;
      return <ProjectTax id={id} />;
    },
    save: (props) => {
      return null;
    },
  },
};
