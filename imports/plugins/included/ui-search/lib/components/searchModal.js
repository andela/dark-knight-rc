import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import { ProductSearch } from "/lib/collections";
import { TextField, Button, IconButton, SortableTableLegacy } from "@reactioncommerce/reaction-ui";
import ProductGridContainer from "/imports/plugins/included/product-variant/containers/productGridContainer";
import { accountsTable } from "../helpers";

class SearchModal extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    handleAccountClick: PropTypes.func,
    handleChange: PropTypes.func,
    handleClick: PropTypes.func,
    handlePriceSelect: PropTypes.func,
    handleSortSelect: PropTypes.func,
    handleTagClick: PropTypes.func,
    handleToggle: PropTypes.func,
    handleVendorSelect: PropTypes.func,
    priceQuery: PropTypes.string,
    products: PropTypes.array,
    siteName: PropTypes.string,
    sortQuery: PropTypes.object,
    sortValue: PropTypes.string,
    tags: PropTypes.array,
    unmountMe: PropTypes.func,
    value: PropTypes.string,
    vendorQuery: PropTypes.string
  }

  renderSearchInput() {
    return (
      <div className="rui search-modal-input">
        <label data-i18n="search.searchInputLabel">Search {this.props.siteName}</label>
        <i className="fa fa-search search-icon" />
        <TextField
          className="search-input"
          textFieldStyle={{ marginBottom: 0 }}
          onChange={this.props.handleChange}
          value={this.props.value}
        />
        <Button
          className="search-clear"
          i18nKeyLabel="search.clearSearch"
          label="Clear"
          containerStyle={{ fontWeight: "normal" }}
          onClick={this.props.handleClick}
        />
      </div>
    );
  }

  renderSearchTypeToggle() {
    if (Reaction.hasPermission("admin")) {
      return (
        <div className="rui search-type-toggle">
          <div
            className="search-type-option search-type-active"
            data-i18n="search.searchTypeProducts"
            data-event-action="searchCollection"
            data-event-value="products"
            onClick={() => this.props.handleToggle("products")}
          >
            Products
          </div>
          {Reaction.hasPermission("accounts") &&
            <div
              className="search-type-option"
              data-i18n="search.searchTypeAccounts"
              data-event-action="searchCollection"
              data-event-value="accounts"
              onClick={() => this.props.handleToggle("accounts")}
            >
              Accounts
            </div>
          }
        </div>
      );
    }
  }

  renderProductSearchTags() {
    return (
      <div className="rui search-modal-tags-container">
        <p className="rui suggested-tags" data-i18n="search.suggestedTags">Suggested tags</p>
        <div className="rui search-tags">
          {this.props.tags.map((tag) => (
            <span
              className="rui search-tag"
              id={tag._id} key={tag._id}
              onClick={() => this.props.handleTagClick(tag._id)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  renderSortFilter() {
    const getVendors = () => {
      const products = ProductSearch.find();
      const vendors = [];
      products.map(product => {
        vendors.push(product.vendor);
      });
      const uniqueVendors = [...new Set(vendors)];
      return uniqueVendors;
    };

    const renderVendors = () => {
      const vendors = getVendors();
      return vendors.map(vendor => <option key={vendor} value={vendor}>{vendor}</option>);
    };

    return (
      <div className="container">
        <div className="row">
          <div className="form-group col-sm-4">
            <label htmlFor="sel1" style={{ fontSize: "12px" }}>Filter By Price:</label>
            <select
              className="form-control"
              id="sel1"
              onChange={this.props.handlePriceSelect}
              value={this.props.priceQuery}
            >
              <option value="0 - 100000">ALL</option>
              <option value="0 - 100">0 - 100</option>
              <option value="100 - 200">100 - 200</option>
              <option value="200 - 300">200 - 300</option>
              <option value="300 - 400">300 - 400</option>
              <option value="400 - 500">400 - 500</option>
              <option value="500 - 600">500 - 600</option>
              <option value="600 - 700">600 - 700</option>
              <option value="700 - 800">700 - 800</option>
              <option value="800 - 900">800 - 900</option>
              <option value="900 - 1000">900 - 1000</option>
            </select>
          </div>

          <div className="form-group col-sm-4">
            <label htmlFor="sel1" style={{ fontSize: "12px" }}>Filter By Brand:</label>
            <select
              className="form-control"
              id="sel1"
              onChange={this.props.handleVendorSelect}
              value={this.props.vendorQuery}
            >
              <option value="">ALL</option>
              {renderVendors()}
            </select>
          </div>

          <div className="form-group col-sm-4">
            <label htmlFor="sel1" style={{ fontSize: "12px" }}>Sort:</label>
            <select
              className="form-control"
              id="sel1"
              onChange={this.props.handleSortSelect}
              value={this.props.sortValue}
            >
              <option value="">Default</option>
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
              <option value="price">Price</option>
              <option value="highest rating">Highest rating</option>
              <option value="least rating">Lowest rating</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="rui search-modal-close"><IconButton icon="fa fa-times" onClick={this.props.unmountMe} /></div>
        <div className="rui search-modal-header">
          {this.renderSearchInput()}
          {this.renderSearchTypeToggle()}
          {this.props.tags.length > 0 && this.renderProductSearchTags()}
        </div>
        <div className="rui search-modal-filter">{this.renderSortFilter()}</div>
        <div className="rui search-modal-results-container">
          {this.props.products.length > 0 &&
            <ProductGridContainer
              products={this.props.products}
              unmountMe={this.props.unmountMe}
              isSearch={true}
            />
          }
          {this.props.accounts.length > 0 &&
            <div className="data-table">
              <div className="table-responsive">
                <SortableTableLegacy
                  data={this.props.accounts}
                  columns={accountsTable()}
                  onRowClick={this.props.handleAccountClick}
                />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default SearchModal;
