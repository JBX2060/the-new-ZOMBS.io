from Logger.Logger import logger

packets = {}
for i, packet in {
  "PACKET_ENTER_WORLD": 0,
  "PACKET_ENTITY_UPDATE": 1,
  "PACKET_INPUT": 2,
  "PACKET_PING": 3,
  "PACKET_RPC": 4
}.items():
  packets[packet] = i
  packets[i] = packet

