import Experience from "../Experience";
import Loaders from "../../utils/Loaders";
import Lights from "./Lights";
import Cube from "./objects/Cube";
import Earth from "./objects/Earth";
import Satellites from "./objects/Satellites";

export default class World {
  private experience: Experience = new Experience();
  private lights: Lights | null = null;
  private loaders: Loaders = this.experience.loaders as Loaders;
  private cube: Cube | null = null;
  private earth: Earth | null = null;
  constructor() {
    // Objects
    this.loaders.on("loaded", () => {
      // this.cube = new Cube();
      this.earth = new Earth();
      this.lights = new Lights();
      new Satellites();
    });
  }
  destroy() {
    this.cube?.destroy();
    this.lights?.destroy();
  }
}
