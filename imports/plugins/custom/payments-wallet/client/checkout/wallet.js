/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Template } from "meteor/templating";
import { $ } from "meteor/jquery";
import { Reaction } from "/client/api";
import { Cart, Packages, Shops } from "/lib/collections";
import { Paystack } from "../../lib/api";
import "./wallet.html";

let gBalance = -1;
let gShowTopUpButton = false;
Meteor.call("accounts/getWalletBalance", (err, balance) => {
  gBalance = Number(balance);
});

const uiEnd = (template, buttonText) => {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
};

const paymentAlert = (errorMessage) => {
  return $(".alert").removeClass("hidden").text(errorMessage);
};

const hidePaymentAlert = () => {
  return $(".alert").addClass("hidden").text("");
};

const handleWalletSubmitError = (error) => {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
};

Template.walletPaymentForm.onCreated(() => {
  const amount = Cart.findOne().cartTotal();
  Meteor.call("accounts/getWalletBalance", (err, balance) => {
    gBalance = balance;
    if (!err) {
      if (balance < amount) {
        gShowTopUpButton = true;
      }
    } else {
      Alerts.toast(err.message, "error");
    }
  });
});

Template.walletPaymentForm.helpers({
  getTotal: () => {
    return Cart.findOne().getTotal();
  },
  getWalletBalance: () => {
    Meteor.call("accounts/getWalletBalance", (err, balance) => {
      gBalance = Number(balance);
    });
    return gBalance;
  },
  showTopUpButton: () => {
    const amount = Cart.findOne().cartTotal();
    Meteor.call("accounts/getWalletBalance", (err, balance) => {
      if (Number(balance) < Number(amount)) {
        gShowTopUpButton = true;
      } else {
        gShowTopUpButton = false;
      }
    });
    return gShowTopUpButton;
  }
});

Template.walletPaymentForm.events({
  "click #completeOrderButton": (event, template) => {
    event.preventDefault();
    template.$(":input").attr("disabled", true);

    // Get wallet package for current shop.
    const packageData = Packages.findOne({
      name: "paystack-paymentmethod",
      shopId: Reaction.getShopId()
    });

    // Details needed for transaction.
    const amount = Number(Cart.findOne().cartTotal());
    const reference = Random.id();
    const currency = Shops.findOne({ _id: Reaction.getShopId() }).currency;

    Alerts.alert({
      title: `Debit ₦${amount} from wallet`,
      type: "warning",
      customClass: "w-custom-size",
      showCancelButton: true,
      confirmButtonText: "Continue"
    }, (isConfirmed) => {
      if (isConfirmed) {
        const paymentMethod = {
          processor: "Wallet",
          paymentPackageId: packageData._id,
          paymentSettingsKey: packageData.registry[0].settingsKey,
          method: "credit",
          transactionId: reference,
          currency,
          amount,
          status: "success",
          mode: "authorize",
          createdAt: new Date(),
          transactions: []
        };

        // Deduct fund from wAallet.
        Meteor.call("accounts/deductFromWallet", amount, (error) => {
          if (error) {
            // Show .
            Alerts.toast(error.message, "error");
            template.$(":input").removeAttr("disabled");
          } else {
            // Register payment.
            Meteor.call("cart/submitPayment", paymentMethod, (submitPaymentError) => {
              template.$(":input").removeAttr("disabled");
              if (submitPaymentError) {
                // Show error.
                Alerts.toast(submitPaymentError.message, "error");
              } else {
                // Show toast of successful payment.
                Alerts.toast("Payment completed successfully", "success");
              }
            });
          }
        });
      }
    });
  },

  "click #topUpButton": (event, template) => {
    event.preventDefault();
    template.$(":input").attr("disabled", true);

    hidePaymentAlert();

    Meteor.subscribe("Packages", Reaction.getShopId());

    // Get paystack package for current shop.
    const packageData = Packages.findOne({
      name: "paystack-paymentmethod",
      shopId: Reaction.getShopId()
    });

    // Details needed for transaction.
    const email = $("input[type='email']").val();
    const amount = Number($("input[type='number']").val());
    const { publicKey, secretKey } = packageData.settings["paystack-paymentmethod"];
    const ref = Random.id();

    // Setting up details to be sent Wallet
    const wallet = PaystackPop.setup({
      amount: amount * 100,
      email,
      ref,
      key: publicKey,
      // Paystack sends transaction ref to this callback
      callback: (res) => {
        // Paystack verification happens here.
        Paystack.verify(res.reference, secretKey, (err) => {
          // If there is no error during verification
          if (!err) {
            // Add amount to wallet.
            Meteor.call("accounts/addToWallet", amount, (submitPaymentError) => {
              if (submitPaymentError) {
                Alerts.toast(submitPaymentError.message, "error");
              } else {
                // Remove disabled from buttton
                template.$(":input").removeAttr("disabled");

                // Show toast of successful payment.
                Alerts.toast("Payment completed successfully", "success");

                // Reload page.
                setTimeout(() => document.location.reload(true), 1000);
              }
            });

          // An error occured during verification
          } else {
            handleWalletSubmitError(err);
            uiEnd(template, "Resubmit payment");
          }
        });
      },
      onClose: () => {
        uiEnd(template, "Resubmit payment");
      }
    });

    // Open Paystack iframe. You need Access-Control-Allow-Origin for this
    try {
      wallet.openIframe();
    } catch (e) {
      handleWalletSubmitError(e);
      uiEnd(template, "Pay with wallet");
    }

    return false;
  }
});
