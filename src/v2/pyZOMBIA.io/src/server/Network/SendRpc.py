from Network.PacketIds import packets

import msgpack
import asyncio
import websockets

def SendRpc(socket, packet):
  try:
    asyncio.get_event_loop().run_until_complete(socket.send(msgpack.packb({
      "opcode": packets["PACKET_RPC"],
      "response": packet
    })))
  except websockets.exceptions.ConnectionClosed:
    try:
      del data["clients"][Util.socketUid(websocket)]
    except Exception:
      pass
