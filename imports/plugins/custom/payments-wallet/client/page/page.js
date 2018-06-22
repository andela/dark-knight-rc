/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Template } from "meteor/templating";
import { $ } from "meteor/jquery";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";
import { Paystack } from "../../lib/api";

import "./page.html";

let gBalance = -1;
Meteor.call("accounts/getWalletBalance", (err, balance) => {
  gBalance = Number(balance);
});

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

function handleWalletSubmitError(error) {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
}

Template.walletPage.onCreated(() => {
  Meteor.call("accounts/getWalletBalance", (err, balance) => {
    gBalance = Number(balance);
  });
});

Template.walletPage.helpers({
  getWalletBalance: () => {
    Meteor.call("accounts/getWalletBalance", (err, balance) => {
      gBalance = Number(balance);
    });
    return gBalance;
  }
});

const removeDisableTransferInput = (template) => {
  template.$("#transferAmount:input").removeAttr("disabled");
  template.$("#transferEmail:input").removeAttr("disabled");
};

Template.walletPage.events({
  "click #fundButton": (event, template) => {
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
      amount: amount * 100, // Overriding default
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
  },

  "click #withdrawButton": (event, template) => {
    event.preventDefault();
    template.$("#withdrawAmount:input").attr("disabled", true);

    // Details needed for transaction.
    const amount = Number($("input[name='withdrawAmount']").val());
    const balance = gBalance;

    // Sanity checks.
    if (!amount || amount === 0) {
      Alerts.toast("You have to specify an amount!", "error");
      template.$("#withdrawAmount:input").removeAttr("disabled");
    } else if (balance < amount) {
      Alerts.toast("You don't have that much funds in your wallet!", "error");
      template.$("#withdrawAmount:input").removeAttr("disabled");
    } else {
      Alerts.alert({
        title: `Withdraw ₦${amount} from wallet`,
        type: "warning",
        showCancelButton: true,
        customClass: "w-custom-size",
        confirmButtonText: "Continue"
      }, (isConfirmed) => {
        template.$("#withdrawAmount:input").removeAttr("disabled");
        if (isConfirmed) {
          // Notify admin and user about withdrawal.
          Meteor.call("accounts/notifyWithdraw", amount, (error) => {
            if (error) {
              // Show error message.
              Alerts.toast(error.message, "error");
            } else {
              // Deduct fund from wallet.
              Meteor.call("accounts/deductFromWallet", amount, (submitPaymentError) => {
                if (submitPaymentError) {
                  // Show error message.
                  Alerts.toast(submitPaymentError.message, "error");
                } else {
                  // Show toast of successful payment.
                  Alerts.toast("Payment completed successfully", "success");

                  // Reload page.
                  setTimeout(() => document.location.reload(true), 1000);
                }
              });
            }
          });
        }
      });
    }
  },

  "click #transferButton": (event, template) => {
    event.preventDefault();
    template.$("#transferAmount:input").attr("disabled", true);
    template.$("#transferEmail:input").attr("disabled", true);

    // Details needed for transaction.
    const email = $("input[name='transferEmail']").val();
    const amount = Number($("input[name='transferAmount']").val());
    const balance = gBalance;

    // Sanity checks.
    if (!amount || amount === 0) {
      Alerts.toast("You have to specify an amount!", "error");
      removeDisableTransferInput(template);
    } else if (balance < amount) {
      Alerts.toast("You don't have that much funds in your wallet!", "error");
      removeDisableTransferInput(template);
    } else {
      Alerts.alert({
        title: `Transfer ₦${amount} to friend`,
        type: "warning",
        customClass: "w-custom-size",
        showCancelButton: true,
        confirmButtonText: "Continue"
      }, (isConfirmed) => {
        removeDisableTransferInput(template);
        if (isConfirmed) {
          // Transfer fund from wallet.
          Meteor.call("accounts/transferToFriendsWallet", amount, email, (error) => {
            if (error) {
              // Show error message.
              Alerts.toast(error.message, "error");
            } else {
              // Show toast of successful payment.
              Alerts.toast("Transfer completed successfully", "success");

              // Reload page.
              setTimeout(() => document.location.reload(true), 1000);
            }
          });
        }
      });
    }
  }
});
