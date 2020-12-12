import SERVER_DATA from "data/all";
import PacketIds from "Network/PacketIds";
import * as Rpcs from "../Rpcs";
import RpcList from "data/rpcList";

function HandlePacketRpc(socket, data) {
  if (!RpcList[data.name]) return;

  const rpc = RpcList[data.name];

  let valid = true;
  Object.keys(data).forEach(prop => {
    for (const i of rpc.map) {
      if (i.name == prop) {
        const type = i.type;
        const param = data[prop];

        if (!type || !param) return;

        switch (type) {
          case 1:
            if (typeof param !== "boolean")
              valid = false;
            break;
          case 2:
            if (typeof param !== "number")
              valid = false;
            break;
          case 3:
            if (!Array.isArray(param))
              valid = false;
            break;
          case 4:
            if (typeof param !== "object" || Array.isArray(param))
              valid = false;
            break;
          case 5:
            if (typeof param !== "string")
              valid = false;
            break;
        }
      }
    }
  })
  if (valid)
    rpc.execute(socket, data);
}

export default HandlePacketRpc;
