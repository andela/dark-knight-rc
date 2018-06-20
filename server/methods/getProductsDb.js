import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import { check } from "meteor/check";

Meteor.methods({
  getProductsInventoryFromDb: (ProductToGet) => {
    check(ProductToGet, Object);
    check(ProductToGet.searchedProduct, String);


    return Collections.Products.find({
      $and: [{
        type: "variant",
        title: {
          $regex: ProductToGet.searchedProduct,
          $options: "i"
        }
      }]
    }).fetch();
  },

  getAllProducts: () => {
    return Collections.Products.find({
      $and: [{
        type: "variant"
      }]
    }).fetch();
  }

});
