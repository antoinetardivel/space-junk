import React from "react";
import { StationPreview } from "./SearchResults";

const SelectedStations = ({
  selected,
  onRemoveStation,
  onRemoveAll,
  onStationClick,
}) => {
  if (!selected || selected.length === 0) return null;

  return (
    <div className="Selected">
      <h2>Selected</h2>
      <p className="SmallButton" onClick={onRemoveAll}>
        Clear all
      </p>
      {selected.map((station, i) => {
        return (
          <StationPreview
            station={station}
            key={station.name + i}
            onRemoveClick={onRemoveStation}
            onClick={onStationClick}
          />
        );
      })}
    </div>
  );
};

export default SelectedStations;
