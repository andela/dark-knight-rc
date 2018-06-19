/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Template } from "meteor/templating";
import { AutoForm } from "meteor/aldeed:autoform";
import { $ } from "meteor/jquery";
import { Reaction } from "/client/api";
import { Cart, Packages } from "/lib/collections";
import { Paystack } from "../../lib/api";
import { PaystackPayment } from "../../lib/collections/schemas";

import "./paystack.html";

let submitting = false;

function uiEnd(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
}

function paymentAlert(errorMessage) {
  return $(".alert").removeClass("hidden").text(errorMessage);
}

function hidePaymentAlert() {
  return $(".alert").addClass("hidden").text("");
}

function handlePaystackSubmitError(error) {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
}

Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

AutoForm.addHooks("paystack-payment-form", {
  onSubmit: function (doc) {
    submitting = true;
    const template = this.template;
    hidePaymentAlert();

    Meteor.subscribe("Packages", Reaction.getShopId());

    // Get paystack package for current shop.
    const packageData = Packages.findOne({
      name: "paystack-paymentmethod",
      shopId: Reaction.getShopId()
    });

    // Details needed for transaction.
    const { email } = doc;
    const { publicKey, secretKey } = packageData.settings["paystack-paymentmethod"];
    const amount = Math.round(Cart.findOne().cartTotal() * 100);
    const ref = Random.id();

    // Setting up details to be sent Paystack
    const paystack = PaystackPop.setup({
      amount,
      email,
      ref,
      key: publicKey,
      // Paystack sends transaction ref to this callback
      callback: (res) => {
        // Paystack verification happens here.
        Paystack.verify(res.reference, secretKey, (err, body) => {
          // If there is no error during verification
          if (!err) {
            const transaction = body.data;
            submitting = false;
            const paymentMethod = {
              processor: "Paystack",
              paymentPackageId: packageData._id,
              paymentSettingsKey: packageData.registry[0].settingsKey,
              storedCard: transaction.authorization.card_type,
              method: "credit",
              transactionId: transaction.reference,
              riskLevel: transaction.riskLevel,
              currency: transaction.currency,
              amount: transaction.amount / 100,
              status: transaction.status,
              mode: "authorize",
              createdAt: new Date(),
              transactions: [transaction.authorization]
            };

            // Show toast of successful payment.
            Alerts.toast("Payment completed successfully", "success");

            // Add cart payment details to database.
            Meteor.call("cart/submitPayment", paymentMethod);

          // An error occured during verification
          } else {
            submitting = false;
            handlePaystackSubmitError(err);
            uiEnd(template, "Resubmit payment");
          }
        });
      },
      onClose: () => {
        uiEnd(template, "Resubmit payment");
      }
    });

    // Open paystack iframe. You need Access-Control-Allow-Origin for this
    try {
      paystack.openIframe();
    } catch (e) {
      handlePaystackSubmitError(e);
      uiEnd(template, "Pay with paystack");
    }

    return false;
  },
  beginSubmit: function () {
    this.template.$(":input").attr("disabled", true);
    this.template.$("#btn-complete-order").text("Submitting ");
    return this.template.$("#btn-processing").removeClass("hidden");
  },
  endSubmit: function () {
    if (!submitting) {
      return uiEnd(this.template, "Complete your order");
    }
  }
});
