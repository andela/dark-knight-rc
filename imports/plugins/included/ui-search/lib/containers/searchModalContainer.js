import React, { Component } from "react";
import { compose } from "recompose";
import _ from "lodash";
import { Reaction } from "/client/api";
import { registerComponent } from "@reactioncommerce/reaction-components";
import SearchSubscription from "./searchSubscription";

function tagToggle(arr, val) {
  if (arr.length === _.pull(arr, val).length) {
    arr.push(val);
  }
  return arr;
}

const wrapComponent = (Comp) => (
  class SearchModalContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        collection: "products",
        value: localStorage.getItem("searchValue") || "",
        renderChild: true,
        facets: [],
        priceQuery: "0 - 10000",
        vendorQuery: "",
        sortQuery: {},
        sortValue: ""
      };
    }

    componentDidMount() {
      document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        this.setState({
          renderChild: false
        });
      }
    }

    handleChange = (event, value) => {
      localStorage.setItem("searchValue", value);

      this.setState({ value });
    }

    handleClick = () => {
      localStorage.setItem("searchValue", "");
      this.setState({ value: "" });
    }

    handleAccountClick = (event) => {
      Reaction.Router.go("account/profile", {}, { userId: event._id });
      this.handleChildUnmount();
    }

    handleTagClick = (tagId) => {
      const newFacet = tagId;
      const element = document.getElementById(tagId);
      element.classList.toggle("active-tag");

      this.setState({
        facets: tagToggle(this.state.facets, newFacet)
      });
    }

    handleToggle = (collection) => {
      this.setState({ collection });
    }

    handlePriceSelect = (event) => {
      this.setState({ priceQuery: event.target.value });
    };

    handleVendorSelect = (event) => {
      this.setState({ vendorQuery: event.target.value });
    }

    handleSortSelect = (event) => {
      switch (event.target.value) {
        case "newest":
          this.setState({ sortQuery: { createdAt: - 1 } });
          break;

        case "oldest":
          this.setState({ sortQuery: { createdAt: 1 } });
          break;

        case "price":
          this.setState({ sortQuery: { price: -1 } });
          break;

        case "highest rating":
          this.setState({ sortQuery: { averageRating: - 1 } });
          break;

        case "least rating":
          this.setState({ sortQuery: { averageRating: 1 } });
          break;

        default:
          this.setState({ sortQuery: { averageRating: - 1 } });
          break;
      }

      this.setState({ sortValue: event.target.value });
    }

    handleChildUnmount = () =>  {
      this.setState({ renderChild: false });
    }

    render() {
      return (
        <div>
          {this.state.renderChild ?
            <div className="rui search-modal js-search-modal">
              <Comp
                handleChange={this.handleChange}
                handlePriceSelect={this.handlePriceSelect}
                handleVendorSelect={this.handleVendorSelect}
                handleSortSelect={this.handleSortSelect}
                handleClick={this.handleClick}
                handleToggle={this.handleToggle}
                handleAccountClick={this.handleAccountClick}
                handleTagClick={this.handleTagClick}
                value={this.state.value}
                priceQuery={this.state.priceQuery}
                vendorQuery={this.state.vendorQuery}
                sortQuery={this.state.sortQuery}
                sortValue={this.state.sortValue}
                unmountMe={this.handleChildUnmount}
                searchCollection={this.state.collection}
                facets={this.state.facets}
              />
            </div> : null
          }
        </div>
      );
    }
  }
);

registerComponent("SearchSubscription", SearchSubscription, [ wrapComponent ]);

export default compose(wrapComponent)(SearchSubscription);
