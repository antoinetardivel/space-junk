import { IPopulatedStaData, IStartSateData } from "../models/satellites";
import { getAngleFromTle } from "../utils/TLE/angleTLE";
import getSatelliteThreePos from "../utils/TLE/positionsTLE";

onmessage = (e) => {
  const date: Date = e.data[1];
  const saltellites: IStartSateData[] = e.data[0];
  const populatedSats: IPopulatedStaData[] = [];
  const ALLSats: IPopulatedStaData[] = [];
  const LEOSats: IPopulatedStaData[] = [];
  const MEOSats: IPopulatedStaData[] = [];
  const HEOSats: IPopulatedStaData[] = [];

  for (let i = 0; i < saltellites.length; i++) {

    const setPos = getSatelliteThreePos(saltellites[i], date);
    const geoCoords = getAngleFromTle(saltellites[i], date);
  
    const satWSatRec: IPopulatedStaData = saltellites[i] as IPopulatedStaData;
    satWSatRec.geoCoords = geoCoords;
  
    const populatedSat = satWSatRec;
    if (setPos) {
      populatedSat.position = setPos;
      ALLSats.push(populatedSat);
      populatedSats.push(populatedSat);
      if (populatedSat.geoCoords?.height) {
        const h = populatedSat.geoCoords?.height;
        if (h < 1000) {
          LEOSats.push(populatedSat);
        }
        if (h > 1001 && h < 35786) {
          MEOSats.push(populatedSat);
        }
        if (h > 35787) {
          HEOSats.push(populatedSat);
        }
      }
    }
  }

  const ALLvertices = prepareVertices(ALLSats);
  const LEOvertices = prepareVertices(LEOSats);
  const MEOvertices = prepareVertices(MEOSats);
  const HEOvertices = prepareVertices(HEOSats);

  const result = {
    count: ALLSats.length,
    ALLvertices: ALLvertices,
    LEOvertices: LEOvertices,
    MEOvertices: MEOvertices,
    HEOvertices: HEOvertices,
  };
  postMessage(result);
};
export default undefined;

const prepareVertices = (sats: IPopulatedStaData[]) => {
  const arr = new Float32Array(sats.length * 3);
  let forpos = 0;
  for (let i = 0; i < sats.length * 3; i = i + 3) {
    if (sats[forpos].position) {
      arr[i] = sats[forpos].position?.x || 0;
      arr[i + 1] = sats[forpos].position?.y || 0;
      arr[i + 2] = sats[forpos].position?.z || 0;
    }
    forpos++;
  }
  return arr;
};