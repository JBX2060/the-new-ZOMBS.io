from Network.PacketIds import packets

import msgpack
import asyncio
import websockets

def SendEnterWorld(socket, packet):
  try:
    asyncio.ensure_future(socket.send(msgpack.packb({
      "opcode": packets["PACKET_ENTER_WORLD"],
      **packet
    })))
  except websockets.exceptions.ConnectionClosed:
    try:
      del data["clients"][Util.socketUid(websocket)]
    except Exception:
      pass
