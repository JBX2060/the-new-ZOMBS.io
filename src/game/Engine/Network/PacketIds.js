const PacketIds = {
  "PACKET_ENTITY_UPDATE": 0,
  "PACKET_PLAYER_COUNTER_UPDATE": 1,
  "PACKET_SET_WORLD_DIMENSIONS": 2,
  "PACKET_INPUT": 3,
  "PACKET_ENTER_WORLD": 4,
  "PACKET_PING": 7,
  "PACKET_RPC": 9
}

Object.keys(PacketIds).forEach(packet => {
  PacketIds[PacketIds[packet]] = packet;
});

export default PacketIds;
