import React from "react";
import { totalObjects } from "../../types/models";

interface ISatelliteNumber {
  totalObjects: totalObjects;
}

const SatelliteNumber: React.FC<ISatelliteNumber> = ({ totalObjects }) => {
  return (
    <div>
      <h1>spacejunk</h1>
      <p>Total objects: {totalObjects}</p>
    </div>
  );
};

export default SatelliteNumber;
