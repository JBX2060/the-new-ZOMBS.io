import React from "react";
import crypto from "crypto";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

class Account extends React.Component {
  constructor() {
    super();

    this.state = {
      login: false,
      register: false,
      main: true
    };

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  main() {
    this.setState({
      login: false,
      register: false,
      main: true
    });
  }

  login() {
    this.setState({
      login: true,
      register: false,
      main: false
    });
  }

  register() {
    this.setState({
      login: false,
      register: true,
      main: false
    });
  }

  hash(string) {
    return crypto.createHash("md5").update(string).digest("hex");
  }

  gravatar(email) {
    return "https://www.gravatar.com/avatar/" + this.hash(email);
  }

  render() {
    return (<>
      {this.state.main ? (this.props.loggedIn ?
        <>
          <h3>Accounts</h3>
          <small>Logged in as <strong>{this.props.account.name}</strong></small>
          <img src={this.gravatar(this.props.account.email)} />
        </> :
        <>
          <h3>Accounts</h3>
          <small>You're currently logged out</small>
          <p>Insert some good fucking reason to make an account</p>
          <button className="btn btn-red hud-intro-login" onClick={this.login}>Login</button>
          <button className="btn btn-purple hud-intro-register" onClick={this.register}>Register</button>
        </>) : (this.state.login ? <>
          <Login />
        </> : <Register />)
      }
    </>);
  }
}

export default Account;
