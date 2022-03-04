//@ts-ignore
import init, { crate } from "crate";
import {
  BufferAttribute,
  BufferGeometry,
  Points,
  PointsMaterial,
  Scene,
} from "three";
import { ISatelliteData } from "../../../../models/satellites";
import { getSatellites } from "../../../../services/satellites.service";
import MyWorker from "../../../../workers/calculSatellitesPositions?worker";
import Experience from "../../../Experience";

export default class Satellites {
  private experience: Experience = new Experience();
  private scene: Scene = this.experience.scene as Scene;

  private satelittesTLEList: ISatelliteData[] = [];
  private isWaitingPos: Boolean = false;
  private material: PointsMaterial | null = null;
  private geometry: BufferGeometry | null = null;
  private satellites: Points | null = null;

  constructor() {
    this.getAllSatellites().then(async () => {
      this.setGeometry();
      this.setMaterial();
      this.initPos();
    });
  }

  update() {
    this.updatePos();
  }
  setGeometry() {
    this.geometry = new BufferGeometry();
  }
  setMaterial() {
    this.material = new PointsMaterial({ color: 0xffffff, size: 400 });
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

  initPos() {
    if (window.Worker && this.experience.time) {
      console.log(this.satelittesTLEList[0]);
      const message2 = {
        tles: this.satelittesTLEList,
        date: Math.floor(
          (this.experience.time?.start +
            this.experience.time.elapsed / 1000 / 60) <<
            0
        ),
      };
      const message = [
        this.satelittesTLEList,
        new Date(this.experience.time?.start + this.experience.time.elapsed),
      ];
      init().then(() => {
        console.log(crate(message2 as any));
        crate(message2 as any);
      });
      const worker = new MyWorker();

      this.isWaitingPos = true;
      worker.postMessage(message);
      worker.onmessage = (e: any) => {
        console.log(e.data.count);
        if (this.geometry && this.material) {
          this.geometry.setAttribute(
            "position",
            new BufferAttribute(e.data.vertices, 3)
          );
          this.satellites = new Points(this.geometry, this.material);
          this.scene.add(this.satellites);
          this.isWaitingPos = false;
        }
        worker.terminate();
      };
    }
  }

  updatePos() {
    if (!this.isWaitingPos && window.Worker && this.experience.time) {
      const worker = new MyWorker();
      const message = [
        this.satelittesTLEList,
        new Date(
          this.experience.time.start + this.experience.time.elapsed * 500
        ),
      ];
      this.isWaitingPos = true;
      worker.postMessage(message);
      worker.onmessage = (e: any) => {
        if (this.geometry)
          this.geometry.attributes.position = new BufferAttribute(
            e.data.vertices,
            3
          );
        this.isWaitingPos = false;
        worker.terminate();
      };
    }
  }
}
