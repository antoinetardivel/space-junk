import { ISatelliteData } from "../models/satellites";
import getSatelliteThreePos from "../utils/TLE/positionsTLE";

onmessage = (e) => {
  const saltellites: ISatelliteData[] = e.data[0];
  const date: Date = e.data[1];
  const pos = [];
  for (const TLEData of saltellites) {
    pos.push(getSatelliteThreePos(TLEData, date));
  }
  postMessage(pos);
};
export default undefined;
