import Util from "Util/Util";

function diff(obj1 = {}, obj2 = {}, exclude = []) {
  if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) {
    return obj2;
  }

  const result = {};

  for (const i of Object.keys(obj1)) {
    if (!(Object.keys(obj2).indexOf(i) >= 0)) {
      result[i] = obj1[i];
    }
  }

  for (const i of Object.keys(obj2)) {
    if (exclude.indexOf(i) >= 0) {
      if (obj1[i] && obj1[i].length === 0) continue;
      result[i] = obj1[i];
    } else {
      const prop = obj2[i];

      if (Array.isArray(prop)) {
        for (let j in prop) {
          if (!obj1[i]) continue;
          const changes = Util.diff(obj1[i][j], prop[j]);

          if (Object.keys(changes).length) {
            if (!result[i]) result[i] = [];
            result[i][j] = changes;
          }
        }
      } else if (prop instanceof Object) {
        const changes = Util.diff(obj1[i], prop);

        if (Object.keys(changes).length)
          result[i] = changes;
      } else {
        if (obj1[i] !== prop) {
          result[i] = prop;
        }
      }
    }
  }

  return result;
}

export default diff;