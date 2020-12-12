function distance(p1, p2) {
  if (!p1 || !p2) return;
  const rx = p1.position.x;
  const ry = p1.position.y;
  const px = p2.position.x;
  const py = p2.position.y;

  return Math.sqrt((rx - px) * (rx - px) + ((ry - py) * (ry - py)));
}

export default distance;
