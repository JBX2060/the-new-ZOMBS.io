function isFacing(p1, p2) {
  const rx = p2.position.x;
  const ry = p2.position.y;

  const px = p1.position.x;
  const py = p1.position.y;

  const yaw = p1.aimingYaw || p1.towerYaw || p1.yaw;

  const distance = Math.sqrt((rx - px) * (rx - px) + ((ry - py) * (ry - py)));

  let range, degree = 0;
  range = (150 / distance) * (180 / Math.PI);

  if (ry - py < 0) {
    degree = (Math.asin(rx / distance - px / distance) * 180 / Math.PI + 360) % 360;
  } else {
    degree = 180 - (Math.asin((rx / distance - px / distance)) * 180 / Math.PI);
  }
  const difference = Math.abs(degree - yaw);
  const answer = (difference <= range || difference >= 360 - range);

  return { answer, degree };
}

export default isFacing;
