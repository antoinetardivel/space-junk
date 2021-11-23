import * as satellite from "satellite.js";
import * as THREE from "three";

export type totalObjects = number;

export interface IStation {
  geoCoords?: {
    height: number;
    latitude: number;
    longitude: number;
  };
  mesh: THREE.Sprite;
  orbitMinutes: number;
  satelliteSize: number;
  satrec: satellite.SatRec;
  tle1: string;
  tle2: string;
  orbit: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial> | null;
  name: string;
  official_name: string;
  country_un: string;
  country_owner: string;
  owner: string;
  users: string;
  purpose: string;
  detailed_purpose: string;
  class_of_orbit: string;
  type_of_orbit: string;
  longitude_of_geo: number;
  perigee: number;
  apogee: number;
  eccentricity: number;
  inclination: number;
  period: number;
  launch_mass: number;
  dry_mass: string;
  power: string;
  date_of_launch: string;
  expected_lifetime: number;
  contractor: string;
  country_of_contractor: string;
  launch_site: string;
  launch_vehicle: string;
  cospar_number: string;
  norad_number: number;
  comments: string;
  orbital_data: string;
  source: string;
  source__1: string;
  source__2: string;
  source__3: string;
  source__4: string;
  source__5: string;
  source__6: string;
}

export interface IStationOptions {
  orbitMinutes: number;
  satelliteSize: number;
  tle1: string;
  tle2: string;
}

export interface setrec {
  satrec: any;
}
