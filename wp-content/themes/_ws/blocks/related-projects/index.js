/* global React, wp */
import CheckboxGroupControl from "Components/checkbox-group-control";
import PostPreview from "Components/post-preview.js";
import PostTypeControl from "Components/post-type-control.js";
const { PanelBody, RangeControl, ToggleControl } = wp.components;
const { useSelect } = wp.data;
const { InspectorControls } = wp.blockEditor;
const { __ } = wp.i18n;

export const relatedProjects = {
  name: "ws/related-projects",
  args: {
    title: __("Related Projects", "_ws"),
    description: __("Related Projects test block", "_ws"),
    icon: "warning",
    category: "ws-dynamic",
    supports: {
      anchor: true,
    },
    attributes: {
      postType: {
        type: "string",
        default: "project",
      },
      taxTerms: {
        type: "object",
        default: {},
      },
      allPosts: {
        type: "boolean",
      },
      numPosts: {
        type: "number",
        default: 5,
      },
      horizontalScroll: {
        type: "boolean",
      },
    },
    edit: (props) => {
      const { setAttributes } = props;
      const {
        className,
        postType,
        taxTerms,
        allPosts,
        numPosts,
        horizontalScroll,
      } = props.attributes;
      const { taxonomies, posts } = useSelect(
        (select) => {
          let taxonomies = select("core").getTaxonomies();
          if (taxonomies) {
            taxonomies = taxonomies
              .filter((t) => {
                return t.types.includes(postType);
              })
              .map((t) => {
                const terms =
                  select("core").getEntityRecords("taxonomy", t.slug, {
                    per_page: -1,
                  }) || [];
                const childTerms = [];
                const parentTerms = terms.filter((term) => {
                  if (term.parent === 0) {
                    term.children = [];
                    return true;
                  }
                  childTerms.push(term);
                  return false;
                });
                childTerms.forEach((child) => {
                  const parentIndex = parentTerms.findIndex(
                    (term) => term.id === child.parent
                  );
                  parentTerms[parentIndex].children.push(child);
                });
                return {
                  ...t,
                  terms: parentTerms,
                };
              });
          }
          let filters = { per_page: numPosts, tax_relation: "AND" };
          for (const tax in taxTerms) {
            const filtersKey =
              tax === "category" ? "categories" : tax === "tag" ? "tags" : tax;
            filters[filtersKey] = taxTerms[tax];
          }
          const posts = select("core").getEntityRecords(
            "postType",
            postType,
            filters
          );
          return {
            taxonomies: taxonomies,
            posts: posts,
          };
        },
        [postType, taxTerms]
      );
      return (
        <>
          <InspectorControls>
            <PanelBody title={__("Related Projects Options", "_ws")}>
              <ToggleControl
                label={__("Show All Posts On Frontend", "_ws")}
                onChange={(newValue) => setAttributes({ allPosts: newValue })}
                checked={allPosts}
              />
              {!allPosts && (
                <RangeControl
                  label={__("Number of Posts", "_ws")}
                  min="1"
                  max="8"
                  onChange={(newValue) => setAttributes({ numPosts: newValue })}
                  value={numPosts}
                />
              )}
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
          <h3 className="left-heading">Related Projects</h3>
          <h3 className="view-all">View All</h3>
          <div
            className={`preview-row slider is-style-cards ${className || ""}`}
          >
            {posts &&
              posts.map((v, i) => {
                if (i < 4) {
                  return (
                    <div className="col slide" key={v.id}>
                      <PostPreview id={v.id} />
                    </div>
                  );
                }
              })}
          </div>
          {posts && posts.length === 0 ? (
            <small className="no-posts">
              {__("No posts found with current filters.", "_ws")}
            </small>
          ) : (
            ""
          )}
        </>
      );
    },
    save: (props) => {
      return null;
    },
  },
};
