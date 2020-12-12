import SERVER_DATA from "data/all";
import Matter from "matter-js";

const Engine = SERVER_DATA.PHYSICS.engine;

function SpawnWalls() {
  Matter.World.add(Engine.world, [
    // Up wall
    Matter.Bodies.rectangle(
      SERVER_DATA.MAP.width / 2,
      -120,
      SERVER_DATA.MAP.width + 384,
      192,
      { isStatic: true }
    ),
    // Left wall
    Matter.Bodies.rectangle(
      -120,
      SERVER_DATA.MAP.height / 2,
      192,
      SERVER_DATA.MAP.height + 384,
      { isStatic: true }
    ),
    // Down wall
    Matter.Bodies.rectangle(
      SERVER_DATA.MAP.width / 2,
      SERVER_DATA.MAP.height + 120,
      SERVER_DATA.MAP.width + 384,
      192,
      { isStatic: true }
    ),
    // Right wall
    Matter.Bodies.rectangle(
      SERVER_DATA.MAP.width + 120,
      SERVER_DATA.MAP.height / 2,
      192,
      SERVER_DATA.MAP.height + 384,
      { isStatic: true }
    )
  ]);
}

export default SpawnWalls;
