import math

def UpdateEntity(entity):
  entity["position"] = {
    "x": entity.body.position.x,
    "y": entity.body.position.y
  }
  entity["yaw"] = entity.body.angle * 180 / math.pi

