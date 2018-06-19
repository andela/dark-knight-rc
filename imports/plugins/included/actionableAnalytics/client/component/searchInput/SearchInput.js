import React from "react";

const SearchInput = ({ id, handleSearchItem }) => {
  return (
    <div className="input-group search-dialog">
      <span className="input-group-addon add-theme-color">
        Search</span>
      <input

        id={id}
        type="search"
        className="form-control"
        name="product"
        onChange = {handleSearchItem}
        placeholder="Search a Product"
      />
      <span className="input-group-addon add-theme-color">
        <i className="fa fa-search" /></span>
    </div>

  );
};

export default SearchInput;
