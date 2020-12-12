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
    default: 400,
    send: true
  },
  {
    name: "maxHealth",
    default: 400,
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
    default: 25,
    send: false
  },
  {
    name: "model",
    default: "",
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
    name: "lastPetDamage",
    default: 0,
    send: true
  },
  {
    name: "lastPetDamageTick",
    default: 0,
    send: true
  },
  {
    name: "lastPetDamageTarget",
    default: 0,
    send: true
  },
  {
    name: "firingTick",
    default: 0,
    send: true
  },
  {
    name: "experience",
    default: 0,
    send: true
  },
  {
    name: "stoneGain",
    default: 0,
    send: true
  },
  {
    name: "woodGain",
    default: 0,
    send: true
  },
  {
    name: "stoneGainTick",
    default: 0,
    send: true
  },
  {
    name: "woodGainTick",
    default: 0,
    send: true
  },
  {
    name: "ownerUid",
    default: 0,
    send: true
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
  }
]