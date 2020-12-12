import React from "react";

class Register extends React.Component {
  render() {
    return (
      <>
        <h3>Register</h3>
        <input type="email" placeholder="Email" className="hud-intro-input" />
        <input type="text" placeholder="Username" className="hud-intro-input" />
        <input type="password" placeholder="Password" className="hud-intro-input" />
        <input type="password" placeholder="Repeat password" className="hud-intro-input" />
        <button className="btn btn-red hud-intro-register">Register</button>
      </>
    );
  }
}

export default Register;
