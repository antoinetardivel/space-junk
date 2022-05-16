import EventEmitter from "./EventEmitter";

let reqAF: number;

export default class Time extends EventEmitter {
  public start: number = Date.now();
  public now: number = 0;

  public fiftyThen: number = 0;
  public fiftyElapsed: number = 0;
  private fiftyFPS: number = 1000 / 50;

  public twentyThen: number = 0;
  public twentyElapsed: number = 0;
  private twentyFPS: number = 1000 / 5;

  constructor() {
    super();
    // Tick event
    reqAF = requestAnimationFrame(() => this.tick());
  }

  tick() {
    this.now = Date.now();
    this.fiftyElapsed = this.now - this.fiftyThen;
    this.twentyElapsed = this.now - this.twentyThen;

    //30 fps
    if (this.fiftyElapsed > this.fiftyFPS) {
      this.trigger("tick");
      this.fiftyThen = this.now - (this.fiftyElapsed % this.fiftyFPS);
    }

    // 20 fps
    if (this.twentyElapsed > this.twentyFPS) {
      this.trigger("tickSatellite");
      this.twentyThen = this.now - (this.twentyElapsed % this.twentyFPS);
    }

    reqAF = requestAnimationFrame(() => this.tick());
  }

  destroy() {
    cancelAnimationFrame(reqAF);
  }
}
