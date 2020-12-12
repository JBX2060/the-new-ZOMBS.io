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
    default: 13,
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
    default: 24,
    send: false
  },
  {
    name: "model",
    default: "",
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
    name: "partyId",
    default: 0
  },
  {
    name: "firingTick",
    default: 0,
    send: true
  },
  {
    name: "lastDamagedTick",
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
    default: 1,
    send: false
  },
  {
    name: "currentPath",
    default: 0,
    send: false
  },
  {
    name: "baseSpeed",
    default: 2
  },
  {
    name: "damageAmount",
    default: 0,
    send: false
  },
  {
    name: "msBetweenFires",
    default: 0,
    send: false
  }
]