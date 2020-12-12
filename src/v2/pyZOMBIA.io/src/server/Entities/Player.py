from Define.Entity import DefineEntity
from pymunk.vec2d import Vec2d
from data import data

import math

K_UP = "up"
K_DOWN = "down"
K_LEFT = "left"
K_RIGHT = "right"

def move_angle(self):
  def move_angle(angle):
    self.body.angle = angle
    self.body.velocity = Vec2d(
        math.cos(angle) * self["speed"], -math.sin(angle) * self["speed"])
  return move_angle

def move(self):
  def move():
    if self["keys_pressed"](K_UP, K_LEFT):
      self["move_angle"](3 * math.pi / 4)
    elif self["keys_pressed"](K_UP, K_RIGHT):
      self["move_angle"](math.pi / 4)
    elif self["keys_pressed"](K_DOWN, K_LEFT):
      self["move_angle"](5 * math.pi / 4)
    elif self["keys_pressed"](K_DOWN, K_RIGHT):
      self["move_angle"](7 * math.pi / 4)
    elif self["keys_pressed"](K_UP):
      self["move_angle"](math.pi / 2)
    elif self["keys_pressed"](K_DOWN):
      self["move_angle"](3 * math.pi / 2)
    elif self["keys_pressed"](K_LEFT):
      self["move_angle"](math.pi)
    elif self["keys_pressed"](K_RIGHT):
      self["move_angle"](2 * math.pi)
  return move

def keys_pressed(self):
  def keys_pressed(*keys):
    pressed = False

    for key in keys:
      if self["keys"].get(key):
        pressed = True
      else:
        return False

    return pressed
  return keys_pressed

def update(self):
  def update():
    self["move"]()
  return update

Player = DefineEntity("Player", {
  "keys": {},
  "model": "PlayerModel",
  "move_angle": move_angle,
  "keys_pressed": keys_pressed,
  "update": update,
  "speed": 500,
  "move": move
}, (
  {
    "speed": 10,
    "health": 400,
    "radius": 25,
    "mass": 20
  }
))

