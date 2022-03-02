import { ISatelliteData } from "../models/satellites";
import getSatelliteThreePos from "../utils/TLE/positionsTLE";
interface Iposition {
  x: number;
  y: number;
  z: number;
}
onmessage = (e) => {
  const saltellites: ISatelliteData[] = e.data[0];
  const date: Date = e.data[1];
  const pos: Array<Iposition | null> = [];
  for (const TLEData of saltellites) {
    pos.push(getSatelliteThreePos(TLEData, date));
  }
  let filteredPos: Iposition[] = [];
  pos.map((pos) => {
    if (pos !== null) {
      filteredPos.push(pos);
    }
  });
  const count = filteredPos.length;
  const vertices = new Float32Array(count * 3);
  let forpos = 0;
  for (let i = 0; i < count * 3; i = i + 3) {
    vertices[i] = filteredPos[forpos]?.x;
    vertices[i + 1] = filteredPos[forpos]?.y;
    vertices[i + 2] = filteredPos[forpos]?.z;
    forpos++;
  }
  const result = {
    count: count,
    vertices: vertices,
  };
  postMessage(result);
};
export default undefined;
