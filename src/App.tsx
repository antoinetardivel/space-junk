import React, { useState } from "react";
import "./App.scss";
import Earth from "./layouts/Earth/Earth.layout";
import logo from "./assets/designElements/logo.svg";
import DataPage from "./layouts/DataPage/DataPage.layout";

const App = () => {
  const [isDataOponed, setIsDataOpened] = useState(false);
  return (
    <div className="App">
      <img src={logo} alt="" className={"logo"} />
      <Earth setIsDataOpened={setIsDataOpened} />
      {isDataOponed && <DataPage />}
    </div>
  );
};

export default App;
