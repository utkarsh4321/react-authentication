import React from "react";
import logo from "./logo.svg";
// import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

// import Amplify, { Auth, Hub } from "aws-amplify";
import awsconfig from "./aws-exports";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import UserDashboard from "./Components/UserDashBoard";
import Navbar from "./Components/Navbar";
// import Amplify, { Auth } from "aws-amplify";

// import { withOAuth, Authenticator } from "aws-amplify-react";

// Amplify.configure(awsconfig);
// Storage.configure({ level: "private" });

class App extends React.Component {
  render() {
    return (
      <Router>
        {/* <Authenticator usernameAttributes="email" /> */}
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
        <Switch>
          <Route path="/signup" component={Signup} />
        </Switch>
      </Router>
    );
  }
}

export default App;
