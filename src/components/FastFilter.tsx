import React from "react";
interface IFastFilter {
  onResultClick: (result: string) => void;
}
const FastFilter: React.FC<IFastFilter> = ({ onResultClick }) => {
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
