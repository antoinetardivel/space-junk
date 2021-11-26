import React from "react";
import { IStation } from "../../types/models";
import styles from "./SateliteDatas.module.scss";
import cross from "../../assets/designElements/cross.svg";

interface ISateliteDatas {
  isVisible: boolean;
  stationsInventory: IStation[];
  selectedStations: IStation[];
  closeSatelliteData: (station: IStation) => void;
}

const SateliteDatas: React.FC<ISateliteDatas> = ({
  isVisible,
  stationsInventory,
  selectedStations,
  closeSatelliteData,
}) => {
  return (
    <div className={styles.satellitesDatas}>
      {selectedStations.length > 0 && (
        <h4 className={styles.sectionContainer}>Selected</h4>
      )}
      <div className={styles.allSatellitesDatas}>
        {selectedStations &&
          stationsInventory &&
          selectedStations.map((station, index) => {
            return (
              <div
                className={styles.satelitteCard}
                key={stationsInventory[index]?.name + `${index}`}
              >
                <div className={styles.satelitteCardInner}>
                  <div className={styles.satelitteCardHeader}>
                    <button
                      className={styles.cross}
                      onClick={() => closeSatelliteData(station)}
                    >
                      <img src={cross} alt="" className={styles.crossIcon} />
                    </button>
                    <p className={styles.satelitteName}>
                      {stationsInventory[index]?.name
                        ? stationsInventory[index]?.name
                        : selectedStations[index].name}
                    </p>
                  </div>
                  <div className={styles.satelitteContent}>
                    <div className={styles.satelitteDataLine}>
                      <p className={styles.dataName}>Country</p>
                      <p className={styles.dataContent}>
                        {stationsInventory[index]?.country_owner || "No data"}
                      </p>
                    </div>
                    <div className={styles.satelitteDataLine}>
                      <p className={styles.dataName}>Apogee</p>
                      <p className={styles.dataContent}>
                        {stationsInventory[index]?.apogee || "No data"}
                      </p>
                    </div>
                    <div className={styles.satelitteDataLine}>
                      <p className={styles.dataName}>Period</p>
                      <p className={styles.dataContent}>
                        {stationsInventory[index]?.period || "No data"}
                      </p>
                    </div>
                    <div className={styles.satelitteDataLine}>
                      <p className={styles.dataName}>Date Of Launch</p>
                      <p className={styles.dataContent}>
                        {stationsInventory[index]?.date_of_launch
                          ? stationsInventory[index]?.date_of_launch
                          : "No data"}
                      </p>
                    </div>
                    <div className={styles.satelitteDataLine}>
                      <p className={styles.dataName}>Expected Lifetime</p>
                      <p className={styles.dataContent}>
                        {stationsInventory[index]?.expected_lifetime
                          ? stationsInventory[index]?.expected_lifetime +
                            " years"
                          : "No data"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SateliteDatas;
