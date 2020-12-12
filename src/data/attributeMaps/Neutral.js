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
    },
    send: true
  },
  {
    name: "yaw",
    default: 0,
    send: true
  },
  {
    name: "baseSpeed",
    default: 12
  },
  {
    name: "health",
    default: 1500,
    send: true
  },
  {
    name: "maxHealth",
    default: 1500,
    send: true
  },
  {
    name: "damage",
    default: 10,
    send: true
  },
  {
    name: "height",
    default: 32,
    send: false
  },
  {
    name: "width",
    default: 32,
    send: false
  },
  {
    name: "collisionRadius",
    default: 22,
    send: false
  },
  {
    name: "model",
    default: "Neutral",
    send: true
  },
  {
    name: "entityClass",
    default: "Npc",
    send: true
  },
  {
    name: "dead",
    default: 0,
    send: true
  },
  {
    name: "timeDead",
    default: 0,
    send: true
  },
  {
    name: "slowed",
    default: 0,
    send: false
  },
  {
    name: "stunned",
    default: 0,
    send: false
  },
  {
    name: "firingTick",
    default: 0,
    send: true
  },
  {
    name: "msSinceLastFire",
    default: 0,
    send: false
  },
  {
    name: "collision",
    default: 0,
    send: false
  },
  {
    name: "moving",
    default: 0,
    send: false
  },
  {
    name: "hitBy",
    default: 0,
    send: false
  },
  {
    name: "camp",
    default: 0
  }
]
