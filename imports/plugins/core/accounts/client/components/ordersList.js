import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import CompletedOrder from "../../../checkout/client/components/completedOrder";

/**
 * @summary React component to display an array of completed orders
 * @class OrdersList
 * @extends {Component}
 * @property {Array} allOrdersInfo - array of orders
 * @property {Function} handeleDisplayMedia - function to display order image
 */
class OrdersList extends Component {
  static propTypes = {
    allOrdersInfo: PropTypes.array,
    handleDisplayMedia: PropTypes.func,
    isProfilePage: PropTypes.bool
  }
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      completed: false,
      reviewSuccess: false
    };

    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
  }

  cancelOrder(order) {
    return Meteor.call("orders/cancelOrder", order, true, true, (err, result) => {
      if (result) {
        this.setState({ reviewSuccess: true });
        setTimeout(() => {this.setState({ reviewSuccess: false });}, 3000);
      }
    });
  }

  getOrderStatus(orderId) {
    Meteor.call("orders/getOrderStatus", orderId, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        switch (result) {
          case "new":
            this.setState({ message: `The admin is yet to attend to this request. 
            No charges would be incured`, completed: false });
            break;
          case "coreOrderWorkflow/processing":
            this.setState({ message: `The admin is currently attending to this request.
             No charges would be incured still`, completed: false });
            break;
          case "coreOrderWorkflow/completed":
            this.setState({ message: `The admin has completed this request.
            A refund would not be possible`, completed: true });
            break;
          default:
            this.setState({ message: `This order has been canceled.
             You will recieve a refund as soon as possible`, completed: true });
        }
      }
    });
  }

  render() {
    const { allOrdersInfo, handleDisplayMedia } = this.props;

    if (allOrdersInfo) {
      return (
        <div>
          {this.state.reviewSuccess ? <div className="show" id="snackbar">Order Cancelled</div> : ""}
          {allOrdersInfo.map((order) => {
            const orderKey = order.orderId;
            return (
              <CompletedOrder
                key={orderKey}
                shops={order.shops}
                order={order.order}
                orderId={order.orderId}
                orderSummary={order.orderSummary}
                paymentMethods={order.paymentMethods}
                productImages={order.productImages}
                handleDisplayMedia={handleDisplayMedia}
                isProfilePage={this.props.isProfilePage}
                getOrderStatus={this.getOrderStatus}
                cancelOrder={this.cancelOrder}
                state={this.state}
              />
            );
          })}
        </div>
      );
    }
    return (
      <div className="alert alert-info">
        <span data-i18n="cartCompleted.noOrdersFound">No orders found.</span>
      </div>
    );
  }
}

export default OrdersList;
