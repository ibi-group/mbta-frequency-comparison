import classes from "./Panel.module.css";

const Panel = (props) => {
  return (
    <div className={classes.panel}>
      <h1>MBTA Segments Comparison</h1>
      <p>Grey = Old Segments</p>
      <p>Pink = New Segments</p>
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
