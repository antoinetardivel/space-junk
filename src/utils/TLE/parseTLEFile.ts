import { IStartSateData } from "../../models/satellites";

export const parseTleFile = (TLEFile: string): IStartSateData[] => {
  const result = [];
  const lines = TLEFile.split("\n");
  let current: IStartSateData = {};

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
      };
      result.push(current);
    }
  }
  return result;
};
