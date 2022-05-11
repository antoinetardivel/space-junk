extern crate cfg_if;
extern crate sgp4;

mod utils;

use wasm_bindgen::prelude::*;
use cfg_if::cfg_if;

cfg_if! {
   if #[cfg(feature = "wee_alloc")] {
      #[global_allocator]
      static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
   }
}
// #[wasm_bindgen]
// pub struct SatelliteData {
//    name: String,
//    tle1: String,
//    tle2: String,
// }
// #[wasm_bindgen]
// pub struct Message {
//    tles: Box<[SatelliteData]>,
//    date: f64,
// }

#[wasm_bindgen]
extern {
   fn alert(s: String);
}

#[wasm_bindgen]
pub fn test(){
   utils::set_panic_hook();
   alert("webrgoi".to_string());
   // const DATE2: f64 = 1646312799131.0_f64;
   // let constants = sgp4::Constants::from_elements_afspc_compatibility_mode(
   //    &sgp4::Elements::from_tle(
   //       Some("VANGUARD 1 ".to_owned()),
   //       "1 00005U 58002B   22062.50629885  .00000325  00000-0  39282-3 0  9992".as_bytes(),
   //       "2 00005  34.2575 105.8588 1845192 280.6940  59.2144 10.84870171273034".as_bytes(),
   //    ).unwrap(),
   // ).unwrap();
   // let mut state = constants.initial_state();
   // let prediction = constants.propagate_from_state((DATE2) as f64, state.as_mut(), false).unwrap();
   // // let x = &prediction.position[0].to_string()[..];
   // alert(prediction.position[0].to_string());
}

// #[wasm_bindgen]
// impl Message {
//    #[wasm_bindgen]
//    pub fn get_satellites_positions(&self) -> String {
//       utils::set_panic_hook();
//       const DATE2: f64 = 1646312799131.0_f64;
//       let mut postest: String = "yes".to_string();
//       for sat in self.tles.iter() {
//          let constants = sgp4::Constants::from_elements_afspc_compatibility_mode(
//             &sgp4::Elements::from_tle(
//                Some(sat.name.to_owned()),
//                sat.tle1.as_bytes(),
//                sat.tle2.as_bytes(),
//             ).unwrap(),
//          ).unwrap();
//          let mut state = constants.initial_state();
//          let prediction = constants.propagate_from_state((DATE2) as f64, state.as_mut(), false).unwrap();
//          let _positions: [String; 3] = [
//             prediction.position[0].to_string(),
//             prediction.position[1].to_string(),
//             prediction.position[2].to_string()
//          ];
//          postest = prediction.position[2].to_string()
//       }
//       return postest;
//    }
// }
