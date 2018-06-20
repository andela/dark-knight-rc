import React from "react";

import Chart from "./charts/Charts";
import { registerComponent } from "@reactioncommerce/reaction-components";

export const PerformanceReport = ({ selectedReport, salesArray }) => {
  const covObjArr = [];

  Object.keys(salesArray).map((key) => {
    covObjArr.push(salesArray[key]);
  });
  return (
    <div style= {{ display: selectedReport === "ShowPerformanceReport" ? "block" : "none" }}>
      <h1 className="text-center mb-3"> Product Performance</h1>
      <Chart data={covObjArr}/>
    </div>
  );
};

registerComponent("PerformanceReport", PerformanceReport);
export default PerformanceReport;
