import React from "react";

class Stone extends React.Component {
  render() {
    return (
      <span className="hud-intro-stone" style={{
        top: `${this.props.top}%`,
        left: `${this.props.left}%`
      }}></span>
    );
  }
}

export default Stone;
