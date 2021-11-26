import styles from "./DataPage.module.scss";
import satellite from "../../assets/designElements/satellite.svg";
import cornerStar from "../../assets/designElements/cornerStar.svg";
import asteriskIcon from "../../assets/designElements/asteriskIcon.svg";
import roundedGraphic from "../../assets/designElements/roundedGraphic.svg";
import countryGraphic from "../../assets/designElements/countryGraphic.svg";
import numberRocket from "../../assets/designElements/numberRocket.svg";
import needles from "../../assets/designElements/needles.svg";
import end from "../../assets/designElements/end.svg";
import DigDataButton from "../../components/DigDataButton/DigDataButton.component";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface IDataPage {
  setIsDataOpened: (state: boolean) => void;
  margin: number;
  isDisplayed: boolean;
}

const DataPage: React.FC<IDataPage> = ({
  setIsDataOpened,
  margin,
  isDisplayed,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isDisplayed) {
      gsap.to(contentRef.current, {
        marginTop: "0px",
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(containerRef.current, { zIndex: 2, ease: "power2.out" });
      // contentRef.current?.addEventListener("scroll", (e) => console.log(e));
    } else {
      gsap.to(contentRef.current, {
        marginTop: "calc(100vh + 300px)",
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(containerRef.current, {
        zIndex: -1,
        delay: 2,
        ease: "power2.out",
      });
    }
  }, [isDisplayed]);
  return (
    <>
      <div className={styles.dataPageLayout} ref={containerRef}>
        <div className={styles.dataPageContainer} ref={contentRef}>
          <div className={styles.banner}>
            <div className={styles.demiBG}></div>
            <img src="/transition.png" alt="" className={styles.bannerImage} />
          </div>
          <>
            <DigDataButton setIsDataOpened={() => setIsDataOpened(false)} />
            <p className={styles.section1}>
              Junk – n. material that is no longer working or useful.
              <br />
              Which defines 75% of Earth’s satellites.
            </p>
            <div className={styles.section2}>
              <img
                src={satellite}
                alt="Satellite"
                className={styles.satellite}
              />
              <div className={styles.divCornerCont1}>
                <img src={cornerStar} alt="" className={styles.cornerStar} />
                <div className={styles.divBorderCorner}>
                  <div className={styles.divBorderCornerInner}>
                    <h2>Space traffic and debris</h2>
                    <p className={styles.section2P}>
                      As more <span className={styles.bold}>satellites</span>{" "}
                      are launched into{" "}
                      <span className={styles.bold}>orbit</span> in the coming
                      decades, the number of{" "}
                      <span className={styles.bold}>collisions</span> and
                      subsequent{" "}
                      <span className={styles.bold}>space debris</span>
                      are likely to soar. There are already at least{" "}
                      <span className={styles.bold}>
                        128 000 000 pieces of debris
                      </span>{" "}
                      in LEO*. Of those, around{" "}
                      <span className={styles.bold}>34,000</span> are{" "}
                      <span className={styles.bold}>over 10 centimeters</span>.
                    </p>
                    <hr className={styles.hrDashed} />
                    <p className={styles.asterisk}>
                      * Low Earth Orbit, between 500km to 2000km altitude.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section3}>
              <div
                className={styles.infoCard}
                style={{ gridColumn: "2/5", marginTop: "125px" }}
              >
                <p className={styles.infoCard1p}>
                  Estimated number of break-ups, explosions, collisions, or
                  anomalous events resulting in fragmentation
                </p>
                <p className={styles.infoCard2p}>
                  <span className={styles.bold}>More than 630 </span>
                  <img
                    src={asteriskIcon}
                    alt=""
                    className={styles.asteriskIcon}
                  />
                </p>
              </div>
              <div
                className={styles.infoCard}
                style={{ gridColumn: "4/7", marginTop: "30px" }}
              >
                <p className={styles.infoCard1p}>
                  Number of rocket launches since the start of the space age in
                  1957
                </p>
                <p className={styles.infoCard2p}>
                  <span className={styles.bold}>About 6120</span> (excluding
                  failures)
                </p>
              </div>
              <div
                className={styles.infoCard}
                style={{ gridColumn: "5/8", marginTop: "144px" }}
              >
                <p className={styles.infoCard1p}>
                  Number of debris objects estimated by statistical models to be
                  in orbit
                </p>
                <p className={styles.infoCard2p}>
                  <span className={styles.bold}>36 500 objects</span> greater
                  than 10 cm{" "}
                  <span className={styles.bold}>1 000 000 objects</span> from
                  greater than 1 cm to 10 cm{" "}
                  <span className={styles.bold}>330 000 000 objects</span> from
                  greater than 1 mm to 1 cm
                </p>
              </div>
              <div
                className={styles.infoCard}
                style={{ gridColumn: "7/10", marginTop: "70px" }}
              >
                <p className={styles.infoCard1p}>
                  Number of satellite still functionning
                </p>
                <p className={styles.infoCard2p}>
                  <span className={styles.bold}>About 4800</span>
                </p>
              </div>
              <div
                className={styles.infoCard}
                style={{ gridColumn: "8/11", marginTop: "0px" }}
              >
                <p className={styles.infoCard1p}>
                  Number of satellites these rocket launches have placed into
                  Earth orbit
                </p>
                <p className={styles.infoCard2p}>
                  <span className={styles.bold}>About 12170</span>
                </p>
              </div>
              <div
                className={styles.infoCard}
                style={{ gridColumn: "8/11", marginTop: "155px" }}
              >
                <p className={styles.infoCard1p}>
                  Number of debris objects regularly tracked by Space
                  Surveillance Networks and maintained in their catalogue
                </p>
                <p className={styles.infoCard2p}>
                  <span className={styles.bold}>About 29710</span>
                </p>
              </div>
              <div
                className={styles.infoCard}
                style={{ gridColumn: "10/13", marginTop: "215px" }}
              >
                <p className={styles.infoCard1p}>
                  Number of satellite still in orbit
                </p>
                <p className={styles.infoCard2p}>
                  <span className={styles.bold}>About 7630</span>
                </p>
              </div>
              <div
                className={styles.infoCard}
                style={{ gridColumn: "11/14", marginTop: "60px" }}
              >
                <p className={styles.infoCard1p}>
                  Total mass of all space objects in Earth orbit
                </p>
                <p className={styles.infoCard2p}>
                  <span className={styles.bold}>More than 9600 tonnes</span>
                </p>
              </div>
            </div>
            <div className={styles.section4}>
              <div className={styles.divCornerCont2}>
                <img src={cornerStar} alt="" className={styles.cornerStar} />
                <div className={styles.divBorderCorner}>
                  <div className={styles.divBorderCornerInner}>
                    <h2>
                      Russian missile creates space debris threatening ISS and
                      other satellites
                    </h2>
                    <hr className={styles.hrDashed} />
                    <p className={[styles.section2P, styles.mb120].join(" ")}>
                      Early this week,{" "}
                      <span className={styles.bold}>
                        Russia launched a missile
                      </span>{" "}
                      that destroyed the country’s Kosmos 1408 satellite, a
                      large spacecraft that orbited the Earth roughly{" "}
                      <span className={styles.bold}>300 miles up</span>. The
                      breakup of the satellite created at least 1,500 pieces of
                      trackable fragments, according to the US State Department,
                      as well as{" "}
                      <span className={styles.bold}>
                        thousands of smaller pieces
                      </span>{" "}
                      that cannot be tracked. All of those pieces are still in
                      low Earth orbit, moving{" "}
                      <span className={styles.bold}>
                        at thousands of miles an hour
                      </span>{" "}
                      and posing a threat to any objects that might cross their
                      path. Initially, that even included the International
                      Space Station, with crew members on board forced to take
                      shelter in their spacecrafts as{" "}
                      <span className={styles.bold}>
                        the debris cloud from the satellite passed by the ISS a
                        couple of times.
                      </span>
                    </p>
                  </div>
                </div>
                <video
                  width="320"
                  height="240"
                  controls={false}
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  className={styles.video}
                >
                  <source src="/russianDebris.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div className={styles.section5}>
              <div className={styles.divCornerCont3}>
                <img src={cornerStar} alt="" className={styles.cornerStar} />
                <div className={styles.divBorderCorner}>
                  <div className={styles.divBorderCornerInner}>
                    <h2>Today’s Earth satellite forecast</h2>
                  </div>
                </div>
              </div>
              <img
                src={roundedGraphic}
                alt=""
                className={styles.roundedGraphic}
              />
            </div>
            <div className={styles.section6}>
              <div className={styles.divCornerCont3}>
                <img src={cornerStar} alt="" className={styles.cornerStar} />
                <div className={styles.divBorderCorner}>
                  <div className={styles.divBorderCornerInner}>
                    <h2>Number of satellites per countries</h2>
                  </div>
                </div>
              </div>
              <img
                src={countryGraphic}
                alt=""
                className={styles.roundedGraphic}
              />
            </div>
            <div className={styles.section6}>
              <div className={styles.divCornerCont3}>
                <img src={cornerStar} alt="" className={styles.cornerStar} />
                <div className={styles.divBorderCorner}>
                  <div className={styles.divBorderCornerInner}>
                    <h2>Density of traffic around Earth</h2>
                  </div>
                </div>
              </div>
              <img
                src={numberRocket}
                alt=""
                className={styles.roundedGraphic}
              />
              <img src={needles} alt="" className={styles.roundedGraphic} />
              <video
                width="484"
                height="214"
                controls={false}
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                className={styles.video2}
              >
                <source src="/debris.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
              <img src={end} alt="" className={styles.roundedGraphic} />
            </div>
          </>
        </div>
      </div>
    </>
  );
};
export default DataPage;
