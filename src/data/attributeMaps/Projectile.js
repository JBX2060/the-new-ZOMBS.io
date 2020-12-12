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
    default: 100,
    send: true
  },
  {
    name: "maxHealth",
    default: 100,
    send: true
  },
  {
    name: "damage",
    default: 10,
    send: true
  },
  {
    name: "collisionRadius",
    default: 15,
    send: false
  },
  {
    name: "model",
    default: "",
    send: true
  },
  {
    name: "entityClass",
    default: "Projectile",
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
    default: 0
  },
  {
    name: "towerUid",
    default: 0,
    send: false
  },
  {
    name: "ownerUid",
    default: 0,
    send: false
  },
  {
    name: "thrownBy",
    default: 0,
    send: false
  }, {
    name: "isStatic",
    default: true,
    send: false
  }
]