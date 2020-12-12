import React from "react";

class Login extends React.Component {
  render() {
    return (
      <>
        <h3>Login</h3>
        <input type="text" placeholder="Username" className="hud-intro-input" />
        <input type="password" placeholder="Password" className="hud-intro-input" />
        <button className="btn btn-red hud-intro-login">Login</button>
      </>
    );
  }
}

export default Login;
