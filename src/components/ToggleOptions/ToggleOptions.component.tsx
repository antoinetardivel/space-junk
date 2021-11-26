import { useState } from "react";
import styles from "./ToggleOptions.module.scss";

interface IToggleOptions {
  state: boolean;
  toggleState: () => void;
}

const ToggleOptions: React.FC<IToggleOptions> = ({ state, toggleState }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <div
      className={styles.toggleContainer}
      style={{
        width: state ? "14px" : "37px",
        marginRight: state ? "-34px" : "-57px",
      }}
    >
      <div
        className={[
          styles.toggleBorder,
          state ? styles.toggleBorderEx : styles.toggleBorderNEx,
        ].join(" ")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => toggleState()}
      >
        <div
          className={[
            styles.toggleInner,
            state ? styles.toggleInnerEx : styles.toggleInnerNEx,
          ].join(" ")}
        >
          <p
            className={[
              styles.optionsTextNEx,
              !state ? styles.optionsTextEX : "",
            ].join(" ")}
          >
            OPTIONS
          </p>
        </div>
      </div>
      <svg
        width="4"
        height="6"
        viewBox="0 0 4 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={state ? styles.arrowEx : styles.arrowNEx}
      >
        <path
          d="M3 1L1 3L3 5"
          stroke={isHovered ? "white" : "white"}
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};
export default ToggleOptions;
