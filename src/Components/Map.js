import {
  MapContainer,
  TileLayer,
  Polyline,
  GeoJSON,
  useMapEvents,
  Popup,
  LayersControl,
} from "react-leaflet";
import classes from "./Map.module.css";
import "leaflet/dist/leaflet.css";
import "leaflet-polylineoffset";
import { scale, limits } from "chroma-js";
import { useState, useMemo, Fragment } from "react";
import Legend from "./Legend";

const SetDataonZoom = (props) => {
  const map = useMapEvents({
    zoom() {
      props.setZoom(map.getZoom());
    },
  });
  return null;
};

const Map = ({ variable, values, data }) => {
  const [zoomLevel, setZoomLevel] = useState(13);

  const mapCenter = [42.3601, -71.0589];
  const orange = "#f4a261";

  //Create color scale
  const colors = scale(["#f07167", "#0081a7"]).colors(5);
  const breaks = limits(values, "q", 5);
  const colorScale = scale(colors).domain(breaks);

  const computePolylines = (featureSet) => {
    const lines = featureSet.map(({ geometry, properties }) => {
      //reverse coords for polyline
      const coordList = geometry.coordinates.map((pair) => {
        return [pair[1], pair[0]];
      });

      const freq = properties[variable];
      const both = properties._merge === "both";
      const proposed = properties._merge === "left_only";

      const options = {
        weight: both ? 3 : 1,
        color: both ? colorScale(freq) : proposed ? orange : "#a6a6a6",
        offset: 5,
      };

      return (
        <Polyline
          className={classes.busline}
          key={Math.random()}
          positions={coordList}
          pathOptions={options}
          eventHandlers={{
            mouseover: (e) => e.target.setStyle({ weight: 8 }),
            mouseout: (e) => e.target.setStyle({ weight: 3 }),
          }}
        >
          <Popup>
            <strong>Proposed Routes:</strong> {properties.route_name}
            <br />
            <strong>Old Routes:</strong> {properties.route_name_old}
            <br />
            <strong>Old All-Day Volume:</strong> {properties.frequency_old}
            <br />
            <strong>New All-Day Volume:</strong> {properties.frequency}
            <br />
            <strong>Old Max Hourly Frequency:</strong> {properties.max_freq_old}
            <br />
            <strong>New Max Hourly Frequency:</strong> {properties.max_freq}
          </Popup>
        </Polyline>
      );
    });

    return lines;
  };

  const lines = useMemo(() => computePolylines(data), [data]);

  function styleLines(feature) {
    const both = feature.properties._merge === "both";
    const proposed = feature.properties._merge === "left_only";

    return {
      color: both
        ? colorScale(feature.properties[variable])
        : proposed
        ? orange
        : "#a6a6a6",
      weight: both ? 3 : 1,
    };
  }

  return (
    <div className={classes.map}>
      <MapContainer center={mapCenter} zoom={13} minZoom={10} maxZoom={18}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWJpLXRyYW5zaXQtZGF0YS10ZWFtIiwiYSI6ImNrcDI4aHFzMzFpMmcydnF3OHd5N3Z0OW8ifQ.IwReYu0rGZko64sy2mbPSg"
        />
        <LayersControl>
          {zoomLevel >= 16 ? (
            lines
          ) : (
            <Fragment>
              <LayersControl.Overlay checked name="Same">
                <GeoJSON
                  key={Math.random()}
                  style={styleLines}
                  data={data.filter((f) => f.properties._merge === "both")}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name="removed">
                <GeoJSON
                  key={Math.random()}
                  style={styleLines}
                  data={data.filter(
                    (f) => f.properties._merge === "right_only"
                  )}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name="added">
                <GeoJSON
                  key={Math.random()}
                  style={styleLines}
                  data={data.filter((f) => f.properties._merge === "left_only")}
                />
              </LayersControl.Overlay>
            </Fragment>
          )}
        </LayersControl>

        <SetDataonZoom setZoom={setZoomLevel} />
      </MapContainer>
      <Legend colors={colors} breaks={breaks} />
    </div>
  );
};

export default Map;
