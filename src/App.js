import React from "react";
import logo from "./logo.svg";
import Jwt_Decode from "jwt-decode";
// import "./App.css";
import "antd/dist/antd.css";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

// import Amplify, { Auth, Hub } from "aws-amplify";
import awsconfig from "./aws-exports";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ConfirmCode from "./Components/ConfirmEmail";
import UserDashboard from "./Components/UserDashBoard";
import Navbar from "./Components/Navbar";
import Amplify, { Auth } from "aws-amplify";

// import { withOAuth, Authenticator } from "aws-amplify-react";

Amplify.configure(awsconfig);
// Storage.configure({ level: "private" });
Auth.currentSession()
  .then(data => {
    const { accessToken } = data;
    console.log(accessToken);
    localStorage.setItem("refreshToken", accessToken.jwtToken);

    // console.log(exp);
    // console.log(
    //   JSON.parse(localStorage.getItem("AUTH_USER_TOKEN_KEY")) ===
    //     accessToken.jwtToken
    // );
  })
  .catch(err => console.log(err));
const checkAuth = () => {
  let localToken = localStorage.getItem("AUTH_USER_TOKEN_KEY");
  let refershToken = localStorage.getItem("refreshToken");
  let { exp } = Jwt_Decode(refershToken);
  console.log(refershToken);
  console.log(localToken);

  if (!localToken || !refershToken) {
    console.log("token not presente");
    return false;
  }
  console.log(exp);
  console.log(new Date().getTime() / 1000);
  if (exp < new Date().getTime() / 1000) {
    console.log("token expire");
    return false;
  }
  console.log("now it will return something");
  return true;
};

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      checkAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/login" }} />
      )
    }
  />
);

class App extends React.Component {
  state = {
    authStatus: false
  };
  componentDidMount() {
    // Auth.currentAuthenticatedUser({
    //   bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    // })
    //   .then(user => console.log(user))
    //   .catch(err => console.log(err));
  }
  render() {
    const { authStatus } = this.state;
    return (
      <Router>
        {/* <Signup /> */}
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
        <Switch>
          <Route path="/verify-code" component={ConfirmCode} />
        </Switch>
        <Switch>
          <AuthRoute path="/dashboard" component={UserDashboard} />
        </Switch>
      </Router>
    );
  }
}

export default App;
