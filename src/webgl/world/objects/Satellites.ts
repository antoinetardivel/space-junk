import {
  Color,
  Group,
  NearestFilter,
  Scene,
  Sprite,
  SpriteMaterial,
  TextureLoader,
} from "three";
import satellitesConfig from "../../../config/satellites.config";
import { ISatelliteData } from "../../../models/satellites";
import { getSatellites } from "../../../services/satellites.service";
import { getAngleFromTle } from "../../../utils/TLE/angleTLE";
import getSatelliteThreePos from "../../../utils/TLE/positionsTLE";
import Experience from "../../Experience";

export default class Satellites {
  private experience: Experience = new Experience();
  private scene: Scene = this.experience.scene as Scene;

  private satelittesTLEList: ISatelliteData[] = [];
  private satelittesMeshList: ISatelliteData[] = [];
  private satelittesGroup: Group = new Group();

  private targetDate: Date = new Date();

  private selectedMaterial: SpriteMaterial | null = null;
  private highlightedMaterial: SpriteMaterial | null = null;
  private unselectedMaterial: SpriteMaterial | null = null;

  private satelliteSize: number = 50;
  private spriteScaleFactor: number = 4;

  constructor() {
    this.setMaterials();
    this.getAllSatellites().then(() => {
      this.addSatellitesToGroup();
      this.addGroupToScene()
    });
  }

  setMaterials() {
    const satelliteSprite = new TextureLoader().load("/textures/circle.png");
    satelliteSprite.minFilter = NearestFilter;
    satelliteSprite.magFilter = NearestFilter;
    satelliteSprite.generateMipmaps = false;

    this.selectedMaterial = new SpriteMaterial({
      map: satelliteSprite,
      color: new Color(satellitesConfig.color.selected),
    });
    this.highlightedMaterial = new SpriteMaterial({
      map: satelliteSprite,
      color: new Color(satellitesConfig.color.highlighted),
    });
    this.unselectedMaterial = new SpriteMaterial({
      map: satelliteSprite,
      color: new Color(satellitesConfig.color.unselected),
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

  addSatellitesToGroup() {
    for (const satellite of this.satelittesTLEList) {
      const satInstance = new Sprite(this.unselectedMaterial as SpriteMaterial);
      const satPosition = getSatelliteThreePos(satellite, this.targetDate);
      const satCoords = getAngleFromTle(satellite, this.targetDate);

      if (!satPosition) return;
      satInstance.position.set(satPosition.x, satPosition.y, satPosition.z);
      satInstance.scale.set(
        this.satelliteSize * this.spriteScaleFactor,
        this.satelliteSize * this.spriteScaleFactor,
        1
      );
      // satellite.mesh = satInstance;
      // if(satCoords != null) satellite.geoCoords = satCoords;
      this.satelittesGroup.add(satInstance);
    }
  }

  addGroupToScene() {
    this.scene.add(this.satelittesGroup);
  }

  deselectSatellite() {}
}
