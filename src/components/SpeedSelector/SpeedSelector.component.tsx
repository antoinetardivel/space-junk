import InterfaceButton from "../InterfaceButton/InterfaceButton.component";
import styles from "./SpeedSelector.module.scss";

interface ISpeedSelector {
  selectSpeed: (speed: number) => void;
  currentSpeed: number;
}

const SpeedSelector: React.FC<ISpeedSelector> = ({
  selectSpeed,
  currentSpeed,
}) => {
  const handleClick = (speed: string) => {
    selectSpeed(parseInt(speed.substring(1)));
  };
  const speeds = [1, 10, 100];
  return (
    <div className={styles.speed}>
      <h4 className={styles.optionTitle}>Speed</h4>
      <div className={styles.speedSection}>
        {speeds.map((speed, index) => {
          return (
            <span key={speed + `${index}`}>
              <InterfaceButton
                isActive={currentSpeed === speed}
                value={`X${speed}`}
                onClick={handleClick}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SpeedSelector;
