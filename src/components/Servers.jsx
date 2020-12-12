import React from "react";
import servers from "data/servers";

class Servers extends React.Component {
  render() {
    function load() {
      const s = [];
      const regions = {};

      Object.keys(servers).forEach(id => {
        const server = servers[id];

        if (!regions[server.region]) {
          regions[server.region] = [server];
        } else {
          regions[server.region].push(server);
        }
      });

      Object.keys(regions).forEach(region => {
        const servers = [];

        regions[region].forEach(serverData => {
          servers.push(<option value={serverData.id} key={serverData.id}>
            {serverData.name}
          </option>);
        });

        s.push(<optgroup label={region} key={region}>
          {servers}
        </optgroup>);
      });

      return s;
    }

    return (
      <select className="hud-intro-server" >
        {load()}
      </select>
    );
  }
}

export default Servers;
