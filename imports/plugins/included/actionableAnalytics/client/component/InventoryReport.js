/* eslint-disable */
import React from "react";
import SearchInput from "./searchInput/SearchInput";
import { formatPriceString } from "/client/api";

import { registerComponent } from "@reactioncommerce/reaction-components";

export const InventoryReport = ({ searchProduct, selectedReport, productArray, handleSearchItem }) => {
  const searchArr = [];
  let noRecord = false;

  // Search for a product
  const searchSales = new RegExp(searchProduct.toLowerCase());
  productArray.map(item => {
    if (searchSales.test(item.title.toLowerCase())) {
      searchArr.push(item);
    }
  });

  // Check if the product does not exist in the database
  if (searchArr.length === 0) {
    noRecord = true;
  }

  // Populate the product on the table
  const populateRow = searchArr.map(eachProduct => {
    // console.log("****product", eachProduct);
    return (<tr key={eachProduct._id}>
      <td>{eachProduct.title}</td>
      <td>{eachProduct.price ? formatPriceString(eachProduct.price) : formatPriceString(0)}</td>
      <td>{eachProduct.width ? eachProduct.width : 0}</td>
      <td>{eachProduct.inventoryQuantity ? eachProduct.inventoryQuantity : 0}</td>
      <td>{eachProduct.height ? eachProduct.height : 0}</td>
      <td>{eachProduct.weight ? eachProduct.weight : 0}</td>
      <td>{eachProduct.length ? eachProduct.length : 0}</td>
      <td>{eachProduct.originCountry ? eachProduct.originCountry : "Not Available"}</td>
    </tr>);
  });

  return (
    <div className="container" style= {{ display: selectedReport === "ShowInventory" ? "block" : "none" }}>

      <h1 className="text-center"> Data and Inventory </h1>
      <SearchInput
        id="inventoryReport"
        handleSearchItem = {handleSearchItem}
      />
      <table className="table table-striped table-responsive table-bordered">
        <thead className="thead-color">
          <tr className="text-center">
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Width</th>
            <th scope="col">Quantity</th>
            <th scope="col">Height</th>
            <th scope="col">Weight</th>
            <th scope="col">Length</th>
            <th scope="col">Origin Country</th>

          </tr>
        </thead>
        <tbody>
          {!noRecord && populateRow}
        </tbody>
      </table>
      {noRecord && (<p>Product does not exist</p>)}
    </div>


  );
};

registerComponent("InventoryReport", InventoryReport);
export default InventoryReport;
