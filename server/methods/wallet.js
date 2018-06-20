import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Wallet } from "/lib/collections";

Meteor.methods({
  "wallet/addToWallet"(amount, userId) {
    check(amount, Number);
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized...");
    }

    const doc = Wallet.findOne({ userId });
    if (!doc) {
      return Wallet.insert({
        amount,
        userId
      });
    }
    return Wallet.update(doc._id, { $inc: { amount } });
  }
});
