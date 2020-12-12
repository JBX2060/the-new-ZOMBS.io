from Define.ShopItem import DefineItem, Weapon
from Prices.Prices import Prices

DefineItem("Pickaxe", Weapon({
  "name": "Pickaxe",
  "description": "Harvests wood and stone",
  "tiers": 2,

  "autoequip": True,
  "cost": [
    Prices.free(),
    Prices.gold(100)
  ],

  "equip": lambda self:
    self.player.setWeapon(self.name)
}), (
  {
    "fireRate": 300,
    "gainPerHit": 1
  }
))

