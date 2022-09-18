import {
  BufferAttribute,
  BufferGeometry,
  Points,
  Scene,
  ShaderMaterial,
} from "three";
import { ISatelliteData } from "../../../../models/satellites";
import { getSatellites } from "../../../../services/satellites.service";
import Time from "../../../../utils/Time";
import MyWorker from "../../../../workers/calculSatellitesPositions?worker";
import Experience from "../../../Experience";
import fragment from "./shader/fragment.glsl?raw";
import vertex from "./shader/vertex.glsl?raw";

export default class Satellites {
  private experience: Experience = new Experience();
  private scene: Scene = this.experience.scene as Scene;
  private time: Time = this.experience.time as Time;

  private satelittesTLEList: ISatelliteData[] = [];
  private isWaitingPos: Boolean = false;
  private material: ShaderMaterial | null = null;
  private geometry: BufferGeometry | null = null;
  private satellites: Points | null = null;
  private position: BufferAttribute | null = null;
  private prevPosition: BufferAttribute | null = null;
  private lastUpdateTime: number = this.time.current;
  private prevDeltaTime: number = 0;

  constructor() {
    this.getAllSatellites().then(async () => {
      this.setGeometry();
      this.setMaterial();
      this.initPos();
    });
  }

  update() {
    this.updatePos();
    const pourcentagePassedTime =
      ((this.time.current - this.lastUpdateTime) * 100) / this.prevDeltaTime;
    let normalizedTime = pourcentagePassedTime / 100;
    // if (Number.isFinite(normalizedTime) || normalizedTime > 1) {
    //   normalizedTime = 1;
    // }
    if (this.material) {
      this.material.uniforms.uInterPositionPourcentage.value = normalizedTime;
    }
  }

  setGeometry() {
    this.geometry = new BufferGeometry();
  }
  setMaterial() {
    // this.material = new PointsMaterial({ color: 0xffffff, size: 400 });
    this.material = new ShaderMaterial({
      uniforms: {
        uInterPositionPourcentage: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });
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
      const worker = new MyWorker();

      const message = [
        this.satelittesTLEList,
        new Date(
          this.experience.time?.start + this.experience.time.elapsed * 100
        ),
      ];
      this.isWaitingPos = true;
      worker.postMessage(message);
      worker.onmessage = (e) => {
        if (this.geometry && this.material) {
          this.prevPosition = new BufferAttribute(e.data.vertices, 3);
          this.position = new BufferAttribute(e.data.vertices, 3);
          this.geometry.setAttribute("position", this.prevPosition);
          this.geometry.setAttribute("prevPosition", this.prevPosition);
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
      worker.onmessage = (e) => {
        this.prevPosition = this.position;
        this.position = new BufferAttribute(e.data.vertices, 3);
        this.prevDeltaTime = this.time.current - this.lastUpdateTime;
        // console.log(this.prevDeltaTime);
        this.lastUpdateTime = this.time.current;

        if (this.geometry) {
          this.geometry.attributes.position = this.position;
          this.geometry.attributes.prevPosition = this
            .prevPosition as BufferAttribute;
        }
        this.isWaitingPos = false;

        worker.terminate();
      };
    }
  }
}
