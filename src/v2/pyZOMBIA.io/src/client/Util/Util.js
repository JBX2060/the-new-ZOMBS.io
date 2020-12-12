class Util {
  static lerp(start, end, ratio = 1) {
    return start + (end - start) * (ratio > 1.2 ? 1 : ratio);
  }
}

export default Util;
