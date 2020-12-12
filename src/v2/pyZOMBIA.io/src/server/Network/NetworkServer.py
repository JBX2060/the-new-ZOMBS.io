from Logger.Logger import logger
from Network.PacketIds import packets
from ConfigLoader.Load import config
from Handle.HandleEnterWorld import HandleEnterWorld
from Handle.HandleInput import HandleInput
from Util.Util import Util
from data import data

import time
import threading
import signal
import msgpack
import asyncio
import websockets
import sys

class NetworkServer:
  def __init__(self):
    thread = threading.Thread(target=self.start)
    thread.start()

  def start(self):
    loop = asyncio.new_event_loop()
    stop = loop.create_future()

    asyncio.set_event_loop(loop)
    loop.run_until_complete(self.start_server(stop))
    loop.call_soon_threadsafe(stop.set_result, None)
    
  async def start_server(self, stop):
    port = config["port"]
    logger.info(f"Listening for connections on port {port}")

    async with websockets.serve(self.handler, "127.0.0.1", port):
      await stop

  async def handler(self, websocket, path):
    try:
      logger.info(f"New connection from {websocket.local_address[0]}")
      async for message in websocket:
        self.process(message, websocket)
    except websockets.exceptions.ConnectionClosed:
      try:
        del data["clients"][Util.socketUid(websocket)]
      except Exception:
        pass

  def process(self, message, websocket):
    def next(packet):
      if type(packet) is dict:
        opcode = packet.get("opcode")
        logger.info(f"Received message with opcode {opcode}")

        if opcode == packets["PACKET_ENTER_WORLD"]:
          HandleEnterWorld(websocket, packet)
        elif opcode == packets["PACKET_INPUT"]:
          HandleInput(websocket, packet)

    # Sometimes it throws an error if we
    # specify encoding, for no reason. Who
    # knows why the fuck.

    try:
      packet = msgpack.unpackb(message, encoding="utf-8")
    except TypeError:
      packet = msgpack.unpackb(message)
    
    next(packet)

