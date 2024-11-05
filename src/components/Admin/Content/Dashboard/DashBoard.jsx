import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";
import SpeedLineChart from "./components/SpeedLineChart";
import StatsBox from "./components/StatsBox";

export default function Dashboard() {
  const SOCKET_URL = "ws://localhost:8000/ws/agv_data/";

  const { lastJsonMessage, sendMessage } = useWebSocket(SOCKET_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () => {
        console.log('WebSocket Connected');
        sendMessage('get_data');
    },
    onMessage: (event) => {
        const data = JSON.parse(event.data);
        console.log('Raw WebSocket data:', event.data);
        console.log('Parsed WebSocket data:', data);
    }
});

  const [throttledJsonMessage, setThrottledJsonMessage] = useState(null);

  useEffect(() => {
    if (lastJsonMessage) {
        console.log('Received message:', lastJsonMessage);
        
        // Handle array of data
        if (Array.isArray(lastJsonMessage) && lastJsonMessage.length > 0) {
            const latestData = lastJsonMessage[lastJsonMessage.length - 1];
            setThrottledJsonMessage(latestData);
            console.log('Latest data:', latestData);
        } 
        // Handle single object
        else if (typeof lastJsonMessage === 'object') {
            setThrottledJsonMessage(lastJsonMessage);
            console.log('Single data:', lastJsonMessage);
        }
    }
}, [lastJsonMessage]);

  const dataSocket = useMemo(() => {
    if (throttledJsonMessage) {
      return {
        speed: throttledJsonMessage?.agv_speed || 0,
        battery: throttledJsonMessage?.agv_battery || 0,
        state: throttledJsonMessage?.agv_state || '',
        location: throttledJsonMessage?.next_waypoint || 0,
        previousWaypoint: throttledJsonMessage?.previous_waypoint || 0,
        distance: throttledJsonMessage?.distance || 0,
        distanceSum: throttledJsonMessage?.distance_sum || 0,
      };
    } else {
      return {
        speed: 0,
        battery: 0,
        state: '',
        location: 0,
        previousWaypoint: 0,
        distance: 0,
        distanceSum: 0,
      };
    }
  }, [throttledJsonMessage]);

  const StatsBoxContainer = ({ dataSocket = {} }) => (
    <div className="flex w-full flex-col">
      <div className="card bg-neutral shadow-xl lg:card-side">
        <div className="card-body items-center text-center">
          <StatsBox agv_id={1} dataSocket={dataSocket} />
          <StatsBox agv_id={2} dataSocket={dataSocket} />
        </div>
      </div>
    </div>
  );

  StatsBoxContainer.propTypes = {
    dataSocket: PropTypes.object.isRequired,
  };

  return (
    <div>
      <div className="space-y-5">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <StatsBoxContainer dataSocket={dataSocket} />
        <SpeedLineChart dataSocket={dataSocket} />
      </div>
    </div>
  );
}
