import { Battery, CircleGauge, MapPin, Navigation, Route } from "lucide-react";
import PropTypes from "prop-types";

export default function StatsBox({ agv_id, dataSocket = {} }) {
  const {
    speed = 0,
    battery = 0,
    state = '',
    location = 0,
    previousWaypoint = 0,
    distance = 0,
    distanceSum = 0,
  } = dataSocket;

  return (
    <>
      <div className="flex w-full">
        <div className="card grid flex-grow place-items-center rounded-box bg-base-300 shadow shadow-neutral-900">
          <h1 className="text-3xl font-extrabold text-info">AGV {agv_id}</h1>
        </div>
        <div className="divider divider-info divider-horizontal"></div>
        <div className="card grid flex-grow rounded-box">
          <div className="stats stats-vertical shadow shadow-neutral-900 lg:stats-horizontal">
            <div className="stat place-items-center">
              <div className="stat-figure text-primary">
                <CircleGauge />
              </div>
              <div className="stat-title text-white">Speed</div>
              <div className="stat-value text-primary">
                {`${speed} m/s` ?? "N/A"}
              </div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-figure text-success">
                <Battery />
              </div>
              <div className="stat-title text-white">Battery</div>
              <div className="stat-value text-success">
                {`${battery} %` ?? "N/A"}
              </div>
              {battery < 10 ? (
                <div className="stat-desc text-error">Low battery</div>
              ) : null}
            </div>

            <div className="stat place-items-center">
              <div className="stat-figure text-warning">
                <Navigation />
              </div>
              <div className="stat-title text-white">State</div>
              <div className="stat-value text-warning">{state || "N/A"}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-figure text-accent">
                <MapPin />
              </div>
              <div className="stat-title text-white">Current Waypoint</div>
              <div className="stat-value text-accent">{location ?? "N/A"}</div>
              <div className="stat-desc">Previous: {previousWaypoint}</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-figure text-info">
                <Route />
              </div>
              <div className="stat-title text-white">Distance</div>
              <div className="stat-value text-info">{`${distance} m` ?? "N/A"}</div>
              <div className="stat-desc">Total: {distanceSum}m</div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </>
  );
}

StatsBox.propTypes = {
  agv_id: PropTypes.number.isRequired,
  dataSocket: PropTypes.shape({
    speed: PropTypes.number,
    battery: PropTypes.number,
    state: PropTypes.string,
    location: PropTypes.number,
    previousWaypoint: PropTypes.number,
    distance: PropTypes.number,
    distanceSum: PropTypes.number,
  }).isRequired,
};
