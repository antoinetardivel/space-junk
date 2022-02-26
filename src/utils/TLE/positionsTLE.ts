import { eciToEcf, EciVec3, gstime } from "satellite.js";
import { ISatelliteData } from "../../models/satellites";
import getPositionAVelicity from "./getPositionAVelicity";

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
export default getSatelliteThreePos;

const toThree = (v: EciVec3<number>) => {
  return { x: v.x, y: v.z, z: -v.y };
};
