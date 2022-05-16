import {
  BufferAttribute,
  BufferGeometry,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  InstancedBufferGeometry,
  Float32BufferAttribute,
} from "three";
import { GUI } from "dat.gui";
import { IStartSateData } from "../../../../models/satellites";
import { getSatellites } from "../../../../services/satellites.service";
import MyWorker from "../../../../workers/calculSatellitesPositions?worker";
import Experience from "../../../Experience";
import Debug from "../../../../utils/debug/Debug";
import frag from "./frag.glsl?raw";
import vert from "./vert.glsl?raw";

interface setFilters {
  orbit: null | "LEO" | "MEO" | "HEO";
}

export default class Satellites {
  private experience: Experience = new Experience();
  private debugFolder: GUI | null = null;
  private debug: Debug = this.experience.debug as Debug;
  private scene: Scene = this.experience.scene as Scene;

  // private satelittesTLEList: IStartSateData[] = [];
  private isWaitingPos: Boolean = false;
  private material: PointsMaterial | null = null;
  private LEOGeometry: BufferGeometry | null = null;
  private MEOGeometry: BufferGeometry | null = null;
  private HEOGeometry: BufferGeometry | null = null;
  private LEOSatellites: Points | null = null;
  private MEOSatellites: Points | null = null;
  private HEOSatellites: Points | null = null;
  private liveMode = true;
  private speed = 1;
  private displayedSat: IStartSateData[] = [];
  private filters: setFilters = { orbit: null };
  private LEOvertices: Float32Array | null = null;
  private MEOvertices: Float32Array | null = null;
  private HEOvertices: Float32Array | null = null;
  // private PARAMS: any = {
  //   ISSPosition: new Vector3(),
  //   radiusFromEarth: 1,
  //   instancesCount: 1,
  //   spreadRatio: 0.05,
  //   scaleMin: 10,
  //   scaleMax: 10,
  //   speed: 0.4,
  //   blending: true,
  // };

  constructor() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui!.addFolder("Satellites");
      this.setDebug();
    }
    this.getSatellitesTLES().then(async () => {
      this.setGeometry();
      this.setMaterial();
      // this.getSatPositionsFromTLE(true);
      this.test();
    });
  }

  update() {
    if (this.liveMode && !this.isWaitingPos) this.getSatPositionsFromTLE(false);
  }
  setGeometry() {
    this.LEOGeometry = new BufferGeometry();
    this.MEOGeometry = new BufferGeometry();
    this.HEOGeometry = new BufferGeometry();
  }
  setMaterial() {
    this.material = new PointsMaterial({ color: 0xffffff, size: 400 });
  }

  async getSatellitesTLES() {
    try {
      await getSatellites().then((TLELines) => {
        if (TLELines != null) {
          // this.satelittesTLEList = TLELines;
          this.displayedSat = TLELines;
        }
      });
    } catch (error) {}
  }

  test() {
    const satnum = 1
    const geometry = new InstancedBufferGeometry();
    geometry.instanceCount = satnum;
    geometry.setAttribute("position", new Float32BufferAttribute([0, 0, 0], 3));
    const material = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
    });
    const mesh = new Points(geometry, material);
    this.scene.add(mesh);
  }

  getSatPositionsFromTLE(isInit: boolean) {
    if (window.Worker && this.experience.time) {
      const message = [
        this.displayedSat,
        new Date(
          this.experience.time?.start +
            this.experience.time.elapsed * this.speed
        ),
        this.filters,
      ];
      const worker = new MyWorker();
      this.isWaitingPos = true;
      worker.postMessage(message);
      worker.onmessage = (e: any) => {
        this.LEOvertices = e.data.LEOvertices;
        this.MEOvertices = e.data.MEOvertices;
        this.HEOvertices = e.data.HEOvertices;
        if (this.material) {
          if (isInit) {
            // Init mode
            if (this.LEOGeometry && this.LEOvertices) {
              this.LEOGeometry.setAttribute(
                "position",
                new BufferAttribute(this.LEOvertices, 3)
              );
              this.LEOSatellites = new Points(this.LEOGeometry, this.material);
              this.scene.add(this.LEOSatellites);
            }
            if (this.MEOGeometry && this.MEOvertices) {
              this.MEOGeometry.setAttribute(
                "position",
                new BufferAttribute(this.MEOvertices, 3)
              );
              this.MEOSatellites = new Points(this.MEOGeometry, this.material);
              this.scene.add(this.MEOSatellites);
            }
            if (this.HEOGeometry && this.HEOvertices) {
              this.HEOGeometry.setAttribute(
                "position",
                new BufferAttribute(this.HEOvertices, 3)
              );
              this.HEOSatellites = new Points(this.HEOGeometry, this.material);
              this.scene.add(this.HEOSatellites);
            }
          } else {
            // Update mode
            if (this.LEOGeometry)
              this.LEOGeometry.attributes.position = new BufferAttribute(
                e.data.LEOvertices,
                3
              );
            if (this.MEOGeometry)
              this.MEOGeometry.attributes.position = new BufferAttribute(
                e.data.MEOvertices,
                3
              );
            if (this.HEOGeometry)
              this.HEOGeometry.attributes.position = new BufferAttribute(
                e.data.HEOvertices,
                3
              );
          }
          this.isWaitingPos = false;
        }
        worker.terminate();
      };
    }
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder
        ?.add(this, "speed")
        .name("Speed")
        .min(1)
        .max(1000)
        .step(1);
    }
  }
}
