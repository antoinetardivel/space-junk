import { eciToGeodetic, GeodeticLocation, gstime } from "satellite.js";
import { ISatelliteData } from "../../models/satellites";
import getPositionAVelicity from "./getPositionAVelicity";

export const getAngleFromTle = (
  satellite: ISatelliteData,
  date: Date
): GeodeticLocation | null => {
  if (!satellite || !date) return null;

  const positionVelocity = getPositionAVelicity(satellite, date);

  const positionEci = positionVelocity?.position;

  const gmst = gstime(date);

  if (!positionEci) {
    return null;
  } else if (typeof positionEci != "boolean") {
    let positionGd = eciToGeodetic(positionEci, gmst);
    return positionGd;
  }
  return null;
};
