import React, { useState } from "react";
import { IStation } from "../types/models";
import SearchResults from "./SearchResults.component";

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
    <div className="Search">
      <input
        className="SearchBox"
        value={search}
        onChange={handleSearchChanged}
        placeholder="Search"
      />

      <SearchResults
        stations={stations}
        search={search}
        onResultClick={onResultClick}
      />
    </div>
  );
};
export default Search;
