from Util.Util import Util
from Network.SendEntityUpdate import SendEntityUpdate
from Update.UpdateEntity import UpdateEntity
from data import data

import threading
import asyncio
import types
import pymunk
  
def UpdateEntities():
  entities = data["entities"]

  for uid, entity in entities.items():
    entity.update()
    UpdateEntity(entity)

  for uid, entity in entities.items():
    if uid in data["clients"]:
      cleaned_entities = {}
      last_entities = data["last_entities"].get(uid) or {}

      for uid, entity in entities.items():
        cleaned_entity = {}
        for key, val in entity.__dict__.items():
          if not isinstance(val, types.FunctionType) and not isinstance(val, pymunk.shapes.Circle) and not isinstance(val, pymunk.Body):
            cleaned_entity.update({ key: val })

        try:
          last_entity = last_entities.get(uid).__dict__
        except:
          last_entity = {}
  
        diff = Util.diff(last_entity, cleaned_entity)
        cleaned_entities.update({ uid: diff })
    
      SendEntityUpdate(data["clients"].get(uid), cleaned_entities)
      data["last_entities"][uid] = entities.copy()

  