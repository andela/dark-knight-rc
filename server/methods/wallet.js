import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Accounts } from "/lib/collections";

// Checks
const amountValid = Match.Where((amount) => !isNaN(amount) && amount > 0);

Meteor.methods({
  "wallet/addToWallet"(amount, userId) {
    try {
      check(amount, amountValid);
    } catch (err) {
      throw new Meteor.Error(400, "The amount entered is not valid!");
    }
    try {
      check(userId, String);
    } catch (err) {
      throw new Meteor.Error(400, "UserId is not valid!");
    }
    if (!this.userId) {
      throw new Meteor.Error("not-authorized...");
    }

    Accounts.update({ _id: userId }, {
      $inc: {
        walletBalance: Number(amount)
      }
    });
  }
});
