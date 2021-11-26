import React, { useState } from "react";
import "./App.scss";
import Earth from "./layouts/Earth/Earth.layout";
import logo from "./assets/designElements/logo.svg";
import DataPage from "./layouts/DataPage/DataPage.layout";
import Home from "./layouts/Home/Home.layout";

const App = () => {
  const [isDataOponed, setIsDataOpened] = useState(false);
  const [isReady, setIsReady] = useState(false);
  return (
    <div className="App">
      <img src={logo} alt="" className={"logo"} />
      <Earth setIsDataOpened={setIsDataOpened} setIsReady={setIsReady} />
      <DataPage
        setIsDataOpened={setIsDataOpened}
        margin={0}
        isDisplayed={isDataOponed}
      />
      <Home isReady={isReady} />
    </div>
  );
};

export default App;
