import { GUI } from "dat.gui";
import { earthRadius } from "satellite.js/lib/constants";
import { Group, Mesh, MeshBasicMaterial, Scene, SphereGeometry } from "three";
import Experience from "../../Experience";
import Debug from "../../../utils/debug/Debug";
// import Loaders from '../../utils/Loaders';

export default class Earth {
  private experience: Experience = new Experience();
  private scene: Scene = this.experience.scene as Scene;
  //   private loaders: Loaders = this.experience.loaders as Loaders;
  private debug: Debug = this.experience.debug as Debug;
  private debugFolder: GUI | null = null;

  private innerGlobeGeometry: SphereGeometry | null = null;
  private globeGeometry: SphereGeometry | null = null;
  private innerGlobeMaterial: MeshBasicMaterial | null = null;
  private globeMaterial: MeshBasicMaterial | null = null;
  private innerGlobeMesh: Mesh | null = null;
  private globeMesh: Mesh | null = null;
  private earthGroup: Group | null = null;

  constructor() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui!.addFolder("Earth");
    }

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
    this.setGroup();
  }
  setGeometry() {
    this.innerGlobeGeometry = new SphereGeometry(earthRadius, 10, 10);
    this.globeGeometry = new SphereGeometry(earthRadius, 20, 20);
  }
  setTextures() {}
  setMaterial() {
    this.innerGlobeMaterial = new MeshBasicMaterial({ color: 0x000000 });
    this.globeMaterial = new MeshBasicMaterial({
      wireframe: true,
      color: 0x7f7f7f,
    });
  }
  setMesh() {
    if (
      this.innerGlobeMaterial &&
      this.globeMaterial &&
      this.innerGlobeGeometry &&
      this.globeGeometry
    ) {
      this.innerGlobeMesh = new Mesh(
        this.innerGlobeGeometry,
        this.innerGlobeMaterial
      );
      this.globeMesh = new Mesh(this.globeGeometry, this.globeMaterial);
    }
  }

  setGroup() {
    this.earthGroup = new Group();
    this.innerGlobeMesh && this.earthGroup.add(this.innerGlobeMesh);
    this.globeMesh && this.earthGroup.add(this.globeMesh);

    this.scene.add(this.earthGroup);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        ?.add(this.earthGroup.rotation, "x")
        .name("RotateX")
        .min(0)
        .max(5)
        .step(1);
      this.debugFolder
        ?.add(this.earthGroup.rotation, "x")
        .name("RotateX")
        .min(0)
        .max(5)
        .step(1);
    }
  }

  destroy() {
    //     this.earthGroup?.geometry.dispose();
    //     for (const key in this.mesh?.material) {
    //       //@ts-ignore
    //       const value = this.mesh?.material[key];
    //       if (value && typeof value.dispose === "function") {
    //         value.dispose();
    //       }
    //     }
  }
}
