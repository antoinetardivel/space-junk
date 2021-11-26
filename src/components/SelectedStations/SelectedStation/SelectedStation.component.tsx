import { IStation } from "../../../types/models";
import styles from "./SelectedStation.module.scss";
import cross from "../../../assets/designElements/cross.svg";

interface ISelectedStation {
  station: IStation;
  onClick: (station: IStation) => void;
  onRemoveClick: (station: IStation) => void;
  className?: string;
}

const SelectedStation: React.FC<ISelectedStation> = ({
  station,
  onClick,
  onRemoveClick,
  className,
}) => {
  return (
    <div
      className={[styles.selected, className || ""].join(" ")}
      onClick={(e) => onClick && onClick(station)}
    >
      <p>{station.name}</p>
      <button className={styles.cross}>
        <img
          src={cross}
          alt=""
          className={styles.crossIcon}
          onClick={(e) => onRemoveClick(station)}
        />
      </button>
    </div>
  );
};
export default SelectedStation;
