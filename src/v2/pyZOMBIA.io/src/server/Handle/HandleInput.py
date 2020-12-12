from Logger.Logger import logger
from Entities.Player import Player
from Util.Util import Util
from data import data

available_attributes = (
  "up",
  "down",
  "left",
  "right",
  "mouse"
)

def HandleInput(socket, packet):
  uid = Util.socketUid(socket)
  entity = data["entities"].get(uid)

  if entity:
    correct_input = {}
    for attr in available_attributes:
      attribute = packet.get(attr)
      if attribute is not None:
        correct_input.update({ attr: attribute })

    logger.info(f"Received input: {correct_input}")
    entity["keys"].update(correct_input)

