const packets = {};
const p = {
  "PACKET_ENTER_WORLD": 0,
  "PACKET_ENTITY_UPDATE": 1,
  "PACKET_INPUT": 2,
  "PACKET_PING": 3,
  "PACKET_RPC": 4
}

Object.keys(p).forEach(i => {
  const packet = p[i];
  packets[packet] = i
  packets[i] = packet
});

export default packets;
