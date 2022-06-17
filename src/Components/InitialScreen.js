import classes from "./InitialScreen.module.css";
import LoadingSpinner from "./LoadingSpinner";

const InitialScreen = ({ loading }) => {
  const initialContent = (
    <div>
      <h2>This tool compares the frequences of two GTFS feeds</h2>
      <p>Upload your feeds to get started.</p>
      <p>Feeds must be zipped archives, not loose or unzipped folders.</p>
    </div>
  );

  return (
    <div className={classes.background}>
      <div className={classes.overlay}>
        {loading ? (
          <div>
            <LoadingSpinner />
            <p>Loading</p>
          </div>
        ) : (
          initialContent
        )}
      </div>
    </div>
  );
};

export default InitialScreen;
