import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Random } from "meteor/random";
import { registerSchema } from "@reactioncommerce/reaction-collections";

/**
 * Reaction Schemas StaticPages
 */
export const StaticPages = new SimpleSchema({
  _id: {
    type: String,
    defaultValue: Random.id(),
    optional: true
  },
  pageName: {
    label: "Static Page Name",
    type: String
  },
  pageAddress: {
    label: "Static Page URL Address",
    type: String
  },
  pageContent: {
    label: "Static Page Content",
    type: String
  },
  userId: {
    label: "User Identification Number",
    type: String
  },
  shopId: {
    label: "Shop Identification Number",
    type: String
  },
  isEnabled: {
    label: "Show page link on nav bar.",
    type: Boolean,
    defaultValue: false
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
      return {
        $setOnInsert: new Date()
      };
    }
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});

registerSchema("StaticPages", StaticPages);
