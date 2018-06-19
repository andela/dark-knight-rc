import { Meteor } from "meteor/meteor";
import { Packages } from "/lib/collections";

export const Paystack = {
  accountOptions: function () {
    const settings = Packages.findOne({
      name: "paystack-paymentmethod" // reaction-paymentmethod
    }).settings;
    if (!settings.secretKey && !settings.publicKey) {
      throw new Meteor.Error("403", "Invalid Credentials");
    }
    return { secretKey: settings.secretKey, publicKey: settings.publicKey };
  },

  authorize: function (cardInfo, paymentInfo, callback) {
    Meteor.call("paystackSubmit", "authorize", cardInfo, paymentInfo, callback);
  },

  verify: (ref, secretKey, fn) => {
    const url = `https://api.paystack.co/transaction/verify/${ref}`;
    fetch(url, {
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        if (response.status) {
          fn(null, response);
        } else {
          fn(response, null);
        }
      });
  }
};
