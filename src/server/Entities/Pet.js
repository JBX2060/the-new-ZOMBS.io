import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import Physics from "Physics/Physics";
import shopPrices from "data/shopPrices";
import Util from "Util/Util";

const pet = Entity("Pet", {
  update() {
    const petData = shopPrices.find(item => item.Name == this.model);

    if (!SERVER_DATA.ENTITIES[this.ownerUid]) {
      Util.removeEntity(this.uid);
      return;
    }

    const owner = SERVER_DATA.ENTITIES[this.ownerUid];
    this.baseSpeed = petData.Speed[this.tier - 1];

    if (!this.farming && Util.distance(this, owner) <= petData.LeashRange[this.tier - 1]) {
      this.moving = false;
    } else {
      this.moving = true;
    }

    if (this.farming) {
      const target = SERVER_DATA.ENTITIES[this.farmingTarget];
      if (target)
        this.yaw = Util.angleTo(this.position.x, this.position.y, target.position.x, target.position.y);
    }

    if (this.moving)
      Physics.move(this);

    if (!(SERVER_DATA.TICK % 6) || this.farming || !this.moving) return;
    this.yaw = Util.angleTo(this.position.x, this.position.y, owner.position.x, owner.position.y);
  },

  farm(entity) {
    const owner = SERVER_DATA.ENTITIES[this.ownerUid];

    this.moving = true;
    this.farming = true;
    this.farmingTarget = entity.uid;

    const distance = Math.sqrt((Math.pow(this.position.x - entity.position.x, 2)) + (Math.pow(this.position.y - entity.position.y, 2)));
    if (distance <= 150) {
      const { answer, degree } = Util.isFacing(this, entity);
      if (answer) {
        this.firingTick = SERVER_DATA.TICK;

        entity.hits = [];
        entity.hits.push(SERVER_DATA.TICK, degree);

        setTimeout(() => {
          entity.hits = [];
        }, this.shopData().MsBetweenFires[this.tier - 1]);

        if (entity.model === "Tree") {
          owner.wood += 1;
          this.woodGain = 1;
          this.woodGainTick = SERVER_DATA.TICK;
        } else if (entity.model === "Stone") {
          owner.stone += 1;
          this.stoneGain = 1;
          this.stoneGainTick = SERVER_DATA.TICK;
        }
      }
    }

    Util.waitTicks(this.shopData().MsBetweenFires[this.tier - 1] / 50).then(() => {
      if (this.farmingTarget !== entity.uid) return;
      this.farm(entity);
    });
  },

  shopData() {
    if (this._shopData && this._shopData.Name === this.weaponName) {
      return this._shopData;
    } else {
      return this._shopData = shopPrices
        .find(item => item.Name === this.model);
    }
  }
});

const models = [
  "PetCARL",
  "PetMiner",
  "PetGhost"
];

export default pet;
export { models };
