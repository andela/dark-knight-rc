import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { Tooltip } from "/imports/plugins/core/ui/client/components";

export const Sidebar = (props) => {
  const tooltipIsOpen = props.tooltipIsOpen;
  const tooltipIsOpenSales = props.tooltipIsOpenSales;
  const tooltipIsOpenInventory = props.tooltipIsOpenInventory;
  const tooltipIsOpenPerformance = props.tooltipIsOpenPerformance;
  const tooltipOverview = (tooltipIsOpen && <span>{"Overview"}</span>);
  const tooltipSalesReport = (tooltipIsOpenSales && <span>{"Sales"}</span>);
  const tooltipInventoryReport = (tooltipIsOpenInventory && <span>{"Data and Inventory"}</span>);
  const tooltipPerformanceReport = (tooltipIsOpenPerformance && <span>{"Product Performance"}</span>);

  return (
    <div className="sidebar-drawer container">

      <div className="list-group" id="list-tab" role="tablist">

        <a className= {`list-icons rc-btn rc-tooltip ${props.setOverviewActive ? "active" : ""}`}
          id="list-home-list"
          href="#list-home"
          role="tab" aria-controls="home"
          id = "tooltipOverview"
          onClick={props.handleSelectRetailerDashBord}
          onMouseOut={props.handleMouseout}
          onMouseOver = {props.handleMouseOver}

        >
          <Tooltip tooltipContent={tooltipOverview}  attachment={"middle left"}>
            <i className="fa fa-calculator"/>
            {/* <span className="rc-tooltiptext">Overview</span> */}
          </Tooltip>
        </a>

        <a className={`list-icons rc-btn rc-tooltip ${props.setSalesActive ? "active" : ""}`}
          id="list-home-list"
          role="tab" aria-controls="home"
          id = "tooltipSalesReport"
          onClick={props.handleSelectSalesReport}
          onMouseOut={props.handleMouseout}
          onMouseOver = {props.handleMouseOver}
        >
          <Tooltip tooltipContent={tooltipSalesReport} attachment={"middle left"}>
            <i className="fa fa-dollar"/>
            {/* <span className="rc-tooltiptext">Sales</span> */}
          </Tooltip>
        </a>

        <a className={`list-icons rc-btn rc-tooltip ${props.setInventoryActive ? "active" : ""}`}
          id="list-home-list" href="#list-home"
          role="tab" aria-controls="home"
          id = "tooltipInventoryReport"
          onClick = {props.handleSelectInventoryReport}
          onMouseOut={props.handleMouseout}
          onMouseOver = {props.handleMouseOver}
        >
          <Tooltip tooltipContent={tooltipInventoryReport} attachment={"middle left"}>
            <i className="fa fa-briefcase"/>
            {/* <span className="rc-tooltiptext">Data and Inventory</span> */}
          </Tooltip>
        </a>
      </div>
    </div>
  );
};
registerComponent("Sidebar", Sidebar);
export default Sidebar;
