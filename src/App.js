import React from "react";
import "./App.css";
import MusicGraph from "./MusicGraph";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>Gladiator Radius</h3>
        <MusicGraph
          width="960"
          height="600"
          SongId="737F3A3E-DA59-415B-B254-0C87DA38E60F"
        />
      </header>
    </div>
  );
}

export default App;
