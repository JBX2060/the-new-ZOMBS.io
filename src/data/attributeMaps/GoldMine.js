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
    default: 150,
    send: true
  },
  {
    name: "maxHealth",
    default: 150,
    send: true
  },
  {
    name: "damage",
    default: 10,
    send: true
  },
  {
    name: "height",
    default: 96,
    send: false
  },
  {
    name: "width",
    default: 96,
    send: false
  },
  {
    name: "collisionRadius",
    default: 0,
    send: false
  },
  {
    name: "model",
    default: "GoldMine",
    send: true
  },
  {
    name: "entityClass",
    default: "Prop",
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
    name: "tier",
    default: 1,
    send: true
  },
  {
    name: "partyId",
    default: 0,
    send: true
  },
  {
    name: "healingTick",
    default: 0,
    send: false
  },
  {
    name: "isStatic",
    default: true,
    send: false
  }
]