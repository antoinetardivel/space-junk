import {
  pi,
  twoPi,
  earthRadius,
  xke,
  vkmpersec,
  j2,
  j3oj2,
  x2o3,
} from '../constants';

import dpper from './dpper';
import dspace from './dspace';

/*----------------------------------------------------------------------------
 *
 *                             procedure sgp4
 *
 *  this procedure is the sgp4 prediction model from space command. this is an
 *    updated and combined version of sgp4 and sdp4, which were originally
 *    published separately in spacetrack report //3. this version follows the
 *    methodology from the aiaa paper (2006) describing the history and
 *    development of the code.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    satrec  - initialised structure from sgp4init() call.
 *    tsince  - time since epoch (minutes)
 *
 *  outputs       :
 *    r           - position vector                     km
 *    v           - velocity                            km/sec
 *  return code - non-zero on error.
 *                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
 *                   2 - mean motion less than 0.0
 *                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
 *                   4 - semi-latus rectum < 0.0
 *                   5 - epoch elements are sub-orbital
 *                   6 - satellite has decayed
 *
 *  locals        :
 *    am          -
 *    axnl, aynl        -
 *    betal       -
 *    cosim   , sinim   , cosomm  , sinomm  , cnod    , snod    , cos2u   ,
 *    sin2u   , coseo1  , sineo1  , cosi    , sini    , cosip   , sinip   ,
 *    cosisq  , cossu   , sinsu   , cosu    , sinu
 *    delm        -
 *    delomg      -
 *    dndt        -
 *    eccm        -
 *    emsq        -
 *    ecose       -
 *    el2         -
 *    eo1         -
 *    eccp        -
 *    esine       -
 *    argpm       -
 *    argpp       -
 *    omgadf      -
 *    pl          -
 *    r           -
 *    rtemsq      -
 *    rdotl       -
 *    rl          -
 *    rvdot       -
 *    rvdotl      -
 *    su          -
 *    t2  , t3   , t4    , tc
 *    tem5, temp , temp1 , temp2  , tempa  , tempe  , templ
 *    u   , ux   , uy    , uz     , vx     , vy     , vz
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    nodem       - right asc of ascending node
 *    xinc        -
 *    xincp       -
 *    xl          -
 *    xlm         -
 *    mp          -
 *    xmdf        -
 *    xmx         -
 *    xmy         -
 *    nodedf      -
 *    xnode       -
 *    nodep       -
 *    np          -
 *
 *  coupling      :
 *    getgravconst-
 *    dpper
 *    dspace
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report //3 1980
 *    hoots, norad spacetrack report //6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 ----------------------------------------------------------------------------*/
void sgp4(
float bstar,
float inclo,
float nodeo,
float ecco,
float argpo,
float mo,
float no,
float error,
float tsince) {

  float coseo1;
  float sineo1;
  float cosip;
  float sinip;
  float cosisq;
  float delm;
  float delomg;
  float eo1;
  float argpm;
  float argpp;
  float su;
  float t3;
  float t4;
  float tc;
  float tem5;
  float temp;
  float tempa;
  float tempe;
  float templ;
  float inclm;
  float mm;
  float nm;
  float nodem;
  float xincp;
  float xlm;
  float mp;
  float nodep;

  /* ------------------ set mathematical constants --------------- */
  // sgp4fix divisor for divide by zero check on inclination
  // the old check used 1.0 + cos(pi-1.0e-9), but then compared it to
  // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency

  const temp4 = 1.5e-12;

  // --------------------- clear sgp4 error flag -----------------
  t = tsince;
  error = 0;

  //  ------- update for secular gravity and atmospheric drag -----
  const xmdf = mo + (satrec.mdot * t);
  const argpdf = argpo + (satrec.argpdot * t);
  const nodedf = nodeo + (satrec.nodedot * t);
  argpm = argpdf;
  mm = xmdf;
  const t2 = t * t;
  nodem = nodedf + (satrec.nodecf * t2);
  tempa = 1.0 - (satrec.cc1 * t);
  tempe = bstar * satrec.cc4 * t;
  templ = t2cof * t2;

  if (satrec.isimp !== 1) {
    delomg = satrec.omgcof * t;
    //  sgp4fix use mutliply for speed instead of pow
    const delmtemp = 1.0 + (satrec.eta * Math.cos(xmdf));
    delm = satrec.xmcof * ((delmtemp * delmtemp * delmtemp) - satrec.delmo);
    temp = delomg + delm;
    mm = xmdf + temp;
    argpm = argpdf - temp;
    t3 = t2 * t;
    t4 = t3 * t;
    tempa = tempa - (satrec.d2 * t2) - (satrec.d3 * t3) - (satrec.d4 * t4);
    tempe += bstar * satrec.cc5 * (Math.sin(mm) - satrec.sinmao);
    templ = templ + (t3cof * t3) + (t4 * (t4cof + (t * t5cof)));
  }
  nm = no;
  let em = ecco;
  inclm = inclo;
  if (satrec.method === 'd') {
    tc = t;

    const dspaceOptions = {
      irez: satrec.irez,
      d2201: satrec.d2201,
      d2211: satrec.d2211,
      d3210: satrec.d3210,
      d3222: satrec.d3222,
      d4410: satrec.d4410,
      d4422: satrec.d4422,
      d5220: satrec.d5220,
      d5232: satrec.d5232,
      d5421: satrec.d5421,
      d5433: satrec.d5433,
      dedt: satrec.dedt,
      del1: satrec.del1,
      del2: satrec.del2,
      del3: satrec.del3,
      didt: satrec.didt,
      dmdt: satrec.dmdt,
      dnodt: satrec.dnodt,
      domdt: satrec.domdt,
      argpo: argpo,
      argpdot: satrec.argpdot,
      t: t,
      tc,
      gsto: satrec.gsto,
      xfact: satrec.xfact,
      xlamo: satrec.xlamo,
      no: no,
      atime: satrec.atime,
      em,
      argpm,
      inclm,
      xli: satrec.xli,
      mm,
      xni: satrec.xni,
      nodem,
      nm,
    };

    const dspaceResult = dspace(dspaceOptions);

    ({
      em,
      argpm,
      inclm,
      mm,
      nodem,
      nm,
    } = dspaceResult);
  }

  if (nm <= 0.0) {
    // printf("// error nm %f\n", nm);
    error = 2;
    // sgp4fix add return
    return [false, false];
  }

  const am = ((xke / nm) ** x2o3) * tempa * tempa;
  nm = xke / (am ** 1.5);
  em -= tempe;

  // fix tolerance for error recognition
  // sgp4fix am is fixed from the previous nm check
  if (em >= 1.0 || em < -0.001) { // || (am < 0.95)
    // printf("// error em %f\n", em);
    error = 1;
    // sgp4fix to return if there is an error in eccentricity
    return [false, false];
  }

  //  sgp4fix fix tolerance to avoid a divide by zero
  if (em < 1.0e-6) {
    em = 1.0e-6;
  }
  mm += no * templ;
  xlm = mm + argpm + nodem;

  nodem %= twoPi;
  argpm %= twoPi;
  xlm %= twoPi;
  mm = (xlm - argpm - nodem) % twoPi;

  // ----------------- compute extra mean quantities -------------
  const sinim = Math.sin(inclm);
  const cosim = Math.cos(inclm);

  // -------------------- add lunar-solar periodics --------------
  let ep = em;
  xincp = inclm;
  argpp = argpm;
  nodep = nodem;
  mp = mm;
  sinip = sinim;
  cosip = cosim;
  if (satrec.method === 'd') {
    const dpperParameters = {
      inclo: inclo,
      init: 'n',
      ep,
      inclp: xincp,
      nodep,
      argpp,
      mp,
      opsmode: satrec.operationmode,
    };

    const dpperResult = dpper(satrec, dpperParameters);

    ({
      ep,
      nodep,
      argpp,
      mp,
    } = dpperResult);

    xincp = dpperResult.inclp;

    if (xincp < 0.0) {
      xincp = -xincp;
      nodep += pi;
      argpp -= pi;
    }
    if (ep < 0.0 || ep > 1.0) {
      //  printf("// error ep %f\n", ep);
      error = 3;
      //  sgp4fix add return
      return [false, false];
    }
  }

  //  -------------------- long period periodics ------------------
  if (satrec.method === 'd') {
    sinip = Math.sin(xincp);
    cosip = Math.cos(xincp);
    satrec.aycof = -0.5 * j3oj2 * sinip;

    //  sgp4fix for divide by zero for xincp = 180 deg
    if (Math.abs(cosip + 1.0) > 1.5e-12) {
      satrec.xlcof = (-0.25 * j3oj2 * sinip * (3.0 + (5.0 * cosip))) / (1.0 + cosip);
    } else {
      satrec.xlcof = (-0.25 * j3oj2 * sinip * (3.0 + (5.0 * cosip))) / temp4;
    }
  }

  const axnl = ep * Math.cos(argpp);
  temp = 1.0 / (am * (1.0 - (ep * ep)));
  const aynl = (ep * Math.sin(argpp)) + (temp * satrec.aycof);
  const xl = mp + argpp + nodep + (temp * satrec.xlcof * axnl);

  // --------------------- solve kepler's equation ---------------
  const u = (xl - nodep) % twoPi;
  eo1 = u;
  tem5 = 9999.9;
  let ktr = 1;

  //    sgp4fix for kepler iteration
  //    the following iteration needs better limits on corrections
  while (Math.abs(tem5) >= 1.0e-12 && ktr <= 10) {
    sineo1 = Math.sin(eo1);
    coseo1 = Math.cos(eo1);
    tem5 = 1.0 - (coseo1 * axnl) - (sineo1 * aynl);
    tem5 = (((u - (aynl * coseo1)) + (axnl * sineo1)) - eo1) / tem5;
    if (Math.abs(tem5) >= 0.95) {
      if (tem5 > 0.0) {
        tem5 = 0.95;
      } else {
        tem5 = -0.95;
      }
    }
    eo1 += tem5;
    ktr += 1;
  }

  //  ------------- short period preliminary quantities -----------
  const ecose = (axnl * coseo1) + (aynl * sineo1);
  const esine = (axnl * sineo1) - (aynl * coseo1);
  const el2 = (axnl * axnl) + (aynl * aynl);
  const pl = am * (1.0 - el2);
  if (pl < 0.0) {
    //  printf("// error pl %f\n", pl);
    error = 4;
    //  sgp4fix add return
    return [false, false];
  }

  const rl = am * (1.0 - ecose);
  const rdotl = (Math.sqrt(am) * esine) / rl;
  const rvdotl = Math.sqrt(pl) / rl;
  const betal = Math.sqrt(1.0 - el2);
  temp = esine / (1.0 + betal);
  const sinu = (am / rl) * (sineo1 - aynl - (axnl * temp));
  const cosu = (am / rl) * ((coseo1 - axnl) + (aynl * temp));
  su = Math.atan2(sinu, cosu);
  const sin2u = (cosu + cosu) * sinu;
  const cos2u = 1.0 - (2.0 * sinu * sinu);
  temp = 1.0 / pl;
  const temp1 = 0.5 * j2 * temp;
  const temp2 = temp1 * temp;

  // -------------- update for short period periodics ------------
  if (satrec.method === 'd') {
    cosisq = cosip * cosip;
    satrec.con41 = (3.0 * cosisq) - 1.0;
    satrec.x1mth2 = 1.0 - cosisq;
    satrec.x7thm1 = (7.0 * cosisq) - 1.0;
  }

  const mrt = (rl * (1.0 - (1.5 * temp2 * betal * satrec.con41)))
    + (0.5 * temp1 * satrec.x1mth2 * cos2u);

  // sgp4fix for decaying satellites
  if (mrt < 1.0) {
    // printf("// decay condition %11.6f \n",mrt);
    error = 6;
    return {
      position: false,
      velocity: false,
    };
  }

  su -= 0.25 * temp2 * satrec.x7thm1 * sin2u;
  float xnode = nodep + (1.5 * temp2 * cosip * sin2u);
  float xinc = xincp + (1.5 * temp2 * cosip * sinip * cos2u);
  float mvt = rdotl - ((nm * temp1 * satrec.x1mth2 * sin2u) / xke);
  float rvdot = rvdotl + ((nm * temp1 * ((satrec.x1mth2 * cos2u) + (1.5 * satrec.con41))) / xke);

  // --------------------- orientation vectors -------------------
  float sinsu = Math.sin(su);
  float cossu = Math.cos(su);
  float snod = Math.sin(xnode);
  float cnod = Math.cos(xnode);
  float sini = Math.sin(xinc);
  float cosi = Math.cos(xinc);
  float xmx = -snod * cosi;
  float xmy = cnod * cosi;
  float ux = (xmx * sinsu) + (cnod * cossu);
  float uy = (xmy * sinsu) + (snod * cossu);
  float uz = sini * sinsu;
  float vx = (xmx * cossu) - (cnod * sinsu);
  float vy = (xmy * cossu) - (snod * sinsu);
  float vz = sini * cossu;

  // --------- position and velocity (in km and km/sec) ----------
  const r = {
    x: (mrt * ux) * earthRadius,
    y: (mrt * uy) * earthRadius,
    z: (mrt * uz) * earthRadius,
  };
  const v = {
    x: ((mvt * ux) + (rvdot * vx)) * vkmpersec,
    y: ((mvt * uy) + (rvdot * vy)) * vkmpersec,
    z: ((mvt * uz) + (rvdot * vz)) * vkmpersec,
  };

  return {
    position: r,
    velocity: v,
  };

  /* eslint-enable no-param-reassign */
}