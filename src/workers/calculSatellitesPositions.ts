import { ISatelliteData } from "../models/satellites";
import {
  eciToEcf,
  EciVec3,
  gstime,
  PositionAndVelocity,
  propagate,
  twoline2satrec,
} from "satellite.js";
interface Iposition {
  x: number;
  y: number;
  z: number;
}
onmessage = (e) => {
  const saltellites: ISatelliteData[] = e.data[0];
  const date: Date = e.data[1];
  const pos: Iposition[] = [];
  for (const TLEData of saltellites) {
    const setPos = getSatelliteThreePos(TLEData, date);
    if (setPos) pos.push(setPos);
  }
  const count = pos.length;
  const vertices = new Float32Array(count * 3);
  let forpos = 0;
  for (let i = 0; i < count * 3; i = i + 3) {
    vertices[i] = pos[forpos]?.x;
    vertices[i + 1] = pos[forpos]?.y;
    vertices[i + 2] = pos[forpos]?.z;
    forpos++;
  }
  const result = {
    count: count,
    vertices: vertices,
  };
  postMessage(result);
};
export default undefined;

const getSatelliteThreePos = (satellite: ISatelliteData, date?: Date) => {
  if (!satellite || !date) return null;
  const positionVelocity = getPositionAVelicity(satellite, date);

  const positionEci = positionVelocity?.position;

  const gmst = gstime(date);

  if (!positionEci) {
    return null;
  } else if (typeof positionEci != "boolean") {
    const positionEcf = eciToEcf(positionEci, gmst);
    return toThree(positionEcf);
  }
  return null;
};

const toThree = (v: EciVec3<number>) => {
  return { x: v.x, y: v.z, z: -v.y };
};

const getPositionAVelicity = (
  satellite: ISatelliteData,
  date: Date
): PositionAndVelocity | null => {
  if (!satellite.satrec) {
    const { tle1, tle2 } = satellite;
    if (!tle1 || !tle2) return null;
    satellite.satrec = twoline2satrec(tle1, tle2);
  }

  return propagate(satellite.satrec, date);
};
