import SERVER_DATA from "data/all";
import * as rpcMaps from "data/rpcMaps";
import AttributeType from "Engine/Network/AttributeType";
import RpcList from "data/rpcList";

class Rpc {
  constructor(name, callback) {
    this.name = name;
    this.callback = callback;
    this.map = rpcMaps[name].parameters;

    RpcList[name] = this;
  }

  execute(socket, args) {
    const finalParams = {};

    for (const a in args) {
      const arg = args[a];
      const paramData = this.map.find(param => param.name == a);

      if (!paramData) {
        continue;
      }

      finalParams[a] = arg;
    }


    if (Object.keys(finalParams).length !== this.map.length) return;

    this.callback(socket, finalParams);
  }
}

export { RpcList };
export default Rpc;
