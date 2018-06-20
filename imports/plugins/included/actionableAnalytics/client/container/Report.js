import React from "react";
import { Meteor } from "meteor/meteor";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { Sidebar } from "../component/sidebar/Sidebar";
import Overview from "../component/Overview";
import SalesReport from "../component/SalesReport";
import InventoryReport from "../component/InventoryReport";
import GetHelper from "../component/helpers/GetOrdersHelper";
import DateInput from "../component/dateInput/DateInput";

export class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectReportTab: "ShowRetailerDashBoard",
      reportTitle: "",
      tooltipIsOpen: false,
      tooltipIsOpenSales: false,
      tooltipIsOpenInventory: false,
      tooltipIsOpenPerformance: false,
      setOverviewActive: true,
      setSalesActive: false,
      setInventoryActive: false,
      productArray: [],
      fromDate: new Date("2018-05-1"),
      toDate: new Date("2019-05-1"),
      productSales: {},
      totalSales: 0,
      cancelledOrder: 0,
      totalPurchasedProduct: 0,
      totalOrders: 0,
      displaySalesChart: false,
      displayOrderChart: false,
      displayCancelledOrder: false,
      displayPurchaseProduct: false,
      showSalesChart: false,
      searchItem: "",
      displaySales: [],
      displayOrderPieChart: [],
      displayPieChart: false
    };
  }

  componentDidMount() {
    const self = this;
    const arrNew = [];
    let orders = {};
    Meteor.call("getOrdersFromDb", {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate
    }, function (err, data) {
      orders = GetHelper(data);
      self.setState({
        displaySales: orders.totalSalesHistory,
        productSales: orders.analytics,
        totalSales: orders.totalSales,
        cancelledOrder: orders.cancelledOrder,
        totalPurchasedProduct: orders.totalPurchasedProduct,
        totalOrders: orders.totalOrders,
        displayOrderPieChart: [{ item: "Cancelled Order", value: orders.cancelledOrder }, { item: "Total Order", value: orders.totalOrders }]
      });
    });

    // console.log("******orders***", orders);

    Meteor.call("getAllProducts", function (err, data) {
      data.map(item => {
        arrNew.push(item);
      });
    });
    self.setState({ productArray: arrNew });
  }

  // Handle searching for item on the table
  handleSearchItem = (searchEvent) => {
    const id = searchEvent.target.id;
    const value = searchEvent.target.value;

    if (id === "salesReport") {
      this.setState({
        searchItem: value
      });
    } else if (id === "inventoryReport") {
      this.setState({
        searchItem: value
      });
    }
  }

  // Handle change in date
  handleChangeDate = (dateEvent) => {
    const dateId = dateEvent.target.id;
    const dateValue = dateEvent.target.value;
    if (dateId === "startDateSearch") {
      this.setState({
        fromDate: new Date(dateValue)
      });
    }
    if (dateId === "endDateSearch") {
      this.setState({
        toDate: new Date(dateValue)
      });
    }
    let orders;
    const self = this;
    Meteor.call("getOrdersFromDb", {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate
    }, function (err, data) {
      orders = GetHelper(data);
      window.console.log(orders);
      self.setState({
        displaySales: orders.totalSalesHistory,
        productSales: orders.analytics,
        totalSales: orders.totalSales,
        cancelledOrder: orders.cancelledOrder,
        totalPurchasedProduct: orders.totalPurchasedProduct,
        totalOrders: orders.totalOrders,
        displayOrderPieChart: [{ item: "Cancelled Order", value: orders.cancelledOrder }, { item: "Total Order", value: orders.totalOrders }]
      });
    });
  }

  // Handle displaying of chart on the page
  handleDisplayChart = (event) => {
    const id = event.target.id;
    if (id === "totalSales") {
      this.setState({
        displaySalesChart: false,
        displayOrderChart: false,
        displayCancelledOrder: false,
        displayPurchaseProduct: false,
        showSalesChart: true,
        displayPieChart: false
      });
    } else if (id === "cancelledOrder") {
      this.setState({
        displaySalesChart: false,
        displayOrderChart: false,
        displayCancelledOrder: false,
        displayPurchaseProduct: false,
        showSalesChart: false,
        displayPieChart: true
      });
    } else if (id === "purchasedProduct") {
      this.setState({
        displaySalesChart: false,
        displayOrderChart: false,
        displayCancelledOrder: false,
        displayPurchaseProduct: true,
        showSalesChart: false,
        displayPieChart: false
      });
    } else if (id === "totalOrders") {
      this.setState({
        displaySalesChart: false,
        displayOrderChart: false,
        displayCancelledOrder: true,
        displayPurchaseProduct: false,
        showSalesChart: false,
        displayPieChart: false
      });
    }
  }


  // Handle toggling between showing a label whenever a mouse is not hovered on an icon
  handleMouseOut = (event) => {
    this.setState({ tooltipIsOpen: false });
    if (event.target.id === "tooltipOverview") {
      this.setState({ tooltipIsOpen: false });
    } else if (event.target.id === "tooltipSalesReport") {
      this.setState({ tooltipIsOpenSales: false });
    } else if (event.target.id === "tooltipInventoryReport") {
      this.setState({ tooltipIsOpenInventory: false });
    }
    // console.log("mouseout");
  }

  handleMouseOver = (event) => {
    if (event.target.id === "tooltipOverview") {
      this.setState({ tooltipIsOpen: true });
    } else if (event.target.id === "tooltipSalesReport") {
      this.setState({ tooltipIsOpenSales: true });
    } else if (event.target.id === "tooltipInventoryReport") {
      this.setState({ tooltipIsOpenInventory: true });
    }
  }

  handleSelectRetailerDashBord = () => {
    this.setState({
      selectReportTab: "ShowRetailerDashBoard",
      reportTitle: "Summary",
      setOverviewActive: true,
      setSalesActive: false,
      setInventoryActive: false
    });
  }
  handleSelectSalesReport = () => {
    this.setState({
      selectReportTab: "ShowSalesReport",
      reportTitle: "Sales Report",
      setOverviewActive: false,
      setSalesActive: true,
      setInventoryActive: false,
      setPerformanceActive: false
    });
  }
  handleSelectInventoryReport = () => {
    this.setState({
      selectReportTab: "ShowInventory",
      reportTitle: "Data and Inventory Report",
      setOverviewActive: false,
      setSalesActive: false,
      setInventoryActive: true,
    });
  }

  render() {
    return (
      <div className="rc-container">
        <div className="rc-sidenav" >
          <Sidebar
            handleSelectRetailerDashBord = {this.handleSelectRetailerDashBord}
            handleSelectSalesReport = {this.handleSelectSalesReport}
            handleSelectInventoryReport = {this.handleSelectInventoryReport}
            handlePerformanceReport = {this.handlePerformanceReport}
            handleMouseout = {this.handleMouseOut}
            handleMouseOver = {this.handleMouseOver}
            tooltipIsOpen = {this.state.tooltipIsOpen}
            tooltipIsOpenSales = {this.state.tooltipIsOpenSales}
            tooltipIsOpenInventory = {this.state.tooltipIsOpenInventory}
            tooltipIsOpenPerformance = {this.state.tooltipIsOpenPerformance}
            setOverviewActive = {this.state.setOverviewActive}
            setSalesActive = {this.state.setSalesActive}
            setInventoryActive = {this.state.setInventoryActive}

          />
        </div>
        <div className="rc-content">
          <DateInput
            id = "startDateSearch"
            dateTitle="From"
            handleChangeDate = {this.handleChangeDate}
          />
          <DateInput
            id="endDateSearch"
            dateTitle="To"
            handleChangeDate = {this.handleChangeDate}
          />
          <Overview
            selectedReport = {this.state.selectReportTab}
            totalSales = {this.state.totalSales}
            cancelledOrder = {this.state.cancelledOrder}
            totalPurchasedProduct = {this.state.totalPurchasedProduct}
            totalOrders = {this.state.totalOrders}
            salesArray = {this.state.productSales}
            handleDisplayChart = {this.handleDisplayChart}
            displaySalesChart = {this.state.displaySalesChart}
            displayOrderChart = {this.state.displayOrderChart}
            displayCancelledOrder = {this.state.displayCancelledOrder}
            displayPurchaseProduct = {this.state.displayPurchaseProduct}
            displaySales = {this.state.displaySales}
            showSalesChart = {this.state.showSalesChart}
            pieChartData = {this.state.displayOrderPieChart}
            displayPieChart = {this.state.displayPieChart}

          />
          <SalesReport
            selectedReport = {this.state.selectReportTab}
            salesArray = {this.state.productSales}
            handleSearchItem = {this.handleSearchItem}
            searchItem = {this.state.searchItem}

          />
          <InventoryReport
            selectedReport = {this.state.selectReportTab}
            productArray = {this.state.productArray}
            searchProduct = {this.state.searchItem}
            handleSearchItem = {this.handleSearchItem}
          />
        </div>


      </div>
    );
  }
}
registerComponent("Report", Report);
export default Report;
