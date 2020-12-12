import React from "react";
import request from "browser-request";
import xss from "xss";

class Leaderboard extends React.Component {
  constructor() {
    super();

    this.state = { parties: [] };
  }

  getApiUrl(category, timeFrame) {
    let apiUrl = null;
    if (process.env.NODE_ENV == "production") {
      apiUrl = "/api/leaderboard/data";
    } else {
      apiUrl = "http://127.0.0.1:8008/leaderboard/data";
    }
    return apiUrl + '?category=' + category + '&time=' + timeFrame
  }

  componentDidMount() {
    request.get(this.getApiUrl("wave", "24h"), (err, response, body) => {
      if (err) {
        this.setState({ error: true });
        return;
      }
      try {
        const { parties } = JSON.parse(body);

        if (!parties) {
          this.setState({ error: true });
        } else {
          this.setState({ parties });
        }
      } catch {
        this.setState({ error: true });
        return;
      }
    });
  }

  render() {
    return (
      <div className="hud-intro-corner-top-right">
        <div className="hud-intro-leaderboard">
          <h3>Top <select name="category" className="hud-intro-leaderboard-category"><option value="wave">Wave</option><option value="score">Score</option></select> For <select name="time" className="hud-intro-leaderboard-time"><option value="24h">Today</option><option value="7d">This Week</option><option value="all">All Time</option></select></h3>
          <div className="hud-intro-leaderboard-parties">
            {this.state.error ? <span className="hud-leaderboard-empty">Failed to load.</span> : this.state.parties.map((party, i) => {
              return <div className="hud-leaderboard-party" key={i}>{party.players.map(playerName => {
                return xss(playerName, { whiteList: [] });
              }).join(', ').replace(/,(?!.*,)/gmi, ' and')} — <strong>{party.wave.toLocaleString()}</strong></div>
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboard;
