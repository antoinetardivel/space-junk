import { AmbientLight, PointLight, Scene } from 'three';
import Experience from '../Experience';

export default class Lights {
  private experience: Experience = new Experience();
  private scene: Scene = this.experience.scene as Scene;
  private sunLight: PointLight | null = null;
  private ambientLight: AmbientLight | null = null;
  constructor() {
    this.setSunLight();
    this.setAmbientLight();
  }

  setSunLight() {
    this.sunLight = new PointLight(0xffffff, 1, 0);
    this.sunLight.position.set(0, 59333894, -137112541);
    this.scene.add(this.sunLight);
  }

  setAmbientLight() {
    this.ambientLight = new AmbientLight(0x909090);
    this.scene.add(this.ambientLight);
  }

  destroy() {
    this.sunLight?.dispose();
    this.ambientLight?.dispose();
  }
}
