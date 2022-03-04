import Loaders from "../../utils/Loaders";
import Experience from "../Experience";
import Lights from "./Lights";
import Earth from "./objects/Earth";
import Satellites from "./objects/Satellites/Satellites";

export default class World {
  private experience: Experience = new Experience();
  private lights: Lights | null = null;
  private loaders: Loaders = this.experience.loaders as Loaders;
  public satellites: Satellites | null = null; //TODO: PASS PRIVATE
  public earth: Earth | null = null; //TODO: PASS PRIVATE
  constructor() {
    // Objects
    this.loaders.on("loaded", () => {
      this.earth = new Earth();
      this.lights = new Lights();
      this.satellites = new Satellites();
    });
  }
  update() {
    this.satellites?.update();
  }
  destroy() {
    this.lights?.destroy();
  }
}
