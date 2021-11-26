import { useState } from "react";
import styles from "./OnlySelected.module.scss";

interface IOnlySelected {
  state: boolean;
  setState: (state: boolean) => void;
}

const OnlySelected: React.FC<IOnlySelected> = ({ state, setState }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <div className={styles.onlySelectedContainer}>
      <p>Show only selected satellites:</p>
      <div
        className={styles.checkBox}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setState(!state)}
      >
        {state && <Checked color={isHovered ? "black" : "white"} />}
        {!state && <NotChecked color={isHovered ? "black" : "white"} />}
      </div>
    </div>
  );
};
export default OnlySelected;

interface IChecked {
  color: string;
}
const Checked: React.FC<IChecked> = ({ color }) => {
  return (
    <svg
      width="9"
      height="7"
      viewBox="0 0 11 8"
      fill="none"
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 3.5L4.5 7L10.5 1" stroke={color} />
    </svg>
  );
};

const NotChecked: React.FC<IChecked> = ({ color }) => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 11 11"
      fill="none"
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L10 10M1 10L10 1" stroke={color} />
    </svg>
  );
};
