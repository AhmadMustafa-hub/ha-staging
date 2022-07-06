/* globals React, wp */
const apiFetch = wp.apiFetch;
const { Button, Modal, RadioControl, TextControl, CheckboxControl } =
  wp.components;
const { Component } = wp.element;
const { __ } = wp.i18n;

export default class ProjectPicker extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      postSelectorVisible: false,
      selection: [],
      filter: "",
      postType: "",
      postList: [],
      postTypes: [],
    };
  }

  componentDidMount() {
    apiFetch({ path: `/wp/v2/types` })
      .then((res) => {
        res = Object.values(res);
        this.setState({
          postTypes: res.filter((v) => {
            if (Array.isArray(this.props.postTypes)) {
              return this.props.postTypes.includes(v.slug);
            }
            return (
              v.slug !== "attachment" &&
              v.slug !== "wp_block" &&
              v.slug !== "wp_area"
            );
          }),
        });
        if (
          Array.isArray(this.props.postTypes) &&
          this.props.postTypes.length === 1
        ) {
          this.setState({ postType: this.props.postTypes[0] });
          this.getPostList(this.state.postType);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getPostList(type) {
    apiFetch({ path: `/ws/all?post_type=${type}` })
      .then((res) => {
        this.setState({ postList: res });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const {
      postSelectorVisible,
      selection,
      filter,
      postType,
      postList,
      postTypes,
    } = this.state;
    const { className, buttonText, single } = this.props;
    return (
      <>
        <Button
          isSecondary
          className={className}
          onClick={() => this.setState({ postSelectorVisible: true })}
        >
          {buttonText || __("Add Project", "_ws")}
        </Button>
        {postSelectorVisible && (
          <Modal
            title={__("Select Project", "_ws")}
            onRequestClose={() =>
              this.setState({
                postSelectorVisible: false,
                selection: [],
                filter: "",
              })
            }
          >
            <div className="post-selector">
              {!!postTypes.length && (
                <div className="button-list post-type-list">
                  <RadioControl
                    label={__("Post Type", "_ws")}
                    selected={postType}
                    options={postTypes.map((v) => {
                      return {
                        label: v.name,
                        value: v.slug,
                      };
                    })}
                    onChange={(newValue) => {
                      this.setState({ postType: newValue });
                      this.getPostList(newValue);
                    }}
                  />
                </div>
              )}
              <div className="button-list post-list">
                <fieldset>
                  {!!postTypes.length && <legend>{__("Posts", "_ws")}</legend>}
                  <TextControl
                    aria-label={__("Filter", "_ws")}
                    className="post-filter"
                    placeholder="Filter..."
                    onChange={(newValue) => this.setState({ filter: newValue })}
                    value={filter}
                  />
                  {postList &&
                    postList.map((v) => {
                      return (
                        <RadioControl
                          //   value={v.ID}
                          //   label={v.post_title}
                          //   className={`checkbox ${
                          //     !v.post_title
                          //       .toUpperCase()
                          //       .includes(filter.toUpperCase())
                          //       ? "hide"
                          //       : ""
                          //   }`}
                          checked={selection.includes(v.ID)}
                          options={[{ value: v.ID, label: v.post_title }]}
                          onChange={(newValue) => {
                            if (newValue) {
                              this.setState({ selection: [v.ID] });
                            } else {
                              this.setState({ selection: [] });
                            }
                          }}
                        />
                      );
                    })}
                </fieldset>
              </div>
            </div>
            <div className="modal-buttons">
              <Button
                isPrimary
                disabled={!selection.length}
                onClick={(newValue) => {
                  this.props.onChange([...selection]);
                  this.setState({
                    postSelectorVisible: false,
                    selection: [],
                    filter: "",
                  });
                }}
              >
                {__("Select Project", "_ws")}
              </Button>
            </div>
          </Modal>
        )}
      </>
    );
  }
}
