function randomPosition({
  width,
  height
}) {
  const x = Math.floor(Math.random() * width) + 0;
  const y = Math.floor(Math.random() * height) + 0;

  return { x, y };
}

export default randomPosition;
