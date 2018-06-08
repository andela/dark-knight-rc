import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";

export const Review = new SimpleSchema({
  comment: {
    type: String,
    optional: false
  },
  user: {
    type: String,
    optional: false
  },
  userName: {
    type: String,
    optional: false
  },
  rating: {
    type: Number,
    optional: false
  },
  productId: {
    type: String,
    optional: false
  },
  createdAt: {
    type: Date,
    optional: false
  }
});

registerSchema("Review", Review);
