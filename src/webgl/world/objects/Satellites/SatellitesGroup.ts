import { Group, Scene, Sprite } from "three";
import { ISatelliteData } from "../../../../models/satellites";
import { getSatellites } from "../../../../services/satellites.service";
import Experience from "../../../Experience";
import Satellite from "./Satellite";

export default class SatellitesGroup {
  private experience: Experience = new Experience();
  private scene: Scene = this.experience.scene as Scene;

  private satelittesTLEList: ISatelliteData[] = [];
  private satelittesInstanceList: Satellite[] = [];
  private satelittesGroup: Group = new Group();

  constructor() {
    this.getAllSatellites().then(async () => {
      this.addSatellitesToGroup();
      this.addGroupToScene();
    });

    this.experience.time?.on("tickSatellite", () => this.update());
  }

  update() {
    for (const satellite of this.satelittesInstanceList) {
      satellite.setPosition(this.experience.targetDate);
    }
  }

  async getAllSatellites() {
    try {
      await getSatellites().then((TLELines) => {
        if (TLELines != null) {
          this.satelittesTLEList = TLELines;
        }
      });
    } catch (error) {}
  }

  addSatellitesToGroup() {
    for (const satellite of this.satelittesTLEList) {
      const satInstance = new Satellite(satellite);
      satInstance.setPosition(this.experience.targetDate);
      // console.log(satInstance.instance?.position);
      this.satelittesInstanceList.push(satInstance);
      this.satelittesGroup.add(satInstance.instance as Sprite);
    }
  }

  addGroupToScene() {
    this.scene.add(this.satelittesGroup);
  }

  deselectSatellite() {}
}
