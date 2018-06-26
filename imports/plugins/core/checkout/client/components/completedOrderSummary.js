import React from "react";
import PropTypes from "prop-types";
import { Components, registerComponent } from "@reactioncommerce/reaction-components";
import ShopOrderSummary from "./shopOrderSummary";


/**
 * @summary Display the summary/total information for an order
 * @param {Object} props - React PropTypes
 * @property {Array} shops - An array of summary information broken down by shop
 * @property {Object} orderSummary - An object representing the "bottom line" summary for the order
 * @property {boolean} isProfilePage - Checks if current page is Profile Page
 * @return {Node} React node containing the order summary broken down by shop
 */
let tempOrder = {};
const CompletedOrderSummary = ({ shops, orderSummary, isProfilePage, getOrderStatus, order, cancelOrder, state }) => {
  return (
    <div>
      <div className="order-details-content-title">
        <p><Components.Translation defaultValue="Order Summary" i18nKey={"cartCompleted.orderSummary"} /></p>
      </div>
      <div className="order-details-info-box">
        {shops.map((shop) => {
          const shopKey = Object.keys(shop);
          return <ShopOrderSummary shopSummary={shop[shopKey]} key={shopKey} isProfilePage={isProfilePage} />;
        })}
        <hr />
        {orderSummary.discounts > 0 &&
          <div className="order-summary-line">
            <div className="order-summary-discount-title">
              <Components.Translation defaultValue="Discount Total" i18nKey={"cartCompleted.discountTotal"} />
            </div>
            <div className="order-summary-discount-value">
              <Components.Currency amount={orderSummary.discounts} />
            </div>
          </div>
        }
        <div className="order-summary-line">
          <div className="order-summary-total-title">
            <Components.Translation defaultValue="Order Total" i18nKey={"cartCompleted.orderTotal"} />
          </div>
          <div className="order-summary-total-value">
            <Components.Currency amount={orderSummary.total} />
          </div>
        </div>
        <div style={{ padding: "25px 15px" }}>
          {state ?
            <button className="btn btn-danger" onClick={() => { getOrderStatus(order._id); tempOrder = order; }}
              data-toggle="modal" data-target="#myModal"
            >Cancel order</button>
            :
            <button className="btn btn-success" onClick={() => { print(); }}>Print details</button>}
        </div>
      </div>


      <div className="modal fade" id="myModal" role="dialog" style={{ borderRadius: 0 }}>
        <div className="modal-dialog">

          <div className="modal-content" style={{ width: 350, borderRadius: 0 }}>
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title" style={{ textAlign: "center" }}>Cancel Order</h4>
            </div>
            <div className="modal-body">
              <p style={{ textAlign: "center" }}>{state ? state.message : ""}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-success" onClick={() => cancelOrder(tempOrder)} data-dismiss="modal"
                /* eslint-disable-next-line no-nested-ternary */
                disabled={state ? (state.completed ? true : false) : false}
              >Accept</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

CompletedOrderSummary.propTypes = {
  cancelOrder: PropTypes.func,
  getOrderStatus: PropTypes.func,
  isProfilePage: PropTypes.bool,
  order: PropTypes.object,
  orderSummary: PropTypes.object,
  shops: PropTypes.array,
  state: PropTypes.object
};

registerComponent("CompletedOrderSummary", CompletedOrderSummary);

export default CompletedOrderSummary;
