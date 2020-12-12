from Logger.Logger import logger
from ConfigLoader.Load import config
from Util.Util import Util
from pymunk.vec2d import Vec2d
from data import data

import pymunk
import types

entities = {}

def DefineEntity(id, entity, stats):
  logger.info(f"Defining entity {id}...")

  entities.update({ id: entity })

  class Entity:
    def __init__(self, attributes):
      self.__dict__ = {}

      self.uid = Util.uid()
      self.type = "circle"
      self.health = 100
      self.dead = 0
      self.mass = 10
      self.radius = 50
      self.speed = 50
      self.inner_radius = 0
      self.yaw = 0
      self.tier = 1

      for key, val in entity.items():
        if(isinstance(val, types.FunctionType)):
          self[key] = val(self)
        else:
          self[key] = val

      for key, val in attributes.items():
        self[key] = val

      self.inertia = pymunk.moment_for_circle(self.mass, self.inner_radius, self.radius)
      self.body = pymunk.Body(self.mass, self.inertia)
      self.body.position = Vec2d(100, 100)
      self.shape = pymunk.Circle(self.body, self.radius)

      data["world"].space.add(self.body, self.shape)
      data["entities"].update({ self.uid: self })

    def __setitem__(self, key, value):
      self.__dict__[key] = value

    def __getitem__(self, key):
      return self.__dict__.get(key)

  return Entity
