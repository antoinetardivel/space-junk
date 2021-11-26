import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-web";
import styles from "./DigDataButton.module.scss";
import globe from "../../assets/designElements/globet.gif";

interface IDigDataButton {
  setIsDataOpened: (state: boolean) => void;
}

const DigDataButton: React.FC<IDigDataButton> = ({ setIsDataOpened }) => {
  const contRef = useRef<HTMLDivElement | null>(null);
  const [animation, setAnimation] = useState<any>(null);
  useEffect(() => {
    setAnimation(
      Lottie.loadAnimation({
        container: contRef.current as any, // the dom element that will contain the animation
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/lottie/digData.json", // the path to the animation json
      })
    );
  }, []);
  return (
    <div
      className={styles.digDataButtonContainer}
      onMouseEnter={() => {
        animation.setDirection(1);
        animation.play();
      }}
      onMouseLeave={() => {
        animation.setDirection(-1);
        animation.play();
      }}
      onClick={() => setIsDataOpened(true)}
    >
      <div className={styles.animCont}>
        <div className={styles.globeCont} ref={contRef}>
          <img src={globe} alt="" className={styles.globe} />
        </div>
        <p className={styles.textButton}>Dig Data</p>
      </div>
    </div>
  );
};

export default DigDataButton;
