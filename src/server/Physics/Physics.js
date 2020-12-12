import SERVER_DATA from "data/all";
import Util from "Util/Util";
import Matter from "matter-js";

class Physics {
  static collisions = [
    {
      model: /SlowTrap/,
      exclude: /.*/,
      set: ["slowed"]
    },
    {
      model: /Projectile/,
      include: /(Zombie.*|GamePlayer|Neutral)/,
      wallCollision: false
    },
    {
      model: /TowerProjectile/,
      exclude: /GamePlayer/
    },
    {
      model: /HealTowersSpell/,
      exclude: /.*/
    }
  ];

  static bodyDefaults = {
    friction: 0.6,
    frictionAir: 0.7,
    restitution: 1
  };

  constructor() {
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
  }

  body(entity, opts) {
    const isCircle = !!entity.collisionRadius;
    const isPolygon = entity.vertices && entity.vertices.length !== 0;
    const isSquare = entity.width && entity.height;

    const options = Object.assign(Physics.bodyDefaults, opts);

    const body = isCircle
      ? Matter.Bodies.circle(
          entity.position.x,
          entity.position.y,
          entity.collisionRadius,
          options
        )
      : isSquare
      ? Matter.Bodies.rectangle(
          entity.position.x,
          entity.position.y,
          entity.width,
          entity.height,
          options
        )
      : isPolygon
      ? Matter.Bodies.polygon(
          entity.position.x,
          entity.position.y,
          entity.vertices,
          options
        )
      : null;

    Matter.World.add(SERVER_DATA.PHYSICS.engine.world, body);

    return body;
  }

  static async move(entity) {
    if (entity.dead) return;

    const keys = {
      right: false,
      left: false,
      down: false,
      up: false
    };

    if (entity.yaw >= 45 && entity.yaw <= 135) {
      keys.right = true;
    }
    if (entity.yaw >= 225 && entity.yaw <= 315) {
      keys.left = true;
    }
    if (entity.yaw >= 135 && entity.yaw <= 225) {
      keys.down = true;
    }
    if ((entity.yaw >= 315 && entity.yaw <= 359) || entity.yaw <= 45) {
      keys.up = true;
    }

    const speed = Util.getSpeed(keys, {
      baseSpeed: entity.baseSpeed || 15,
      slowed: entity.slowed
    });

    const velocity = { x: 0, y: 0 };
    if (keys.right) {
      velocity.x += speed;
    }
    if (keys.left) {
      velocity.x -= speed;
    }
    if (keys.down) {
      velocity.y += speed;
    }
    if (keys.up) {
      velocity.y -= speed;
    }

    Matter.Body.setVelocity(entity.body, velocity);
  }

  static _round(n) {
    return Math.round(n * 100) / 100;
  }

  static update(entity) {
    const entities = SERVER_DATA.ENTITIES;

    entity.collision = 0;
    for (const uid of Object.keys(entities)) {
      entities[uid].position.x = Physics._round(entities[uid].body.position.x);
      entities[uid].position.y = Physics._round(entities[uid].body.position.y);
    }
  }
}

export default Physics;
