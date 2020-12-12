from Logger.Logger import logger
from Define.Potion import Potion
from Define.Weapon import Weapon

items = {}

def DefineItem(id, item, stats):
  logger.info(f"Defining item {id}...")
  for i in range(item.tiers):
    logger.info(f"Item costs {item.cost[i]} at tier {i + 1}")

  items.update({ id: item })
