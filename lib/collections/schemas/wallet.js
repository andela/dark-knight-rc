import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";

export const Wallet = new SimpleSchema({
  userId: {
    type: String,
    optional: false
  },
  amount: {
    type: Number,
    defaultValue: 0,
    optional: false
  }
});

registerSchema("Wallet", Wallet);
