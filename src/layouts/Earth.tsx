import { Component } from "react";
import * as THREE from "three";
import { Engine } from "../3DElements/Engine";
import Search from "../components/Search";
import Info from "../components/Info";
import Preview from "../components/Preview";
import SelectedStations from "../components/SelectedStations";
import FastFilter from "../components/FastFilter";

import { satellitesInventory } from "../data/satellite";
import { IStation, totalObjects } from "../types/models";

// Bypass CORS
function getCorsFreeUrl(url: string) {
  return "https://api.allorigins.win/raw?url=" + url;
}

interface IState {
  selected: IStation[];
  stations: IStation[];
  totalObjects: totalObjects;
  showPreview: boolean;
  stationInfo: any;
  stationInventory: any;
}

class Earth extends Component {
  private engine: Engine | null = null;
  private el: HTMLDivElement | null = null;
  public state: IState;

  constructor(props: any) {
    super(props);

    this.state = {
      selected: [],
      stations: [],
      totalObjects: 0,
      showPreview: false,
      stationInfo: null,
      stationInventory: null,
    };

    this.handleSearchResultClick = this.handleSearchResultClick.bind(this);
  }

  componentDidMount() {
    if (this.el) {
      this.engine = new Engine();
      this.engine.initialize(this.el, {
        onStationClicked: this.handleStationClicked,
      });
      this.addStations();

      setInterval(this.handleTimer, 1000);
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

  findStationById = (stations: IStation[], id: number) => {
    return stations.find((st) => st.satrec && st.satrec.satnum === `${id}`);
  };

  handleStationClicked = (station: IStation) => {
    if (!station) return;

    this.toggleSelection(station);
  };

  toggleSelection(station: IStation) {
    if (this.isSelected(station)) this.deselectStation(station);
    else this.selectStation(station);
  }

  isSelected = (station: IStation) => {
    return this.state.selected.includes(station);
  };

  selectStation = (station: IStation) => {
    const newSelected = this.state.selected.concat(station);
    let stationInventory: IStation[] = [];
    // @ts-ignore
    stationInventory = satellitesInventory.filter(
      (st) => (st.norad_number as number) === parseInt(station.satrec.satnum)
    );
    // @ts-ignore
    if (stationInventory.length > 0) stationInventory = stationInventory[0];

    this.setState({
      selected: newSelected,
      stationInfo: station,
      showPreview: true,
      stationInventory: stationInventory,
    });

    this.engine?.removeSatellite(station);
    this.engine?.addSatellite(station, new THREE.Color("#416BFF"), 50);
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
  };

  addStations = async () => {
    await this.engine
      ?.loadLteFileStations(
        getCorsFreeUrl("http://www.celestrak.com/NORAD/elements/active.txt"),
        new THREE.Color("#ffffff")
      )
      .then((stations: IStation[] | undefined) => {
        if (stations) {
          console.log(stations);
          this.setState({
            stations: stations,
            totalObjects: stations.length,
          });
        }
      });
  };

  handleTimer = () => {
    this.engine?.updateAllPositions(new Date());
  };

  handleSearchResultClick = (station: IStation) => {
    if (!station) return;

    this.toggleSelection(station);
  };

  handleRemoveSelected = (station: IStation) => {
    if (!station) return;

    this.deselectStation(station);
  };

  handleRemoveAllSelected = () => {
    this.state.selected.forEach((s) => this.engine?.removeOrbit(s));
    this.setState({ selected: [] });
  };

  handleFastFilterClick = (filter: string) => {
    this.engine?.removeAllSatellites(this.state.stations);
    this.setState({
      selected: [],
    });

    let filter_stations = [];

    switch (filter) {
      case "LOE":
        filter_stations = this.state.stations.filter(
          (st) => st.geoCoords && st.geoCoords.height < 1000
        );
        break;
      case "MOE":
        filter_stations = this.state.stations.filter(
          (st) =>
            st.geoCoords &&
            st.geoCoords.height > 1001 &&
            st.geoCoords.height < 35786
        );
        break;
      case "HOE":
        filter_stations = this.state.stations.filter(
          (st) => st.geoCoords && st.geoCoords.height > 35787
        );
        break;
      default:
        filter_stations = this.state.stations;
    }

    filter_stations.map((station) =>
      this.engine?.addSatellite(station, new THREE.Color("#416BFF"), 50)
    );

    this.setState({
      totalObjects: filter_stations.length,
    });
  };

  closePreview = () => {
    this.setState({
      showPreview: false,
    });
  };

  render() {
    const { selected, stations } = this.state;

    return (
      <div>
        <Search
          stations={stations}
          onResultClick={this.handleSearchResultClick}
        />
        <FastFilter onResultClick={this.handleFastFilterClick} />
        <Info totalObjects={this.state.totalObjects} />
        <Preview
          isVisible={this.state.showPreview}
          station={this.state.stationInfo}
          inventory={this.state.stationInventory}
          closePreview={this.closePreview}
        />
        <SelectedStations
          onStationClick={this.setStationInfo}
          selected={selected}
          onRemoveStation={this.handleRemoveSelected}
          onRemoveAll={this.handleRemoveAllSelected}
        />
        <div
          ref={(c) => (this.el = c)}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
}

export default Earth;
