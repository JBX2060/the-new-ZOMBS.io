import SendPing from "Network/SendPing";

function HandlePacketPing(socket, data) {
  // Perhaps add a timeout?

  SendPing(socket, {});
}

export default HandlePacketPing;
