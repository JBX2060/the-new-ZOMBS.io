from Network.PacketIds import packets
from Util.Util import Util

import msgpack
import asyncio
import websockets

def SendEntityUpdate(socket, packet):
  try:
    asyncio.get_event_loop().run_until_complete(socket.send(msgpack.packb({
      "opcode": packets["PACKET_ENTITY_UPDATE"],
      "tick": Util.getTick(),
      "entities": packet
    })))
  except websockets.exceptions.ConnectionClosed:
    try:
      del data["clients"][Util.socketUid(websocket)]
    except Exception:
      pass
