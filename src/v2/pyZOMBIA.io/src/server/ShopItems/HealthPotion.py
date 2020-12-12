from Define.ShopItem import DefineItem, Potion
from Prices.Prices import Prices

DefineItem("HealthPotion", Potion({
  "name": "Health Potion",
  "description": "Regenerates your health for a low cost",
  "tiers": 1,

  "cost": [
    Prices.gold(100)
  ],

  "equip": lambda self:
    self.player.regenHealth(self.player.maxHealth)
}), ())

