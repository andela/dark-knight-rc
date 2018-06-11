import React from "react";

const DateInput = ({ dateTitle, handleChangeDate, id }) => {
  return (
    <div className="input-group date-input">
      <span className="input-group-addon add-theme-color">
        {dateTitle}</span>
      <input id={id}
        type="date"
        className="form-control"
        name="date"
        onChange={handleChangeDate}
      />
      <span className="input-group-addon add-theme-color">
        <i className="fa fa-calendar" /></span>
    </div>
  );
};

export default DateInput;
