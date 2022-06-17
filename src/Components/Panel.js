import { useState } from "react";
import classes from "./Panel.module.css";

const Panel = (props) => {
  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fileChangeHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const file2ChangeHandler = (event) => {
    setFile2(event.target.files[0]);
  };

  const onFileUpload = () => {
    if (!file && !file2) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file2", file2);

    fetch("/files", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((object) => {
        props.setResponse(JSON.parse(object.data));
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
        setLoading(false);
      });
  };

  function dropHandler(e) {
    e.preventDefault();

    if (e.dataTransfer.items) {
    }
  }

  return (
    <div className={classes.panel}>
      <h1>MBTA Segments Comparison</h1>
      {loading && <p>Loading!</p>}
      {error && <p>Error!</p>}
      <input type="file" onChange={fileChangeHandler}></input>
      <input type="file" onChange={file2ChangeHandler}></input>
      <div className={classes.dropZone} onDrop={dropHandler}></div>
      <button onClick={onFileUpload}>Upload File</button>
      <button
        className={classes.button}
        onClick={() => {
          props.setVariable();
        }}
      >
        {props.variable}
      </button>
    </div>
  );
};

export default Panel;
