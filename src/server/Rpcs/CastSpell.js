import SERVER_DATA from "data/all";
import Rpc from "Generate/Rpc";
import Util from "Util/Util";
import HealTowersSpell from "Entities/HealTowersSpell";
import spellPrices from "data/spellPrices";
import SendRpc from "Network/SendRpc";

const castSpell = new Rpc("CastSpell", function (socket, data) {
  const spell = spellPrices.find(spell => spell.Name == data.spell);

  if (spell) {
    if (spell.Name == "HealTowersSpell") {
      const spellEntity = new HealTowersSpell({
        position: {
          x: data.x,
          y: data.y
        }
      });

      SERVER_DATA.ENTITIES[spellEntity.uid] = spellEntity;

      SendRpc(socket, "CastSpellResponse", {
        spell: spell.Name,
        cooldown: spell.Cooldown,
        cooldownStartTick: SERVER_DATA.TICK
      });

      setTimeout(() => {
        Util.removeEntity(spellEntity.uid);
      }, spell.VisualLifetime);

      // TODO: Make it actually heal
    }
  }
});

export default castSpell;
