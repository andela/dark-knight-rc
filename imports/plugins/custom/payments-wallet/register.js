/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "WalletPayment",
  name: "wallet-paymentmethod",
  icon: "fa fa-credit-card-alt",
  autoEnable: true,
  settings: {
    "mode": true,
    "wallet": {
      enabled: true
    },
    "wallet-paymentmethod": {
      enabled: true
    }
  },
  registry: [
    // Dropdown
    {
      label: "Wallet", // this key (minus spaces) is used for translations
      name: "account/wallet",
      route: "/account/wallet",
      provides: ["userAccountDropdown"],
      template: "walletPage",
      icon: "fa fa-google-wallet"
    },

    // Payment form for checkout
    {
      template: "walletPaymentForm",
      provides: ["paymentMethod"],
      icon: "fa fa-credit-card-alt"
    }
  ]
});
