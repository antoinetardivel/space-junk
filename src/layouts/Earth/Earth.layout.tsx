import { Component } from "react";
import * as THREE from "three";
import { Engine } from "../../3DElements/Engine";
import Search from "../../components/Search/Search.component";
import SateliteDatas from "../../components/SateliteDatas/SateliteDatas.component";
// import SelectedStations from "../../components/SelectedStations/SelectedStations.component";
import OrbitSelector from "../../components/OrbitSelector/OrbitSelector.component";
import styles from "./Earth.module.scss";
import { satellitesInventory } from "../../data/satellite";
import { IStation, totalObjects } from "../../types/models";
import separator from "../../assets/designElements/separator.svg";
import SpeedSelector from "../../components/SpeedSelector/SpeedSelector.component";
import CameraDistanceSlider from "../../components/CameraDistanceSlider/CameraDistanceSlider.component";
import OnlySelected from "../../components/OnlySelected/OnlySelected.component";
import ToggleOptions from "../../components/ToggleOptions/ToggleOptions.component";
import DigDataButton from "../../components/DigDataButton/DigDataButton.component";

// Bypass CORS
// const getCorsFreeUrl = (url: string) => {
//   // return url;
//   return "https://api.allorigins.win/raw?url=" + url;
// };

interface IState {
  selected: IStation[];
  stations: IStation[];
  totalObjects: totalObjects;
  showPreview: boolean;
  stationInfo: any;
  stationInventory: any;
  speed: number;
  orbit: string;
  cameraDistance: number;
  onlySelected: boolean;
  isOptionsExtended: boolean;
}

interface IEarth {
  setIsDataOpened: (state: boolean) => void;
  setIsReady: (state: boolean) => void;
}

class Earth extends Component<IEarth, IState> {
  private engine: Engine | null = null;
  private el: HTMLDivElement | null = null;
  public state: IState;
  private orbitTime: Date | null = null;
  private elapsedTime: number = 0;
  private clock: THREE.Clock | null = null;

  constructor(props: IEarth) {
    super(props);

    this.state = {
      selected: [],
      stations: [],
      totalObjects: 0,
      showPreview: false,
      stationInfo: null,
      stationInventory: null,
      speed: 1,
      orbit: "ALL",
      cameraDistance: 0,
      onlySelected: false,
      isOptionsExtended: false,
    };

    this.handleSearchResultClick = this.handleSearchResultClick.bind(this);
  }

  componentDidMount() {
    if (this.el) {
      this.engine = new Engine();
      this.engine.initialize(this.el, {
        onStationClicked: this.handleStationClicked,
        setIsReady: this.props.setIsReady,
      });
      this.addStations();
      if (!this.clock) {
        this.clock = new THREE.Clock();
      }
      // setInterval(this.handleTimer, 1000);
      this.orbitTime = new Date();
      requestAnimationFrame(this.handleTimer);
    } else {
      console.log("Container is not defined");
    }
  }

  componentWillUnmount() {
    this.engine?.dispose();
  }

  queryStationsByName = (stations: IStation[], query: string) => {
    query = query.toLowerCase();

    let search = stations.filter(
      (st) => st.name.toLowerCase().indexOf(query) > -1
    );

    if (search.length > 0) return search[0];
    else return search;
  };

  // findStationById = (stations: IStation[], id: number) => {
  //   return stations.find((st) => st.satrec && st.satrec.satnum === `${id}`);
  // };

  handleStationClicked = (station: IStation) => {
    if (!station) return;

    this.toggleSelection(station);
  };

  toggleSelection(station: IStation) {
    if (!this.isSelected(station)) this.selectStation(station);
  }

  isSelected = (station: IStation) => {
    return this.state.selected.includes(station);
  };

  showSelectedStations = () => {
    this.state.selected.forEach((station: IStation, index: number) => {
      this.engine?.removeSatellite(station);
      this.engine?.addSatellite(station, new THREE.Color("#001EF0"), 50);
      this.engine?.addOrbit(station);
    });
    this.handleTimer();
  };

  selectStation = (station: IStation) => {
    let newSelected: IStation[] = this.state.selected;
    if (newSelected.length >= 3) {
      this.engine?.removeOrbit(newSelected[0]);
      newSelected.shift();
    }
    newSelected = newSelected.concat(station) || [];

    let stationInventory: IStation[] = [];

    newSelected.forEach((selectdStation: IStation, index: number) => {
      stationInventory.push(
        satellitesInventory.filter(
          (st) =>
            (st.norad_number as number) ===
            parseInt(newSelected[index].satrec.satnum)
        )[0] as IStation
      );
    });

    this.setState({
      selected: newSelected,
      stationInfo: station,
      showPreview: true,
      stationInventory: stationInventory,
    });

    this.engine?.removeSatellite(station);
    this.engine?.addSatellite(station, new THREE.Color("#001EF0"), 50);
    this.engine?.addOrbit(station);
    this.handleTimer();
  };

  setStationInfo = (station: IStation) => {
    this.setState({
      stationInfo: station,
    });
  };

  deselectStation = (station: IStation) => {
    const newSelected = this.state.selected.filter((s) => s !== station);
    this.setState({
      selected: newSelected,
      stationInfo: null,
      showPreview: false,
    });

    this.engine?.removeOrbit(station);
    if (this.state.onlySelected) this.engine?.removeSatellite(station);
  };

  addStations = async () => {
    await this.engine
      ?.loadLteFileStations(
        "/active.txt",
        // getCorsFreeUrl("https://celestrak.com/pub/TLE/catalog.txt"),
        // getCorsFreeUrl("http://www.celestrak.com/NORAD/elements/active.txt"),
        new THREE.Color("#ffffff")
      )
      .then((stations: IStation[] | undefined) => {
        if (stations)
          this.setState({
            stations: stations,
            totalObjects: stations.length,
          });
      });
  };

  handleTimer = () => {
    let interval30 = 1 / 15;
    let interval60 = 1 / 25;
    if (this.orbitTime) {
      if (this.clock) {
        this.elapsedTime += this.clock.getDelta();

        if (this.elapsedTime > interval30) {
          this.engine?.rotateEarth(
            this.clock.getElapsedTime() * 0.01 * this.state.speed
          );
          this.orbitTime.setSeconds(
            this.orbitTime.getSeconds() + this.state.speed
          );
          this.engine?.updateAllPositions(this.orbitTime);
          this.elapsedTime = this.elapsedTime % interval30;
          if (this.engine)
            this.setState({
              cameraDistance: this.engine.cameraDistance as number,
            });
        }
        if (this.elapsedTime > interval60) {
          this.engine?.render();
        }
      }
      requestAnimationFrame(this.handleTimer);
    }
  };

  handleSearchResultClick = (station: IStation) => {
    if (!station) return;

    this.toggleSelection(station);
  };

  handleRemoveSelected = (station: IStation) => {
    if (!station) return;

    this.deselectStation(station);
  };

  handleChangeSpeed = (speed: number) => {
    this.setState({
      speed: speed,
    });
  };

  handleRemoveAllSelected = () => {
    this.state.selected.forEach((s) => this.engine?.removeOrbit(s));
    this.setState({ selected: [] });
  };

  handleFastFilterClick = (filter: string, force?: boolean) => {
    this.engine?.removeAllSatellites();

    let filter_stations = [];
    switch (filter) {
      case "LEO":
        filter_stations = this.state.stations.filter(
          (st) => st.geoCoords && st.geoCoords.height < 1000
        );
        this.setState({
          orbit: "LEO",
        });
        break;
      case "MEO":
        filter_stations = this.state.stations.filter(
          (st) =>
            st.geoCoords &&
            st.geoCoords.height > 1001 &&
            st.geoCoords.height < 35786
        );
        this.setState({
          orbit: "MEO",
        });
        break;
      case "HOE":
        filter_stations = this.state.stations.filter(
          (st) => st.geoCoords && st.geoCoords.height > 35787
        );
        this.setState({
          orbit: "HOE",
        });
        break;
      default:
        filter_stations = this.state.stations;
        this.setState({
          orbit: "ALL",
        });
    }
    if (!this.state.onlySelected || force) {
      filter_stations.map((station) =>
        this.engine?.addSatellite(station, new THREE.Color("#001EF0"), 50)
      );
    }

    // filter_stations.map((station) =>
    //   this.engine?.addSatellite(station, new THREE.Color("#001EF0"), 50)
    // );
    this.showSelectedStations();

    this.setState({
      totalObjects: filter_stations.length,
    });
  };

  closePreview = () => {
    this.setState({
      showPreview: false,
    });
  };

  toggleOptionsExtended = () => {
    this.setState({
      isOptionsExtended: !this.state.isOptionsExtended,
    });
  };

  setCameraDistance = (distance: number) => {
    this.setState({
      cameraDistance: distance,
    });
    if (this.engine && this.engine.camera) {
      this.engine.camera.position.setLength(distance);
      this.engine.cameraDistance = distance;
    }
  };

  setOnlySelected = (state: boolean) => {
    this.setState({
      onlySelected: state,
    });
    if (this.engine) {
      if (state === true) {
        this.engine.removeSatellites(
          this.state.stations.filter(
            (station) => !this.state.selected.includes(station)
          )
        );
      } else {
        this.handleFastFilterClick(this.state.orbit, true);
        this.showSelectedStations();
      }
    }
  };

  render() {
    const {
      showPreview,
      onlySelected,
      // stationInfo,
      stationInventory,
      cameraDistance,
      speed,
      orbit,
      selected,
      stations,
      isOptionsExtended,
    } = this.state;

    return (
      <div className={styles.planetSection}>
        <div className={styles.digdatacontainer}>
          <DigDataButton setIsDataOpened={this.props.setIsDataOpened} />
        </div>
        <div className={styles.optionContainer}>
          <div
            className={styles.optionColumn}
            style={{ marginLeft: isOptionsExtended ? 0 : "-283px" }}
          >
            <Search
              stations={stations}
              onResultClick={this.handleSearchResultClick}
            />
            {/* <SelectedStations
              onStationClick={this.setStationInfo}
              selected={selected}
              onRemoveStation={this.handleRemoveSelected}
              onRemoveAll={this.handleRemoveAllSelected}
            /> */}
            <OnlySelected
              state={onlySelected}
              setState={this.setOnlySelected}
            />
            <img className={styles.separator} src={separator} alt="" />
            <SpeedSelector
              selectSpeed={this.handleChangeSpeed}
              currentSpeed={speed}
            />
            <OrbitSelector
              selectOrbit={this.handleFastFilterClick}
              currentOrbit={orbit}
            />
            <CameraDistanceSlider
              distance={cameraDistance}
              setDistance={this.setCameraDistance}
            />
            <button
              className={styles.cornerButtonContainer}
              onClick={() => this.toggleOptionsExtended()}
            >
              <p className={styles.cornerButtonInner}>Hide Options</p>
            </button>
            <ToggleOptions
              state={isOptionsExtended}
              toggleState={this.toggleOptionsExtended}
            />
          </div>
          <div className={styles.optionColumn}>
            <SateliteDatas
              isVisible={showPreview}
              stationsInventory={stationInventory}
              selectedStations={selected}
              closeSatelliteData={this.handleRemoveSelected}
            />
          </div>
        </div>
        <div ref={(c) => (this.el = c)} className={styles.planetScene} />
      </div>
    );
  }
}

export default Earth;
