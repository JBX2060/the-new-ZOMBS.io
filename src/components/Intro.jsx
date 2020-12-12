import React from "react";
import range from "lodash/range";
import Wrapper from "./Wrapper.jsx"
import Tree from "./Tree.jsx";
import Stone from "./Stone.jsx";

class Intro extends React.Component {
  render() {
    function trees() {
      const t = [];

      range(4).forEach(i => {
        t.push(<Tree
          top={Math.floor(Math.random() * 100) + 1}
          left={Math.floor(Math.random() * 100) + 1}
          key={i}
        />);
      });

      return t;
    }

    function stones() {
      const s = [];

      range(4).forEach(i => {
        s.push(<Stone
          top={Math.floor(Math.random() * 100) + 1}
          left={Math.floor(Math.random() * 100) + 1}
          key={i}
        />);
      });

      return s;
    }

    return (
      <div id="hud-intro" className="hud-intro">
        {trees()}
        {stones()}
        <Wrapper />
      </div>
    );
  }
}

export default Intro;
