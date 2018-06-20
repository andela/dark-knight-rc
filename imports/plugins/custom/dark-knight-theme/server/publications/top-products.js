import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Products, Media } from "/lib/collections";

Meteor.publish("TopProducts", (limit) => {
  check(limit, Number);
  return Products.find({ type: "simple" }, { limit, sort: { title: -1 } });
});

Meteor.publish("TopProductsImages",  (productItems = []) => {
  check(productItems, Array);

  // Ensure each of these are unique
  const productIds = [...new Set(productItems.map((item) => item._id))];

  // return image for each the top level product or the variant and let the client code decide which to display
  const productImages = Media.find(
    { "$or":
    [{
      "metadata.productId": { $in: productIds }
    }
    ],
    "metadata.workflow": { $nin: ["archived", "unpublished"] }
    }
  );

  return productImages;
});

