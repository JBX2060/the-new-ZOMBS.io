import React from "react";
import Servers from "./Servers.jsx";

class IntroForm extends React.Component {
  render() {
    return (
      <div className="hud-intro-form">
        <input type="text" className="hud-intro-name" maxLength="16" placeholder="Your nickname..."></input>
        <Servers />
        <button type="submit" className="btn btn-green hud-intro-play">Play</button>
        <span className="hud-intro-error"></span>
      </div>
    );
  }
}

export default IntroForm;
