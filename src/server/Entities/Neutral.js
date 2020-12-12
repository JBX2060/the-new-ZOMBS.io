import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import Physics from "Physics/Physics";
import Util from "Util/Util";

const neutral = Entity("Neutral", {
  async update() {
    if (this.hitBy && SERVER_DATA.ENTITIES[this.hitBy]) {
      const player = SERVER_DATA.ENTITIES[this.hitBy];
      if (!player.dead) {
        this.moving = 1;
        this.msSinceLastFire += 50;

        if (this.msSinceLastFire >= 500) {
          const { answer } = Util.isFacing(this, player);
          const distance = Util.distance(this, player);

          if (answer && distance <= 100) {
            this.firingTick = SERVER_DATA.TICK;
            this.msSinceLastFire = 0;
            player.health -= 10;
            player.healingTick = SERVER_DATA.TICK + 1000 / 50;

            if (player.health < 0) {
              this.goBackToCamp();
            }
          }
        }

        if (!(SERVER_DATA.TICK % 6) || this.collision === this.hitBy.uid) return;
        const angle = Util.angleTo(this.position.x, this.position.y, player.position.x, player.position.y);

        this.aimingYaw = angle;
        this.yaw = angle;
      } else {
        this.moving = 0;
        this.hitBy = 0;
      }
    } else {
      if (!this.goingBackToCamp)
        this.moving = 0;
    }

    if (Util.distance(this, SERVER_DATA.ENTITIES[this.camp]) >= 1000 && !this.goingBackToCamp) {
      this.hitBy = 0;
      this.goBackToCamp();
    }

    if (this.moving)
      Physics.move(this);
  },

  goBackToCamp() {
    const camp = SERVER_DATA.ENTITIES[this.camp];
    const angle = Util.angleTo(this.position.x, this.position.y, camp.position.x, camp.position.y);

    this.aimingYaw = angle;
    this.yaw = angle;
    this.moving = 1;
    this.goingBackToCamp = 1;

    if (Util.distance(this, camp) >= 200) {
      Util.waitNextTick().then(this.goBackToCamp.bind(this));
    } else {
      this.goingBackToCamp = 0;
    }
  },

  hit(entity) {
    this.health -= entity.weaponData().DamageToNeutrals[entity.weaponTier - 1];
    this.hitBy = entity.uid;
    if (this.health < 0) {
      SERVER_DATA.ENTITIES[this.camp].neutralCount--;
      entity.token += 5;
      Util.removeEntity(this.uid);
    }
  }
});

export default neutral;
