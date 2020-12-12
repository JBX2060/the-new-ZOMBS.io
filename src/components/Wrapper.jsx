import React from "react";
import IntroLeft from "./IntroLeft.jsx";
import IntroRight from "./IntroRight.jsx";
import IntroForm from "./IntroForm.jsx";
import Leaderboard from "./Leaderboard.jsx";

class Wrapper extends React.Component {
  render() {
    const [title, ext] = (process.env.APP_NAME || "We have no title.io").split(".");

    return (
      <div className="hud-intro-wrapper">
        <h1>{title}<small>.{ext}</small></h1>
        <h2>{process.env.APP_DESCRIPTION || "We have no description"}</h2>
        <div className="hud-intro-main">
          {/* <IntroLeft /> */}
          <IntroForm />
          {/* <IntroRight /> */}
        </div>
        <Leaderboard />
      </div>
    );
  }
}

export default Wrapper;
