export {};
declare global {
  namespace NodeJS {
    class Go {
      public importObject: any;
      public run(instance: WebAssembly.Instance): void;
    }
  }
}
