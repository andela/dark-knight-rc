import React, { Component } from "react";
import { formatPriceString } from "/client/api";
import {  registerComponent, composeWithTracker  } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { Products, Media } from "/lib/collections";

class TopProducts extends Component {
  constructor(props) {
    super(props);
    this.getImageUrl = this.getImageUrl.bind(this);
  }

  getImageUrl = (productId) => {
    const { productsMedia } = this.props;
    const productMedia = productsMedia.find(fs => fs.metadata.productId === productId);
    if (productMedia) {
      return productMedia.url({ store: "medium" });
    }
    return "/resources/placeholder.gif";
  };

  render() {
    return (
      <div className="top-products" id="top-products">
        <h2 className="align-center">TOP PRODUCTS</h2>
        { this.props.products &&
          <div className="row row-eq-heightt product-group">
            { this.props.products.map(product => (
              <a key={product._id} href={`/product/${product.handle}/`}>
                <div className="card products align-center col-sm-6 col-md-3">
                  <img className="card-img-top img-responsive" src={this.getImageUrl(product._id)} alt="Product"/>
                  <div className="card-body">
                    <h4>{product.title}</h4>
                    <h5>{formatPriceString(product.price.range || product.price)}</h5>
                  </div>
                </div>
              </a>)
            )}
          </div>
        }
      </div>
    );
  }
}
TopProducts.defaultProps = {
  productsMedia: []
};
TopProducts.propTypes = {
  products: PropTypes.array,
  productsMedia: PropTypes.array
};

const composer = (props, onData) => {
  let topMedia; let productsMedia; let products;

  const topProduct = Meteor.subscribe("TopProducts", 8).ready();

  if (topProduct) {
    products = Products.find({ type: "simple" }).fetch();

    if (products.length > 0) {
      topMedia = Meteor.subscribe("TopProductsImages", products).ready();
      if (topMedia) {
        productsMedia = Media.find({  }).fetch();
      }
    }
    onData(null, { products, productsMedia, ...props });
  }
};

registerComponent(
  "TopProducts",
  TopProducts,
  composeWithTracker(composer)
);
export default composeWithTracker(composer)(TopProducts);
