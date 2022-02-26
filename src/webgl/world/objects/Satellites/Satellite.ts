import {
  Color,
  NearestFilter,
  Sprite,
  SpriteMaterial,
  TextureLoader,
} from "three";
// import { ISatelliteData } from "../../../../models/satellites";

interface ISatellitePosition {
  x: number;
  y: number;
  z: number;
}

export default class Satellite {
  public selectedMaterial: SpriteMaterial | null = null; //TODO: PASS PRIVATE
  public highlightedMaterial: SpriteMaterial | null = null; //TODO: PASS PRIVATE
  private unselectedMaterial: SpriteMaterial | null = null;
  private position: ISatellitePosition = {
    x: 0,
    y: 0,
    z: 0,
  };
  // private TLEData: ISatelliteData | null;
  private satelliteSize: number = 50;
  private spriteScaleFactor: number = 4;

  public instance: Sprite | null = null;

  constructor() {
    // this.TLEData = TLEData;
    this.setMaterials();
    this.setInstance();
  }

  setInstance() {
    this.instance = new Sprite(this.unselectedMaterial as SpriteMaterial);
    this.instance.scale.set(
      this.satelliteSize * this.spriteScaleFactor,
      this.satelliteSize * this.spriteScaleFactor,
      1
    );
  }

  setPosition(
    satpos: {
      x: number;
      y: number;
      z: number;
    } | null
  ) {
    // const satpos = getSatelliteThreePos(
    //   this.TLEData as ISatelliteData,
    //   targetDate
    // );
    if (!satpos) return;
    this.position = satpos;
    this.instance?.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
  }

  setMaterials() {
    const satelliteSprite = new TextureLoader().load("/textures/circle.png");
    satelliteSprite.minFilter = NearestFilter;
    satelliteSprite.magFilter = NearestFilter;
    satelliteSprite.generateMipmaps = false;

    this.selectedMaterial = new SpriteMaterial({
      map: satelliteSprite,
      color: new Color("#001EF0"),
    });
    this.highlightedMaterial = new SpriteMaterial({
      map: satelliteSprite,
      color: new Color("#fca300"),
    });
    this.unselectedMaterial = new SpriteMaterial({
      map: satelliteSprite,
      color: new Color("#ffffff"),
    });
  }
}
