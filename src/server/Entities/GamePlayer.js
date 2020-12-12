import SERVER_DATA from "data/all";
import Entity from "Generate/Entity";
import shopPrices from "data/shopPrices.js";
import SendRpc from "Network/SendRpc";
import Physics from "Physics/Physics";
import Util from "Util/Util";

const gamePlayer = Entity("GamePlayer", {
  update() {
    if (this.health <= 0) {
      this.health = 0;
      if (!this.dead) {
        this.dead = 1;

        for (const client of SERVER_DATA.CLIENTS) {
          if (client.uid == this.uid) {
            SendRpc(client, "Dead", {});
          }
        }
      }
    } else {
      this.regenHealth();
    }

    if (this.moving)
      Physics.move(this);
  },

  regenHealth() {
    const healthRegenPerSecond = 3;

    const heal = () => {
      this.health += ((healthRegenPerSecond + this.health > this.maxHealth) ? this.maxHealth - this.health : healthRegenPerSecond);
      if (this.health !== this.maxHealth)
        this.healingTick += 5;
    }

    if (this.healingTick == SERVER_DATA.TICK) {
      heal();
    }
  },

  canAfford({ wood, stone, gold, token }) {
    if (wood && this.wood < wood) return false;
    if (stone && this.stone < stone) return false;
    if (gold && this.gold < gold) return false;
    if (token && this.token < token) return false;
    return true;
  },

  hit(entity, degree) {
    switch (entity && entity.model) {
      case "Tree":
      case "Stone":
        entity.hit(this, degree);
        break;

      case "Harvester":
        entity.collect(this);
        break;

      case "Neutral":
        entity.hit(this);
        break;

      case "GamePlayer":
        entity.hitPlayer(this);
        break;

      default:
        if (entity && entity.model.startsWith("Zombie")) {
          entity.hit(this);
        }
        break;
    }
  },

  weaponData() {
    if (this._weaponData && this._weaponData.Name === this.weaponName) {
      return this._weaponData;
    } else {
      return this._weaponData = shopPrices
        .find(item => item.Name === this.weaponName);
    }
  },

  hitPlayer(entity) {
    if (this.partyId !== entity.partyId) {
      entity.lastDamage = entity.weaponData().DamageToPlayers[entity.weaponTier - 1];
      this.health -= entity.lastDamage;
      this.lastDamagedTick = SERVER_DATA.TICK;
      entity.lastDamageTick = SERVER_DATA.TICK;
      entity.lastDamageTarget = this.uid;
    }
  }
});

export default gamePlayer;
