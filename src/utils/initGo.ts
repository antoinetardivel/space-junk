//@ts-nocheck
const initGo = async () => {
  const go = new Go();
  // await WebAssembly.instantiateStreaming(
  //   fetch("main.wasm"),
  //   go.importObject
  // ).then((result) => {
  //   go.run(result.instance);
  // });
  let { instance, module } = await WebAssembly.instantiateStreaming(
    fetch("main.wasm"),
    go.importObject
  );
  go.run(instance);
  //@ts-nocheck
};
export default initGo;
