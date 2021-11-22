import React, { useState } from "react";
import SearchResults from "./SearchResults";

const Search = ({ stations, onResultClick }) => {
  const [search, setSearch] = useState("");
  const handleSearchChanged = (event) => {
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
