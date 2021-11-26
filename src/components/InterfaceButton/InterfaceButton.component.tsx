import { MouseEvent } from "react";
import styles from "./InterfaceButton.module.scss";

interface IInterfaceButton {
  value: string;
  isActive: boolean;
  onClick: (speed: string) => void;
}

const InterfaceButton: React.FC<IInterfaceButton> = ({
  value,
  onClick,
  isActive,
}) => {
  const handleClick = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    onClick(value);
  };
  return (
    <button
      className={styles.selectorButton}
      onClick={(e) => handleClick(e)}
      style={{ borderColor: isActive ? "#001EF0" : "white" }}
    >
      {value}
    </button>
  );
};

export default InterfaceButton;
