import { PositionAndVelocity, propagate, twoline2satrec } from "satellite.js";
import { IStartSateDataWSatRec } from "../../models/satellites";

const getPositionAVelicity = (
  satellite: IStartSateDataWSatRec,
  date: Date
): PositionAndVelocity | null => {
  if (!satellite.satrec) {
    const { tle1, tle2 } = satellite;
    if (!tle1 || !tle2) return null;
    satellite.satrec = twoline2satrec(tle1, tle2);
  }

  return propagate(satellite.satrec, date);
};

export default getPositionAVelicity;
