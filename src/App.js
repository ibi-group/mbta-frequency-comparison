import "./App.css";
import Map from "./Components/Map";
import { useState } from "react";
import data from "./Data/old_vs_new_segments.json";
import Panel from "./Components/Panel";

function App() {
  const [variable, setVariable] = useState("total_freq_diff");

  const values = data.features.map((f) => f.properties[variable]);

  function changeVar() {
    setVariable((state) =>
      state === "total_freq_diff" ? "max_freq_diff" : "total_freq_diff"
    );
  }

  return (
    <div className="App">
      <Panel setVariable={changeVar} variable={variable} />
      <Map data={data.features} values={values} variable={variable} />
    </div>
  );
}

export default App;
