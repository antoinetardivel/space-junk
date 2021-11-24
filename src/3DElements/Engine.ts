import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import earthmap from "../assets/earthtexture.jpg";
import circle from "../assets/circle.png";
import {
  parseTleFile,
  getPositionFromTle,
  getAngleFromTle,
} from "../utils/parseTle";
import { earthRadius } from "satellite.js/lib/constants";
import { IStation, IStationOptions } from "../types/models";
import flagVertexShader from "../shaders/satellite/vertex.glsl";
import flagFragmentsShader from "../sharders/satellite/fragments.glsl";

const SatelliteSize = 50;
const ixpdotp = 1440 / (2.0 * 3.141592654);

let TargetDate = new Date();

const defaultOptions = {
  backgroundColor: 0x010101,
  defaultSatelliteColor: new THREE.Color("#ffffff"),
  onStationClicked: null,
};

const defaultStationOptions = {
  orbitMinutes: 0,
  satelliteSize: 50,
};

export class Engine {
  private el: HTMLDivElement | null = null;
  private raycaster: THREE.Raycaster | null = null;
  private options: any = {};
  private controls: OrbitControls | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private earth: THREE.Mesh | THREE.Group | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.MeshBasicMaterial | THREE.RawShaderMaterial | null =
    null;
  private scene: THREE.Scene | null = null;
  private _satelliteSprite: THREE.Texture | null = null;
  private selectedMaterial: THREE.RawShaderMaterial | null = null;
  private highlightedMaterial: THREE.RawShaderMaterial | null = null;
  private orbitMaterial: THREE.LineBasicMaterial | null = null;
  private stations: IStation[] = [];
  private groupSat: THREE.Group | null = null;

  initialize(container: HTMLDivElement, options = {}) {
    this.el = container;
    this.raycaster = new THREE.Raycaster();
    this.options = { ...defaultOptions, ...options };

    this._setupScene();
    this._setupLights();
    this._addBaseObjects();

    this.render();

    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("pointerdown", this.handleMouseDown);
  }

  dispose() {
    window.removeEventListener("pointerdown", this.handleMouseDown);
    window.removeEventListener("resize", this.handleWindowResize);
    //window.cancelAnimationFrame(this.requestID);

    this.raycaster = null;
    this.el = null;
    this.controls?.dispose();
  }

  handleWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer?.setSize(width, height);
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    this.render();
  };

  handleMouseDown = (e: PointerEvent) => {
    const mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    if (this.camera) this.raycaster?.setFromCamera(mouse, this.camera);

    let station = null;
    if (this.scene) {
      let intersects: THREE.Intersection[] | undefined =
        this.raycaster?.intersectObjects(this.scene.children, true);
      if (intersects && intersects.length > 0) {
        const picked = intersects[0].object;
        if (picked) {
          station = this._findStationFromMesh(picked);
        }
      }
    }

    const cb = this.options.onStationClicked;
    if (cb) cb(station);
  };

  // __ API _________________________________________________________________

  addSatellite = (station: IStation, color: THREE.Color, size: number) => {
    const sat = this._getSatelliteSprite(color, size);
    const pos = this._getSatellitePositionFromTle(station);
    const geoCoords = this._getAngleFromTle(station);
    if (!pos) return;

    sat.position.set(pos.x, pos.y, pos.z);
    station.mesh = sat;
    station.geoCoords = geoCoords as {
      height: number;
      latitude: number;
      longitude: number;
    };

    this.stations.push(station);

    if (station.orbitMinutes > 0) this.addOrbit(station);

    this.groupSat?.add(sat);
  };

  removeSatellite = (station: IStation) => {
    this.groupSat?.remove(station.mesh);
    this.removeOrbit(station);
  };

  removeAllSatellites = (stations: IStation[]) => {
    stations.map((station) => this.removeSatellite(station));
  };

  loadLteFileStations = async (
    url: string,
    color: THREE.Color,
    stationOptions?: IStationOptions
  ) => {
    const options = { ...defaultStationOptions, ...stationOptions };

    return fetch(url).then((res) => {
      if (res.ok) {
        return res.text().then((text) => {
          return this._addTleFileStations(text, color, options);
        });
      }
    });
  };

  addOrbit = (station: IStation) => {
    if (station.orbitMinutes > 0) return;

    const revsPerDay = station.satrec.no * ixpdotp;
    const intervalMinutes = 1;
    const minutes = station.orbitMinutes || 1440 / revsPerDay;
    const initialDate = new Date();

    if (!this.orbitMaterial) {
      this.orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x243984,
        opacity: 1.0,
        transparent: true,
      });
    }

    let points = [];

    for (let i = 0; i <= minutes; i += intervalMinutes) {
      const date = new Date(initialDate.getTime() + i * 60000);

      const pos = getPositionFromTle(station, date);
      if (!pos) continue;

      points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    let orbitCurve = new THREE.Line(geometry, this.orbitMaterial);
    station.orbit = orbitCurve;
    if (this.selectedMaterial) station.mesh.material = this.selectedMaterial;

    this.groupSat?.add(orbitCurve);
    this.render();
  };

  removeOrbit = (station: IStation) => {
    if (!station || !station.orbit) return;

    this.groupSat?.remove(station.orbit);
    station.orbit.geometry.dispose();
    station.orbit = null;
    if (this.material)
      station.mesh.material = this.material as THREE.RawShaderMaterial;
    this.render();
  };

  // highlightStation = (station: IStation) => {
  //   if (this.highlightedMaterial)
  //     station.mesh.material = this.highlightedMaterial;
  // };

  // clearStationHighlight = (station: IStation) => {
  //   if (this.material)
  //     station.mesh.material = this.material as THREE.SpriteMaterial;
  // };

  _addTleFileStations = async (
    lteFileContent: string,
    color: THREE.Color,
    stationOptions: any
  ) => {
    const stations = parseTleFile(lteFileContent, stationOptions);

    const { satelliteSize } = stationOptions;

    stations.forEach((s) => {
      /*if (s.name.includes('ISS (ZARYA)'))
            {
                this.addSatellite(s, 0xfca300, satelliteSize);
            }

            if (s.name.includes('SWISSCUBE'))
            {
                this.addSatellite(s, 0xfca300, satelliteSize);
            }*/
      //else{
      this.addSatellite(s, color, satelliteSize);
      //}
    });

    this.render();

    return stations;
  };

  // _getSatelliteMesh = (color: THREE.Color, size: number) => {
  //   color = color || this.options.defaultSatelliteColor;
  //   size = size || SatelliteSize;

  //   if (!this.geometry) {
  //     this.geometry = new THREE.BoxBufferGeometry(size, size, size);
  //     this.material = new THREE.MeshPhongMaterial({
  //       color: color,
  //       emissive: new THREE.Color("#ff4040"),
  //       flatShading: false,
  //       side: THREE.DoubleSide,
  //     });
  //   }
  //   if (this.material) return new THREE.Mesh(this.geometry, this.material);
  //   return null;
  // };

  _setupSpriteMaterials = (color: THREE.Color) => {
    if (this.material) return;

    this._satelliteSprite = new THREE.TextureLoader().load(circle, this.render);
    this._satelliteSprite.minFilter = THREE.NearestFilter;
    this._satelliteSprite.magFilter = THREE.NearestFilter;
    this._satelliteSprite.generateMipmaps = false;

    this.selectedMaterial = new THREE.RawShaderMaterial({
      vertexShader: ``,
      fragmentShader: ``,
      uniforms: {
        uColor: { value: new THREE.Color("#416bff") },
      },
    });
    this.highlightedMaterial = new THREE.RawShaderMaterial({
      vertexShader: ``,
      fragmentShader: ``,
      uniforms: {
        uColor: { value: new THREE.Color("#fca300") },
      },
    });
    this.material = new THREE.RawShaderMaterial({
      vertexShader: ``,
      fragmentShader: ``,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
      },
    });
    // this.highlightedMaterial = new THREE.MeshBasicMaterial({ color: 0xfca300 });
    // this.material = new THREE.MeshBasicMaterial({ color: color });
    // this.selectedMaterial = new THREE.SpriteMaterial({
    //   map: this._satelliteSprite,
    //   color: new THREE.Color("#416BFF"),
    // });
    // this.highlightedMaterial = new THREE.SpriteMaterial({
    //   map: this._satelliteSprite,
    //   color: new THREE.Color("#fca300"),
    // });
    // this.material = new THREE.SpriteMaterial({
    //   map: this._satelliteSprite,
    //   color: color,
    // });
  };

  _getSatelliteSprite = (color: THREE.Color, size: number) => {
    const SpriteScaleFactor = 4;

    this._setupSpriteMaterials(color);
    const geometry = new THREE.PlaneGeometry(1, 1);
    // const result = new THREE.Sprite(
    //   this.material as THREE.MeshBasicMaterial | undefined
    // );
    const result = new THREE.Mesh(
      geometry,
      this.material as THREE.RawShaderMaterial | undefined
    );

    result.scale.set(size * SpriteScaleFactor, size * SpriteScaleFactor, 1);
    return result;
  };

  _getSatellitePositionFromTle = (station: IStation, date?: Date) => {
    date = date || TargetDate;
    return getPositionFromTle(station, date);
  };

  _getAngleFromTle = (station: IStation, date?: Date) => {
    date = date || TargetDate;
    return getAngleFromTle(station, date);
  };

  updateSatellitePosition = (station: IStation, date: Date) => {
    date = date || TargetDate;

    const pos = getPositionFromTle(station, date);
    if (!pos) return;

    station.mesh.position.set(pos.x, pos.y, pos.z);
  };

  updateAllPositions = (date: Date) => {
    if (!this.stations) return;

    this.stations.forEach((station) => {
      this.updateSatellitePosition(station, date);
    });

    // this.render();
  };

  // __ Scene _______________________________________________________________

  _setupScene = () => {
    if (this.el) {
      const width = this.el.clientWidth;
      const height = window.innerHeight;

      this.scene = new THREE.Scene();

      this.groupSat = new THREE.Group();
      this.scene.add(this.groupSat);

      this._setupCamera(width, height);

      this.renderer = new THREE.WebGLRenderer({
        logarithmicDepthBuffer: true,
        antialias: true,
      });

      this.renderer.setClearColor(
        new THREE.Color(this.options.backgroundColor)
      );
      this.renderer.setSize(width, height);

      this.el.appendChild(this.renderer.domElement);
    } else {
      console.log("Container is not defined");
    }
  };

  _setupCamera(width: number, height: number) {
    if (this.el) {
      let NEAR = 1e-6,
        FAR = 1e27;
      this.camera = new THREE.PerspectiveCamera(54, width / height, NEAR, FAR);
      this.controls = new OrbitControls(this.camera, this.el);
      this.controls.enablePan = false;
      this.controls.addEventListener("change", () => this.render());
      this.camera.position.z = -15000;
      this.camera.position.x = 15000;
      this.camera.lookAt(0, 0, 0);
    } else {
      console.log("Container is not defined");
    }
  }

  _setupLights = () => {
    const sun = new THREE.PointLight(0xffffff, 1, 0);
    //sun.position.set(0, 0, -149400000);
    sun.position.set(0, 59333894, -137112541);

    const ambient = new THREE.AmbientLight(0x909090);

    this.scene?.add(sun);
    this.scene?.add(ambient);
  };

  _addBaseObjects = () => {
    this._addEarth();
  };

  render = () => {
    if (this.scene && this.camera)
      this.renderer?.render(this.scene, this.camera);
    //this.requestID = window.requestAnimationFrame(this._animationLoop);
  };

  // __ Scene contents ______________________________________________________

  _addEarth = () => {
    // const textLoader = new THREE.TextureLoader();

    const group = new THREE.Group();

    // Planet
    let geometry = new THREE.SphereGeometry(earthRadius, 15, 15);
    let material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x7f7f7f,
      //emissive: 0x072534,
      //   side: THREE.DoubleSide,
      // flatShading: false,
      // map: textLoader.load(earthmap, this.render),
    });

    const earth = new THREE.Mesh(geometry, material);
    group.add(earth);

    // // Axis
    // material = new THREE.LineBasicMaterial({ color: 0xffffff });
    // geometry = new THREE.Geometry();
    // geometry.vertices.push(
    //   new THREE.Vector3(0, -7000, 0),
    //   new THREE.Vector3(0, 7000, 0)
    // );

    // let earthRotationAxis = new THREE.Line(geometry, material);
    // group.add(earthRotationAxis);

    this.earth = group;
    this.scene?.add(this.earth);
  };

  rotateEarth = (rotation: number) => {
    this.earth!.rotation.y = rotation;
    this.groupSat!.rotation.y = rotation;
  };

  _findStationFromMesh = (threeObject: THREE.Object3D<THREE.Event>) => {
    for (let i = 0; i < this.stations.length; ++i) {
      const s = this.stations[i];

      if (s.mesh === threeObject) return s;
    }

    return null;
  };
}
