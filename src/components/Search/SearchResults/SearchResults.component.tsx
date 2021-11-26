import React from "react";
import { IStation } from "../../../types/models";
import styles from "./SearchResults.module.scss";

const MaxSearchResults = 10;

const filterResults = (stations: IStation[], search: string) => {
  if (!stations) return null;
  if (!search || search === "") return null;

  const regex = new RegExp(search, "i");

  return stations
    .filter((station) => regex.test(station.name))
    .slice(0, MaxSearchResults);
};

interface ISearchResults {
  stations: IStation[];
  search: string;
  onResultClick: (station: IStation) => void;
}

const SearchResults: React.FC<ISearchResults> = ({
  stations,
  search,
  onResultClick,
}) => {
  const results = filterResults(stations, search);

  if (!results) return null;

  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultsWrapper}>
        {results.map((result: any, i: number) => (
          <StationPreview
            key={result.name + `${i}`}
            station={result}
            onClick={onResultClick}
          />
        ))}
        {results.length <= 0 && <div className={styles.noResult}>No satellite found ;{"("}</div>}
      </div>
    </div>
  );
};

interface IStationPreview {
  station: IStation;
  onClick: (station: IStation) => void;
  className?: string;
}
export const StationPreview: React.FC<IStationPreview> = ({
  station,
  onClick,
  className,
}) => {
  const id = station.satrec && station.satrec.satnum;

  return (
    <div
      className={[styles.result, className || ""].join(" ")}
      onClick={(e) => onClick && onClick(station)}
    >
      <p>
        <span title={id ? "NORAD ID: " + id : ""}>{station.name}</span>
      </p>
    </div>
  );
};

export default SearchResults;
