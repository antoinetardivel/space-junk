import React from "react";

const FastFilter = ({ onResultClick }) => {
  return (
    <div>
      <div className={"FastFilter"}>
        <h2>Filter Orbit: </h2>

        <div
          className={"Result FastFilterItem"}
          onClick={(e) => onResultClick && onResultClick("LOE")}
        >
          <span>LOE</span>
        </div>

        <div
          className={"Result FastFilterItem"}
          onClick={(e) => onResultClick && onResultClick("MOE")}
        >
          <span>MOE</span>
        </div>

        <div
          className={"Result FastFilterItem"}
          onClick={(e) => onResultClick && onResultClick("HOE")}
        >
          <p>
            <span>HOE</span>
          </p>
        </div>

        <div
          className={"Result FastFilterItem"}
          onClick={(e) => onResultClick && onResultClick("ALL")}
        >
          <p>
            <span>ALL</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FastFilter;
