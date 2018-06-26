/* eslint-disable */
import React from "react";

const DisplayReportCard = ({ title, id, amount, ReportIcon, handleDisplayChart }) => {
  return (
    <div className="rc-card"

      onClick={handleDisplayChart}
    >
      <div className="row adjust-card-side-image">
        <div className="col-md-6 adjust-card-bg">
          <a
            id={id}
            className={ReportIcon}
          />
        </div>
        <div className="col-md-6">
          {title}
          <hr/>
          <div className="card-container">
            <h3><strong> {amount} </strong></h3>
          </div>

        </div>

      </div>

    </div>

  );
};

export default DisplayReportCard;
