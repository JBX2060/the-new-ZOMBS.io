import * as utils from "./all";
import camelCase from "lodash/camelCase";

class Util { }

Object.keys(utils).forEach(util => {
  return Util[camelCase(util)] = utils[util];
});

export default Util;
