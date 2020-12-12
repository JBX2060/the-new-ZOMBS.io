import SERVER_DATA from "data/all";
import Cli from "Cli/Cli";
import Util from "Util/Util";

import PacketIds from "Network/PacketIds";
import SendEntityUpdate from "Network/SendEntityUpdate";

import HandlePacketEnterWorld from "Handle/PacketEnterWorld";
import HandlePacketRpc from "Handle/PacketRpc";
import HandlePacketPing from "Handle/PacketPing";
import HandlePacketInput from "Handle/PacketInput";
import HandleClose from "Handle/Close";

import UpdateAllEntities from "Update/AllEntities";
import UpdateEntities from "Update/Entities";
import UpdateLeaderboard from "Update/Leaderboard";
import UpdateDayCycle from "Update/DayCycle";
import UpdateMatter from "Update/Matter";

import SpawnTrees from "Spawner/SpawnTrees";
import SpawnStones from "Spawner/SpawnStones";
import SpawnNeutralCamps from "Spawner/SpawnNeutralCamps";
import SpawnWalls from "Spawner/SpawnWalls";

import * as msgpack from "@msgpack/msgpack";
import cloneDeep from "lodash/cloneDeep";
import WebSocket from "ws";

const config = Util.loadConfig();

SpawnTrees();
SpawnStones();
SpawnNeutralCamps();
SpawnWalls();

Util.onServerStart(() => {
  const server = new WebSocket.Server({
    host: config["host"],
    port: config["port"]
  });

  server.on("connection", (socket, req) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    for (const ban of config["bans"]) {
      if (ban == ip) {
        socket.close();
        return;
      }
    }

    if (SERVER_DATA.CLIENTS.length >= SERVER_DATA.MAX_PLAYERS) {
      socket.close();
      return;
    }

    socket.on("message", msg => {
      try {
        const { opcode, ...data } = msgpack.decode(msg);

        switch (opcode) {
          case PacketIds.PACKET_ENTER_WORLD:
            HandlePacketEnterWorld(socket, data);
            break;

          case PacketIds.PACKET_PING:
            HandlePacketPing(socket, data);
            break;

          case PacketIds.PACKET_INPUT:
            HandlePacketInput(socket, data);
            break;

          case PacketIds.PACKET_RPC:
            HandlePacketRpc(socket, data);
            break;
        }
      } catch (err) {
        if (!(err instanceof RangeError)) {
          console.error(err);
        } else {
          if (process.env.NODE_ENV == "production") {
            socket.close();
          } else {
            console.error(err);
          }
        }
      }
    });

    socket.on("close", code => {
      HandleClose(socket, code);
    });
  });
});

new Util.ticker(50, tick => {
  const entities = SERVER_DATA.ENTITIES;
  const lastEntities = SERVER_DATA.LAST_ENTITIES;

  SERVER_DATA.TICK = tick;
  SERVER_DATA.CLIENTS.forEach(socket => {
    socket.viewport = socket.viewport || [];

    const updatedEntities = {};
    const entity = Util.clean(entities[socket.uid]);

    Object.keys(entities).forEach(uid => {
      const oldEntity = Util.clean((lastEntities[socket.uid] || {})[uid] || {});
      const newEntity = Util.clean(entities[uid]);

      const changedAttributes = Util.diff(oldEntity, newEntity, [
        "body",
        "hits"
      ]);
      const distance = Math.sqrt(
        Math.pow(entity.position.x - newEntity.position.x, 2) +
          Math.pow(entity.position.y - newEntity.position.y, 2)
      );

      if (
        distance <= config["max_player_viewport"] ||
        newEntity.partyId == entity.partyId
      ) {
        if (!(socket.viewport.indexOf(newEntity.uid) >= 0)) {
          socket.viewport.push(newEntity.uid);
          updatedEntities[uid] = newEntity;
        }
      } else {
        const index = socket.viewport.indexOf(newEntity.uid);

        if (index >= 0) socket.viewport.splice(index, 1);
      }

      if (
        !updatedEntities[uid] &&
        socket.viewport.indexOf(newEntity.uid) >= 0
      ) {
        if (Object.keys(changedAttributes).length == 0) {
          updatedEntities[uid] = true;
        } else {
          updatedEntities[uid] = changedAttributes;
          updatedEntities[uid].uid = parseInt(uid);

          if (changedAttributes.position)
            updatedEntities[uid].position = newEntity.position;
        }
      }
    });

    SendEntityUpdate({
      entities: updatedEntities,
      socket
    });

    lastEntities[socket.uid] = cloneDeep(entities);

    UpdateEntities(socket);
  });

  UpdateMatter();
  UpdateAllEntities();

  if (Util.shouldUpdateDayCycle()) {
    UpdateDayCycle();
  }

  if (Util.shouldUpdateLeaderboard()) {
    UpdateLeaderboard();
  }
});

const cli = new Cli();
