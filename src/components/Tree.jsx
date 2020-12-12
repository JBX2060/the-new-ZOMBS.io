import React from "react";

class Tree extends React.Component {
  render() {
    return (
      <span className="hud-intro-tree" style={{
        top: `${this.props.top}%`,
        left: `${this.props.left}%`
      }}></span>
    );
  }
}

export default Tree;
