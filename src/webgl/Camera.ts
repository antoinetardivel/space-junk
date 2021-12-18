import { Scene, PerspectiveCamera, Camera as threeCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TCanvas } from "../models/global";

import Sizes from "../utils/Sizes";
import Experience from "./Experience";

export default class Camera {
  private experience: Experience = new Experience();
  private sizes: Sizes = this.experience.sizes as Sizes;
  private scene: Scene = this.experience.scene as Scene;
  private canvas: TCanvas = this.experience.canvas as TCanvas;
  public instance: PerspectiveCamera | null = null;
  public controls: OrbitControls | null = null;

  constructor() {
    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    let NEAR = 1e-6,
      FAR = 1e27;
    this.instance = new PerspectiveCamera(
      54,
      this.sizes.width / this.sizes.height,
      NEAR,
      FAR
    );
    this.instance.position.z = -20000;
    this.instance.position.x = 20000;
    this.instance.lookAt(0, 0, 0);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(
      this.instance as threeCamera,
      this.canvas as HTMLCanvasElement
    );
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance!.aspect = this.sizes.width / this.sizes.height;
    this.instance?.updateProjectionMatrix();
  }

  update() {
    this.controls?.update();
  }

  destroy() {
    this.controls?.dispose();
  }
}
