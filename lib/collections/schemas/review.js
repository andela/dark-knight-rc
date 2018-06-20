import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";

/**
 * @name Metafield
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} user optional
 * @property {String} comment optional
 */
export const Reviews = new SimpleSchema({
  user: {
    type: Object,
    optional: true
  },
  comment: {
    type: String,
    optional: true
  },
  product: {
    type: String,
    optional: false
  }
});

registerSchema("Reviews", Reviews);
