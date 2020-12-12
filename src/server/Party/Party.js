import SERVER_DATA from "data/all";
import SendRpc from "Network/SendRpc";
import Util from "Util/Util";
import randomstring from "randomstring";

class Party {
  constructor() {
    this.partyId = Util.getNewPartyId();
    this.partyName = `Party${this.partyId}`;
    this.isOpen = 0;
    this.memberCount = 0;
    this.members = [];
    this.wave = 0;
    this.partyShareKey = randomstring.generate({
      length: 16,
      charset: "azertyuiopqsdfghjklmwxcvbn"
    });

    SERVER_DATA.PARTIES[this.partyId] = this;
  }

  addMember(player, isLeader, canSell) {
    this.memberCount++;
    this.members.push({
      playerUid: player.uid,
      displayName: player.name,
      isLeader: isLeader || 0,
      canSell: canSell || 0
    });

    player.partyId = this.partyId;
  }

  removeMember(uid) {
    this.members.forEach((member, i) => {
      if (member.playerUid == uid) {
        if (member.isLeader) {
          const [, newLeader] = this.members;

          if (newLeader) {
            newLeader.isLeader = 1;
            newLeader.canSell = 1;
          }
        }

        this.members.splice(i, 1);
        this.memberCount--;
      }
    });
    if (this.members.length == 0) {
      this.delete();
    }
  }

  delete() {
    Object.keys(SERVER_DATA.PARTIES).forEach(id => {
      if (id == this.partyId) {
        delete SERVER_DATA.PARTIES[id];
      }
    });
  }

  update() {
    SERVER_DATA.CLIENTS.forEach(client => {
      SendRpc(client, "AddParty", {
        partyId: this.partyId,
        partyName: this.partyName,
        isOpen: this.isOpen,
        memberCount: this.memberCount
      });
    });

    SERVER_DATA.CLIENTS.forEach(client => {
      this.members.forEach(member => {
        if (member.playerUid == client.uid) {
          SendRpc(client, "PartyInfo", this.members);
        }
      });
    });
  }
}

export default Party;