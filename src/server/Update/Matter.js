import SERVER_DATA from "data/all";
import Matter from "matter-js";

const engine = SERVER_DATA.PHYSICS.engine;

function UpdateMatter() {
  Matter.Events.trigger(engine, "tick", { timestamp: engine.timing.timestamp });
  Matter.Engine.update(engine, engine.timing.delta);
  Matter.Events.trigger(engine, "afterTick", {
    timestamp: engine.timing.timestamp
  });
}

export default UpdateMatter;
