import Physics from "Physics/Physics";

function collides(p1, p2) {
  return p1?.collision == p2.uid;
}

export default collides;
