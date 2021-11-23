import React from "react";
import { totalObjects } from "../types/models";

interface IInfo {
  totalObjects: totalObjects;
}

const Info: React.FC<IInfo> = ({ totalObjects }) => {
  return (
    <div className="Info">
      <h1>Satellite tracker</h1>
      <p>Total objects: {totalObjects}</p>
    </div>
  );
};

export default Info;
