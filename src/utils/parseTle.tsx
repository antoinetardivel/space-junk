import * as satellite from "satellite.js";
import { IStation } from "../types/models";

export const EarthRadius = 6371;
//const rad2Deg = 180 / 3.141592654;

export const parseTleFile = (fileContent: string, stationOptions: any) => {
  const result = [];
  const lines = fileContent.split("\n");
  let current = null;

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i].trim();

    if (line.length === 0) continue;

    if (line[0] === "1") {
      current.tle1 = line;
    } else if (line[0] === "2") {
      current.tle2 = line;
    } else {
      current = {
        name: line,
        ...stationOptions,
      };
      result.push(current);
    }
  }

  return result;
};

const toThree = (v: satellite.EciVec3<number>) => {
  return { x: v.x, y: v.z, z: -v.y };
};

const getSolution = (station: IStation, date: Date) => {
  if (!station.satrec) {
    const { tle1, tle2 } = station;
    if (!tle1 || !tle2) return null;
    station.satrec = satellite.twoline2satrec(tle1, tle2);
  }

  return satellite.propagate(station.satrec, date);
};

// type: 1 ECEF coordinates   2: ECI coordinates
export const getPositionFromTle = (
  station: IStation,
  date: Date,
  type = 1
) => {
  if (!station || !date) return null;

  const positionVelocity = getSolution(station, date);

  const positionEci = positionVelocity?.position;
  if (type === 2) return toThree(positionEci as satellite.EciVec3<number>);

  const gmst = satellite.gstime(date);

  if (!positionEci) {
    return null;
  } else if (typeof positionEci != "boolean") {
    const positionEcf = satellite.eciToEcf(positionEci, gmst);
    return toThree(positionEcf);
  }
  return null;
};

export const getAngleFromTle = (station: IStation, date: Date, type = 1) => {
  if (!station || !date) return null;

  const positionVelocity = getSolution(station, date);

  const positionEci = positionVelocity?.position;
  if (type === 2) return toThree(positionEci as satellite.EciVec3<number>);

  const gmst = satellite.gstime(date);

  if (!positionEci) {
    return null;
  } else if (typeof positionEci != "boolean") {
    let positionGd = satellite.eciToGeodetic(positionEci, gmst);
    return positionGd;
  }
  return null;
};
