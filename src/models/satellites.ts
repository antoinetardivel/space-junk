import { GeodeticLocation, SatRec } from "satellite.js";
export interface IStartSateData {
  name?: string;
  tle1?: string;
  tle2?: string;
}
export interface IStartSateDataWSatRec {
  name?: string;
  tle1?: string;
  tle2?: string;
  satrec?: SatRec;
}
export interface IPopulatedStaData {
  name?: string;
  tle1?: string;
  tle2?: string;
  satrec?: SatRec;
  geoCoords: GeodeticLocation | null;
  position?: { x: number; y: number; z: number };
}
