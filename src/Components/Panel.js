import { useState } from "react";
import classes from "./Panel.module.css";

const Panel = (props) => {
  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [error, setError] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fileChangeHandler = (event) => {
    event.preventDefault();
    if (
      event.dataTransfer.files &&
      event.dataTransfer.files[0].name.endsWith(".zip")
    ) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const file2ChangeHandler = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFile2(event.dataTransfer.files[0]);
    }
  };

  const onFileUpload = () => {
    if (!file && !file2) {
      return;
    }

    props.setLoading(true);
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
        props.setLoading(false);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
        props.setLoading(false);
      });
  };

  return (
    <div className={classes.panel}>
      <h1>MBTA Segments Comparison</h1>
      {error && <p>Error!</p>}
      <div className={classes.uploads}>
        <div
          className={
            !file
              ? classes.dropZone
              : `${classes.dropZone} ${classes.dropZoneUploaded}`
          }
          onDragOver={handleDragOver}
          onDrop={fileChangeHandler}
        >
          <p>{file ? "Uploaded" : "Drag Old GTFS Network here"}</p>
        </div>
        <div
          className={
            !file2
              ? classes.dropZone
              : `${classes.dropZone} ${classes.dropZoneUploaded}`
          }
          onDragOver={handleDragOver}
          onDrop={file2ChangeHandler}
        >
          <p>{file2 ? "Uploaded" : "Drag Proposed GTFS Network here"}</p>
        </div>

        <button className={classes.button} onClick={onFileUpload}>
          Compare
        </button>
        {props.loading && (
          <button
            className={classes.button}
            onClick={() => {
              props.setVariable();
            }}
          >
            {props.variable}
          </button>
        )}
      </div>
    </div>
  );
};

export default Panel;
