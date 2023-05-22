import { useState } from "react";
import Nav from "./components/Nav/Nav";
import Scene from "./components/Scene/Scene";
import "./App.css";

function App() {
  const [dayMode, setDayMode] = useState(true);

  const handleDay = (e) => {
    e.preventDefault();
    setDayMode(!dayMode);
  };

  return (
    <>
      <Scene dayMode={dayMode} />
      <Nav handleDay={handleDay} dayMode={dayMode} />
    </>
  );
}

export default App;
