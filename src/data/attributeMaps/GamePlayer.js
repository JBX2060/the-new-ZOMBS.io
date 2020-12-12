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
    default: "GamePlayer",
    send: true
  },
  {
    name: "entityClass",
    default: "PlayerEntity",
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
    name: "reconnectSecret",
    default: "",
    send: false
  },
  {
    name: "name",
    default: "",
    send: true
  },
  {
    name: "score",
    default: 0,
    send: true
  },
  {
    name: "baseSpeed",
    default: 45,
    send: false
  },
  {
    name: "speedAttribute",
    default: 0,
    send: true
  },
  {
    name: "availableSkillPoints",
    default: 1,
    send: true
  },
  {
    name: "experience",
    default: 0,
    send: false
  },
  {
    name: "level",
    default: 1,
    send: false
  },
  {
    name: "msBetweenFires",
    default: 300,
    send: false
  },
  {
    name: "aimingYaw",
    default: 0,
    send: true
  },
  {
    name: "energy",
    default: 100,
    send: true
  },
  {
    name: "maxEnergy",
    default: 100,
    send: true
  },
  {
    name: "energyRegenerationRate",
    default: 1,
    send: true
  },
  {
    name: "kills",
    default: 0,
    send: true
  },
  {
    name: "weaponName",
    default: "Pickaxe",
    send: true
  },
  {
    name: "weaponTier",
    default: 1,
    send: true
  },
  {
    name: "firingTick",
    default: 0,
    send: true
  },
  {
    name: "stone",
    default: 0,
    send: true
  },
  {
    name: "wood",
    default: 0,
    send: true
  },
  {
    name: "gold",
    default: 0,
    send: true
  },
  {
    name: "token",
    default: 0,
    send: true
  },
  {
    name: "wave",
    default: 0,
    send: true
  },
  {
    name: "partyId",
    default: 0,
    send: true
  },
  {
    name: "zombieShieldHealth",
    default: 0,
    send: true
  },
  {
    name: "zombieShieldMaxHealth",
    default: 0,
    send: true
  },
  {
    name: "isPaused",
    default: 0,
    send: true
  },
  {
    name: "isInvulnerable",
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
    name: "lastDamage",
    default: 0,
    send: true
  },
  {
    name: "lastDamageTick",
    default: 0,
    send: true
  },
  {
    name: "lastDamageTarget",
    default: 0,
    send: true
  },
  {
    name: "hatName",
    default: "",
    send: true
  },
  {
    name: "petUid",
    default: 0,
    send: true
  },
  {
    name: "isBuildingWalking",
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
  }
];
