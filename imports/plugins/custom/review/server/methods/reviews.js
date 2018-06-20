import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Reviews } from "../../lib/collections";
import { Products } from "../../../../../../lib/collections";


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("reviews", function tasksPublication() {
    return Reviews.find();
  });
}

Meteor.methods({
  "review/add"(comment, rating, slug, name) {
    // const productId = Products.find({ handle: slug }).fetch()._id;
    check(comment, String);
    check(name, String);
    check(rating, Number);
    check(slug, String);

    if (!this.userId) {
      // console.log("An etrrpor occured");
      throw new Meteor.Error("not-authorized...");
    }

    const doc = Reviews.findOne({ $and: [ { user: this.userId }, { productId: slug } ] });
    if (!doc) {
      return Reviews.insert({
        comment,
        user: this.userId,
        rating,
        userName: name || "Anonymous",
        productId: slug,
        createdAt: new Date()
      });
    }
    return Reviews.update(doc._id, { $set: { rating, comment, createdAt: new Date() } });
  },

  /**
   *
   * @param { String } productSlug productId in Reviews colection
   *                               handle in Product collection
   * @return { Array } aggregated resultnwith _id and averageRating fields i.e [{_id, averageRating}]
   */
  "review/computeAverage"(productSlug) {
    check(productSlug, String);

    const result = Reviews.aggregate([
      { $match: { productId: productSlug } },
      { $group: { _id: "$productSlug", averageRating: { $avg: "$rating" } } }
    ]);
    return result[0].averageRating;
  },

  /**
   *
   * @param { String } productSlug unique identifier for the product which is productId/ slug in the Review collection
   *                               but it is handle in the Product collection
   * @param { Number } averageRating average rating
   *
   * @return { Object } updated product
   */
  "review/setAverage"(productSlug, averageRating) {
    check(averageRating, Number);
    check(productSlug, String);

    const product = Products.findOne({ handle: productSlug });

    if (product) {
      const updatedProduct = Object.assign({}, product, { averageRating });
      return Products.upsert({ _id: product._id }, { $set: updatedProduct });
    }
  }
});
