/* eslint-disable */
import React from "react";

const GetOrdersHelper = (getAllOrders) => {
  const analytics = {};
  const totalSalesHistory = {};
  const canceledOrders = {};
  let totalSales = 0;
  let cancelledOrder = 0;
  let totalPurchasedProduct = 0;
  let totalOrders = 0;


  getAllOrders.forEach(items => {
    items.items.forEach(eachItem => {
      if (eachItem.workflow.status !== "coreOrderItemWorkflow/canceled") {
        if (!totalSalesHistory[(items.createdAt).toLocaleDateString()]) {
          totalSalesHistory[(items.createdAt).toLocaleDateString()] = {};
          totalSalesHistory[(items.createdAt).toLocaleDateString()].sales = 0;
        }


        if (totalSalesHistory[(items.createdAt).toLocaleDateString()]) {
          totalSalesHistory[(items.createdAt).toLocaleDateString()].sales += Number.parseFloat(items.billing[0].invoice.subtotal);
          totalSalesHistory[(items.createdAt).toLocaleDateString()].date = (items.createdAt).toLocaleDateString();
        }

        if (!analytics[eachItem.title]) {
          analytics[eachItem.title] = {};
          analytics[eachItem.title].quantitySold = 0;
          analytics[eachItem.title].price = 0;
        }

        if (analytics[eachItem.title]) {
          analytics[eachItem.title].quantitySold += eachItem.quantity;
          analytics[eachItem.title].price += Number.parseFloat(items.billing[0].invoice.subtotal);
          analytics[eachItem.title].product = eachItem.title;
        }

        totalPurchasedProduct += eachItem.quantity;
        totalSales += Number.parseFloat(items.billing[0].invoice.subtotal);
      } else {
        if (!canceledOrders[eachItem.title]) {
          canceledOrders[eachItem.title] = {};
          canceledOrders[eachItem.title].quantityCancelled = 0;
          canceledOrders[eachItem.title].price = 0;
        }

        if (canceledOrders[eachItem.title]) {
          canceledOrders[eachItem.title].quantityCancelled += eachItem.quantity;
          canceledOrders[eachItem.title].price += Number.parseFloat(items.billing[0].invoice.subtotal);
          canceledOrders[eachItem.title].product = eachItem.title;
        }
        cancelledOrder++;
      }
    });
    totalOrders++;
  });

  //   console.log("cancel", canceledOrders);
  //   console.log("sales history", totalSalesHistory);

  return {
    analytics,
    totalSales,
    cancelledOrder,
    totalPurchasedProduct,
    totalOrders,
    canceledOrders,
    totalSalesHistory
  };
};

export default GetOrdersHelper;
