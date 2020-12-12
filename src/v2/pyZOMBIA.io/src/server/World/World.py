from pymunk.vec2d import Vec2d
from Update.UpdateEntities import UpdateEntities
from Util.Util import Util
from ConfigLoader.Load import config

import asyncio
import threading
import pymunk
import time

class World:
  def __init__(self):
    self.space = pymunk.Space()
    self.space.gravity = 0, 0
    self.space.damping = 0

    try:
      thread = threading.Thread(target=self.update_loop)
      thread.start()
    except KeyboardInterrupt:
      thread.do_run = False
      thread.join()

  def update_loop(self):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    while True:
      self.space.step(0.02)
      Util.increaseTick()
      UpdateEntities()
      time.sleep(config["ms_per_tick"] / 1000)
