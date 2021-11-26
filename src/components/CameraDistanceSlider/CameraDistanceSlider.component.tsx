import { useEffect, useRef } from "react";
import styles from "./CameraDistanceSlider.module.scss";

interface ICameraDistanceSlider {
  distance: number;
  setDistance: (distance: number) => void;
}

const CameraDistanceSlider: React.FC<ICameraDistanceSlider> = ({
  distance,
  setDistance,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = `${distance - 7371}`;
  }, [distance]);
  const handleChangeDistance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(parseInt(e.target.value));
  };
  return (
    <div className={styles.distance}>
      <h4 className={styles.optionTitle}>Distance</h4>
      <div className={styles.distanceSliderContainer}>
        {/* <img src={roudedDottedLines} className={styles.dottedLines} alt="" /> */}
        <svg
          width="252"
          height="3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.dottedLines}
        >
          <path
            d="M.55 2.5a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.014-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.014-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.014-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.014-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.014-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.101 2a1 1 0 0 0 0-2v2Zm4.014-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 1 0 0-2v2Zm4.015-2a1 1 0 0 0 0 2v-2Zm.1 2a1 1 0 0 0 0-2v2Zm4.015-2a1 1 0 1 0 0 2v-2ZM.5 2.5h.05v-2H.5v2Zm4.065 0h.1v-2h-.1v2Zm4.114 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.114 0h.101v-2h-.101v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.1v-2h-.1v2Zm4.115 0h.05v-2h-.05v2Z"
            fill="url(#a)"
          />
          <defs>
            <linearGradient
              id="a"
              x1="248.5"
              y1="1.998"
              x2="0"
              y2="1.998"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" stopOpacity="0" />
              <stop
                offset={Math.abs(1 - ((distance - 7371) * 100) / 120000 / 100)}
                stopColor="#fff"
              />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <input
          className={styles.selectDistance}
          onChange={(e) => handleChangeDistance(e)}
          value={distance}
          type={"range"}
          min={7371}
          max={127371}
        ></input>
      </div>
      <p className={styles.displayDistance}>
        height: {Math.round(distance - 7371)} km
      </p>
    </div>
  );
};
export default CameraDistanceSlider;
