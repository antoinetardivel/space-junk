import React from "react";

const Info = ({ totalObjects }) => {
  return (
    <div className="Info">
      <h1>Satellite tracker</h1>
      <p>Total objects: {totalObjects}</p>
    </div>
  );
};

export default Info;
