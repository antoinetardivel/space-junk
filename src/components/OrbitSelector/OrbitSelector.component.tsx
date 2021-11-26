import React from "react";
import InterfaceButton from "../InterfaceButton/InterfaceButton.component";
import styles from "./OrbitSelector.module.scss";

interface IOrbitSelector {
  selectOrbit: (result: string) => void;
  currentOrbit: string;
}
const OrbitSelector: React.FC<IOrbitSelector> = ({
  selectOrbit,
  currentOrbit,
}) => {
  const orbits = ["LEO", "MEO", "HOE", "ALL"];
  const handleClick = (orbit: string) => {
    selectOrbit(orbit);
  };
  return (
    <div className={styles.orbit}>
      <h4 className={styles.optionTitle}>Orbit</h4>
      <div className={styles.orbitSection}>
        {orbits.map((orbit, index) => {
          return (
            <span key={orbit + `${index}`}>
              <InterfaceButton
                isActive={orbit === currentOrbit}
                value={orbit}
                onClick={handleClick}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default OrbitSelector;
