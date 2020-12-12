import { Application } from "@pixi/app";
import { BatchRenderer, Renderer } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import { AppLoaderPlugin } from "@pixi/loaders";
import Game from "Game/Game";
import "typeface-spartan";

Renderer.registerPlugin("batch", BatchRenderer);
Renderer.registerPlugin("interaction", InteractionManager);

Application.registerPlugin(AppLoaderPlugin);

new Game({
  assets: [
    {
      name: "map/grass",
      url: "/assets/map/map-grass.png"
    },
    {
      name: "entity/player/base",
      url: "/assets/entity/player/player-base.svg"
    },
    {
      name: "entity/player/cap",
      url: "/assets/entity/player/player-cap.svg"
    }
  ],
  servers: [
    {
      id: "local01",
      label: "Local #1",
      hostname: "127.0.0.1",
      group: "Local servers",
      port: 34527
    }
  ]
});
