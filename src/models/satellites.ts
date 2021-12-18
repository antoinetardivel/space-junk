import { GeodeticLocation, SatRec } from "satellite.js";
import { Sprite } from "three";

export interface ISatelliteData {
  name?: string;
  tle1?: string;
  tle2?: string;
  satrec?: SatRec;
  mesh?: Sprite;
  geoCoords?: GeodeticLocation;
}
