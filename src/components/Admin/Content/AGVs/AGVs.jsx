import { useEffect, useState } from "react";
import { getAllAGVs } from "../../../../services/apiServices";
import TableAGVs from "./components/TableAGVs";

export default function AGVs() {
  const [listAGVs, setListAGVs] = useState([]);

  const fetchListAGVs = async () => {
    try {
      let res = await getAllAGVs();
      if (res) {
        // Transform the API data to match the table structure
        const transformedData = res.map(agv => ({
          agv_id: `AGV${String(agv.agv_id).padStart(3, '0')}`,
          max_speed: `${agv.max_speed} m/s`,
          max_battery: `${agv.battery_capacity}%`,
          max_load: `${agv.max_load} kg`,
          guidance_type: agv.guidance_type,
          is_connected: agv.is_connected ? "Yes" : "No",
          is_busy: agv.is_busy ? "Yes" : "No"
        }));
        setListAGVs(transformedData);
      }
    } catch (error) {
      console.error("Error fetching AGVs:", error);
      setListAGVs([]);
    }
  };

  useEffect(() => {
    fetchListAGVs();
  }, []);

  return (
    <div>
      <div className="space-y-5">
        <h2 className="text-3xl font-bold">AGVs</h2>
        <TableAGVs listAGVs={listAGVs} />
      </div>
    </div>
  );
}
