import classes from "./loadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div class={classes["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
