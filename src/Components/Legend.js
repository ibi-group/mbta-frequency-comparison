import classes from "./Legend.module.css";

const Legend = (props) => {
  const labels = [];
  for (let i = 0; i < props.breaks.length - 1; i++) {
    labels.push(`${props.breaks[i]} to ${props.breaks[i + 1]}`);
  }

  return (
    <div className={classes.container}>
      <div className={classes.square} style={{ backgroundColor: "#f4a261" }}>
        Proposed
      </div>
      <div className={classes.square} style={{ backgroundColor: "#a6a6a6" }}>
        Removed
      </div>
      {props.colors.map((color, index) => {
        return (
          <div
            className={classes.square}
            key={color}
            style={{ backgroundColor: color }}
          >
            <p className={classes.label}>{labels[index]}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Legend;
