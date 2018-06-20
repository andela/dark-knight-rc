/* eslint-disable */
import React from "react";
import SearchInput from "./searchInput/SearchInput";
import { formatPriceString } from "/client/api";
import { registerComponent } from "@reactioncommerce/reaction-components";

export const SalesReport = ({ selectedReport, salesArray, handleSearchItem, searchItem }) => {
  const covObjArr = [];
  const searchArr = [];
  let noRecord = false;

  // convert object array into array of object
  Object.keys(salesArray).map((key) => {
    covObjArr.push(salesArray[key]);
  });
  // Search for a product
  const searchSales = new RegExp(searchItem.toLowerCase());
  covObjArr.map(item => {
    if (searchSales.test(item.product.toLowerCase())) {
      searchArr.push(item);
    }
  });

  // Check if the product does not exist in the database
  if (searchArr.length === 0) {
    noRecord = true;
  }

  // Populate the sale table row
  const populateRow = searchArr.map((eachProduct, key) => {
    return (<tr key={key}>
      <td>{eachProduct.product}</td>
      <td>{eachProduct.quantitySold ? eachProduct.quantitySold : 0}</td>
      <td>{eachProduct.price ? formatPriceString(eachProduct.price) : formatPriceString(0)}</td>
    </tr>);
  });

  return (
    <div className="container" style= {{ display: selectedReport === "ShowSalesReport" ? "block" : "none" }}>
      {/* <DateInput dateTitle="From" className="adjust-top-margin"/>
      <DateInput dateTitle="To"/> */}
      <h1 className="text-center"> Sales</h1>
      <SearchInput
        id="salesReport"
        handleSearchItem = {handleSearchItem}

      />
      <table className="table table-striped table-responsive table-bordered">
        <thead className="thead-color">
          <tr className="text-center">
            <th scope="col">Product</th>
            <th scope="col">Quantity Sold</th>
            <th scope="col">Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {!noRecord && populateRow}

        </tbody>
      </table>
      {noRecord && (<p>Record does not exist</p>)}
    </div>
  );
};

registerComponent("SalesReport", SalesReport);
export default SalesReport;
