import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Reviews } from "../../lib/collections";
// import { Products } from "../../../../../../lib/collections";


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
  } });
