import React, { useState } from "react";
import { IStation } from "../../types/models";
import SearchResults from "./SearchResults/SearchResults.component";
import styles from "./Search.module.scss";
import loupe from "../../assets/icons/loupe.svg";

interface ISearch {
  stations: IStation[];
  onResultClick: (station: IStation) => void;
}

const Search: React.FC<ISearch> = ({ stations, onResultClick }) => {
  const [search, setSearch] = useState("");
  const handleSearchChanged = (event: any) => {
    setSearch(event.target.value);
  };
  return (
    <div className={styles.Search}>
      <h4 className={styles.optionTitle}>Search</h4>
      <div className={styles.cornerDivContainer}>
        <div className={styles.cornerDivInner}>
          <input
            className={styles.SearchBox}
            value={search}
            onChange={handleSearchChanged}
            placeholder="Search satellite"
          />
          <img className={styles.searchLoupe} src={loupe} alt="" />
        </div>
      </div>

      <SearchResults
        stations={stations}
        search={search}
        onResultClick={onResultClick}
      />
    </div>
  );
};
export default Search;
