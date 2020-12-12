function getSpeed(socket, player) {
  if ([
    socket.right,
    socket.left,
    socket.up,
    socket.down
  ].filter(e => e == true).length >= 2) {
    return (player.baseSpeed * 0.7) * (player.slowed ? 0.5 : 1);
  } else {
    return player.baseSpeed * (player.slowed ? 0.5 : 1);
  }
}

export default getSpeed;
