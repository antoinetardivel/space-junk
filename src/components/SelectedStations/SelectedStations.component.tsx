import React from "react";
import { IStation } from "../../types/models";
import SelectedStation from "./SelectedStation/SelectedStation.component";
import styles from "./SelectedStations.module.scss";
import separator from "../../assets/designElements/separator.svg";
interface ISelectedStations {
  selected: IStation[];
  onRemoveStation: (station: IStation) => void;
  onRemoveAll: () => void;
  onStationClick: (station: any) => void;
}

const SelectedStations: React.FC<ISelectedStations> = ({
  selected,
  onRemoveStation,
  onRemoveAll,
  onStationClick,
}) => {
  if (!selected || selected.length === 0) return null;

  return (
    <div className={styles.selected}>
      <img className={styles.separator} src={separator} alt="" />
      <h4 className={styles.optionTitle}>Selected</h4>
      {selected.map((station, i) => {
        return (
          <SelectedStation
            station={station}
            onRemoveClick={onRemoveStation}
            onClick={onStationClick}
          />
        );
      })}
      <div className={styles.flexRemoveButton}>
        <button className={styles.removeAll} onClick={onRemoveAll}>
          Clear all
        </button>
        <p>
          {selected.length} orbiting object{selected.length > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default SelectedStations;
