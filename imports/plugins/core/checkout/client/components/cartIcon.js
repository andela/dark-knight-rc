import React from "react";
import PropTypes from "prop-types";

const CartIcon = ({ handleClick, cart }) => (
  <div className="cart-icon" onClick={handleClick}>
    <span data-event-category="cart" className="fa fa-2x fa-shopping-cart cart-badge" data-count={cart ? cart.getCount() : 0}  />
  </div>
);

CartIcon.propTypes = {
  cart: PropTypes.object,
  handleClick: PropTypes.func.isRequired
};

export default CartIcon;
