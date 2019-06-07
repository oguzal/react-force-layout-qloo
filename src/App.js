import React from "react";
import "./App.css";
import MusicGraph2 from "./MusicGraph2";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>Song  Radius</h3>
        <MusicGraph2
          width="960"
          height="600"
          songId="737F3A3E-DA59-415B-B254-0C87DA38E60F"
          name="Gladiator"
        />
      </header>
    </div>
  );
}

export default App;
