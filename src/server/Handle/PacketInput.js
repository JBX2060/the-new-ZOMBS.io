import SERVER_DATA from "data/all";

const entities = SERVER_DATA.ENTITIES;

function HandlePacketInput(socket, data) {
  if (data.left == 1) {
    socket.left = true;
    socket.right = false;
  } else if (data.left == 0) {
    socket.left = false;
  }
  if (data.right == 1) {
    socket.right = true;
    socket.left = false;
  } else if (data.right == 0) {
    socket.right = false;
  }
  if (data.up == 1) {
    socket.up = true;
    socket.down = false;
  } else if (data.up == 0) {
    socket.up = false;
  }
  if (data.down == 1) {
    socket.down = true;
    socket.up = false;
  } else if (data.down == 0) {
    socket.down = false;
  }

  if (socket.down && socket.right) {
    socket.yaw = 135;
  } else if (socket.down && socket.left) {
    socket.yaw = 225;
  } else if (socket.up && socket.right) {
    socket.yaw = 45;
  } else if (socket.up && socket.left) {
    socket.yaw = 315;
  } else if (socket.up) {
    socket.yaw = 359;
  } else if (socket.right) {
    socket.yaw = 90;
  } else if (socket.down) {
    socket.yaw = 180;
  } else if (socket.left) {
    socket.yaw = 270;
  }
  entities[socket.uid].yaw = socket.yaw;

  data.mouseUp ? socket.firing = false : {};
  data.mouseDown <= 359 ? socket.firing = true : {};
  data.space == 1 ? socket.firing = !socket.firing : {};
  data.mouseMoved <= 359 ? socket.mouseMoved = data.mouseMoved : socket.mouseMoved = undefined;
  (data.respawn == 1 && entities[socket.uid].dead) ? socket.shouldRespawn = 1 : {};

  if (data.mouseMovedWhileDown <= 359) {
    socket.mouseMovedWhileDown = data.mouseMovedWhileDown;
    socket.firing = true;
  } else socket.mouseMovedWhileDown = undefined;
}

export default HandlePacketInput;
