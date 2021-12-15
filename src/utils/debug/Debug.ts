import * as dat from 'dat.gui';
import AppPref from './AppPref';
import DatUi from './DatUi';

export default class Debug {
  public active: boolean = false;
  private datUI: DatUi | null = null;
  public ui: dat.GUI | null = null;
  private stats: AppPref | null = null;
  constructor() {
    this.active = window.location.hash === '#debug';

    if (this.active) {
      this.datUI = new DatUi();
      this.ui = this.datUI.ui;
      this.stats = new AppPref();
      this.active = true;
    }
  }

  update() {
    if (this.active) this.stats?.update();
  }

  destroy() {
    this.ui?.destroy();
  }
}
