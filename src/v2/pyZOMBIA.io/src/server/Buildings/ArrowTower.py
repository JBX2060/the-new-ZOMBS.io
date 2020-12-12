from Define.Building import DefineBuilding, Tower
from Walkthrough.Walkthrough import Walkthrough
from Prices.Prices import Prices

DefineBuilding("ArrowTower", Tower({
  "name": "Arrow Tower",
  "description": "Throws arrows at enemies",
  "tiers": 2,

  "cost": [
    Prices.wood(5).stone(5),
    Prices.wood(10).stone(10).gold(100)
  ],

  "build": lambda self:
    Walkthrough.nextStep()
}), (
  {
    "fireRate": 200,
    "health": 500,
    "range": 1000
  }
))

