import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";
import { registerSchema } from "@reactioncommerce/reaction-collections";

export const WalletPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.mode": {
      type: Boolean,
      defaultValue: true
    },
    "settings.apiKey": {
      type: String,
      label: "API Key",
      optional: true
    }
  }
]);

registerSchema("WalletPackageConfig", WalletPackageConfig);

export const WalletPayment = new SimpleSchema({
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

registerSchema("WalletPayment", WalletPayment);
