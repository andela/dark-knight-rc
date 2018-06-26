const paymentSteps = [
  {
    element: ".w-header",
    position: "bottom",
    intro: `
    <h4>Wallet balance</>
    <hr>
    <h6>That's how much you have left in your wallet</h6>
    `
  },
  {
    element: "#w-fund-wallet",
    position: "right",
    intro: `
    <h4>Fund your wallet</>
    <hr>
    <h6>You can fund your wallet here</h6>
    `
  },
  {
    element: "#w-withdraw-funds",
    position: "right",
    intro: `
    <h4>Withdraw funds</>
    <hr>
    <h6>You can even withdraw your funds! But why would you want to do that? ;)</h6>
    `
  },
  {
    element: "#w-transfer-funds",
    position: "left",
    intro: `
    <h4>Transfer funds</>
    <hr>
    <h6>You can transfer funds to your friends.</h6>
    `
  }
];

export default paymentSteps;
