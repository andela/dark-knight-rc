/* eslint-disable */
import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import DisplayReportCard from "./card/DisplayReportCard";
import { formatPriceString } from "/client/api";
import Chart from "./charts/Charts";


export const Overview = ({ displayPieChart,
  pieChartData, showSalesChart, displaySales,
  displaySalesChart, displayOrderChart, displayCancelledOrder,
  displayPurchaseProduct, handleDisplayChart, selectedReport,
  salesArray, totalSales, cancelledOrder, totalPurchasedProduct, totalOrders }) => {
  const covObjArr = [];
  const salesHist = [];


  Object.keys(displaySales).map(key => {
    salesHist.push(displaySales[key]);
  });

  // console.log(salesHist);

  Object.keys(salesArray).map((key) => {
    covObjArr.push(salesArray[key]);
  });
  return (
    <div className="text-center" style= {{ display: selectedReport === "ShowRetailerDashBoard" ? "block" : "none" }}>
      <h1> Overview </h1>
      <div className="row container">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-6">
              <DisplayReportCard
                title="Total Sales"
                amount={formatPriceString(totalSales)}
                ReportIcon = "fa fa-cart-plus adjust-cart"
                id="totalSales"
                handleDisplayChart = {handleDisplayChart}
              />
            </div>
            <div className="col-md-6">
              <DisplayReportCard
                title="Total Cancelled Orders"
                amount={cancelledOrder}
                ReportIcon = "fa fa-ban adjust-cart"
                id="cancelledOrder"
                handleDisplayChart = {handleDisplayChart}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <DisplayReportCard
                title="Total Purchased Product"
                amount={totalPurchasedProduct}
                id="purchasedProduct"
                ReportIcon = "fa fa-product-hunt adjust-cart"
                handleDisplayChart = {handleDisplayChart}
              />
            </div>
            <div className="col-md-6">
              <DisplayReportCard
                title="Total Orders"
                amount={totalOrders}
                id="totalOrders"
                ReportIcon = "fa fa-sun-o adjust-cart"
                handleDisplayChart = {handleDisplayChart}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <Chart
            data={covObjArr}
            displaySalesChart = {displaySalesChart}
            displayOrderChart = {displayOrderChart}
            displayCancelledOrder = {displayCancelledOrder}
            displayPurchaseProduct = {displayPurchaseProduct}
            displaySales = {displaySales}
            salesData = {salesHist}
            showSalesChart = {showSalesChart}
            pieChartData = {pieChartData}
            displayPieChart = {displayPieChart}
          />
        </div>
      </div>
    </div>
  );
};

registerComponent("Overview", Overview);
export default Overview;
