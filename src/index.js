import Game from "Game/Game/Game";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import assets from "data/assetMap";
import servers from "data/servers";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "dom-shims";
import "typeface-hammersmith-one";
import "typeface-open-sans";
import "style/index.css";

const root = document.querySelector(".root");
ReactDOM.render(<App />, root);

if (window.location.pathname === "/") {
  const game = new Game({
    stage: process.env.NODE_ENV == "developement" ? "dev" : "prod",
    servers
  });

  game.init(() => {
    game.assetManager.load(assets);

    game.debug.init();
    game.run();
  });

  if (process.env.NODE_ENV !== "production") {
    window.Game = Game;
  }
}
