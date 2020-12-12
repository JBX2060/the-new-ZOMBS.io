export default [
  {
    name: "body",
    default: {},
    send: false
  },
  {
    name: "uid",
    default: 0,
    send: true
  },
  {
    name: "position",
    default: {
      x: 0,
      y: 0
    }
  },
  {
    name: "yaw",
    default: 0
  },
  {
    name: "health",
    default: 100
  },
  {
    name: "maxHealth",
    default: 100
  },
  {
    name: "damage",
    default: 10
  },
  {
    name: "height",
    default: 32
  },
  {
    name: "width",
    default: 32
  },
  {
    name: "collisionRadius",
    default: 0
  },
  {
    name: "model",
    default: "HealTowersSpell"
  },
  {
    name: "entityClass",
    default: "Prop"
  },
  {
    name: "dead",
    default: 0
  },
  {
    name: "timeDead",
    default: 0
  },
  {
    name: "tier",
    default: 1
  },
  {
    name: "isSensor",
    default: true,
    send: false
  }
]