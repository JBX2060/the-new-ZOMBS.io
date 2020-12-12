// ShopItems/PetPEDRO.js

import { DefineItem, Pet } from "Define/ShopItem";
import { Icons, SendPopup } from "Popup/Popup";
import { PetPEDRO } from "Entities/PetPEDRO";
import Prices, { Link } from "Prices/Prices";

DefineItem("PetPEDRO", Pet({
  name: "P. E. D. R. O.",
  description: "Will fight with you in battles",
  tiers: 2,

  cost: [
    Prices.links([{
      text: "Tweet",
      href: Link.tweet("Hello, world!")
    }, {
      text: "Subscribe",
      href: Link.subscribe("demostanis")
    }]),

    Prices.free(),
    Prices.tokens(100),

    Prices
      .gold(500)
      .wood(250)
      .stone(250)
  ],

  buy() {
    super.buy();

    SendPopup(this.player, {
      text: "You've successfully bought PEDRO! You can now equip it.",
      icon: Icons.PET
    });
  },

  equip() {
    super.equip();

    const pet = new PetPEDRO({
      position: {
        x: player.x,
        y: player.y
      }
    });

    this.player.adopt(pet);
  }
}, [
  /* Tier 1 */ {
    baseSpeed: 12,
    firingRate: 5
  },
  /* Tier 2 */ {
    baseSpeed: 13,
    firingRate: 7
  }
]));

// ShopItems/HealthPotion.js

import { DefineItem, Potion } from "Define/ShopItem";
import Prices from "Prices/Prices";
import ms from "ms";

DefineItem("HealthPotion", Potion({
  name: "Health Potion",
  description: "Regenerates your health for a low cost",
  tiers: 1,

  cost: [
    Prices.gold(100)
  ],

  cooldown: ms("30 seconds"),

  equip() {
    super.equip();

    this.player.regenHealth(this.player.maxHealth);
  }
}, []));
