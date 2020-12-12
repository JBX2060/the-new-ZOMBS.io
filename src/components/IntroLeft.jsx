import React from "react";
import fetch from "node-fetch";
import Account from "./Account.jsx";

class IntroLeft extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      loggedIn: false
    };
  }

  checkLogin() {
    if ("localStorage" in window && "token" in window.localStorage) {
      fetch(this.getApiUrl(), {
        method: "POST",
        body: {
          token: window.localStorage.token
        }
      }).then(res => res.json().then(data => {
        this.setState({
          loading: false,
          loggedIn: data.exists
        });
      }));
    } else {
      this.setState({
        loading: false,
        loggedIn: false
      });
    }
  }

  getApiUrl() {
    if (process.env.NODE_ENV == "production") {
      return "/api/accounts/login";
    } else {
      return "http://127.0.0.1:8008/accounts/login";
    }
  }

  componentDidMount() {
    this.checkLogin();
  }

  render() {
    return (
      <div className="hud-intro-left">
        {this.state.loading ? <span className="hud-loading"></span> : (<>
          {this.state.loggedIn ?
            <Account account={this.state.account} loggedIn={true} /> :
            <Account loggedIn={false} />
          }
        </>)}
      </div>
    );
  }
}

export default IntroLeft;
