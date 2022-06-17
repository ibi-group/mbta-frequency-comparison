import "./App.css";
import Map from "./Components/Map";
import { useState } from "react";
import Panel from "./Components/Panel";
import InitialScreen from "./Components/InitialScreen";

function App() {
  const [variable, setVariable] = useState("total_freq_diff");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  function changeVar() {
    setVariable((state) =>
      state === "total_freq_diff" ? "max_freq_diff" : "total_freq_diff"
    );
  }

  return (
    <div className="App">
      <Panel
        setVariable={changeVar}
        variable={variable}
        setResponse={setResponse}
        setLoading={setLoading}
      />
      {response ? (
        <Map data={response.features} variable={variable} loading={loading} />
      ) : (
        <InitialScreen loading={loading} />
      )}
    </div>
  );
}

export default App;
