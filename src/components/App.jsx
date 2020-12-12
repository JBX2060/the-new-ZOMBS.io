import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Intro from "./Intro.jsx";
import Error from "./404.jsx";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Intro} />
          <Route component={Error} />
        </Switch>
      </Router>
    );
  }
}

export default App;
