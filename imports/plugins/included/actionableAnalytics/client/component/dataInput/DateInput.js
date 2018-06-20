import React from "react";

const DateInput = ({ dateTitle }) => {
  return (
    <div className="input-group date-input">
      <span className="input-group-addon add-theme-color">
        {dateTitle}</span>
      <input id="date" type="date" className="form-control" name="date"
      />
      <span className="input-group-addon add-theme-color">
        <i className="fa fa-calendar" /></span>
    </div>
  );
};

export default DateInput;
