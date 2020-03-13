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
import Amplify, { Auth, Hub } from "aws-amplify";

// import { withOAuth, Authenticator } from "aws-amplify-react";

Amplify.configure(awsconfig);
// Storage.configure({ level: "private" });
function checkSessionToken() {
  Auth.currentSession()
    .then(data => {
      console.log(data);
      const { accessToken } = data;
      console.log(accessToken);
      if (accessToken.jwtToken) {
        localStorage.setItem("refreshToken", accessToken.jwtToken);
      }

      // console.log(exp);
      // console.log(
      //   JSON.parse(localStorage.getItem("AUTH_USER_TOKEN_KEY")) ===
      //     accessToken.jwtToken
      // );
    })
    .catch(err => console.log(err));
}
const checkAuth = () => {
  let refershToken = localStorage.getItem("refreshToken");
  let localToken = localStorage.getItem("AUTH_USER_TOKEN_KEY");
  if (localToken) {
    let { exp } = Jwt_Decode(refershToken);

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
  }
  if (!localToken) {
    let { exp } = Jwt_Decode(refershToken);

    if (!refershToken) {
      return false;
    }
    if (exp < new Date().getTime() / 1000) {
      console.log("token expire");
      return false;
    }
    return true;
    // return auth;
  }
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
    authStatus: "",
    user: null,
    customState: null
  };
  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      console.log(event, "this is ecent");
      switch (event) {
        case "signIn":
          Auth.currentSession()
            .then(data => {
              console.log(data);
              const { accessToken } = data;
              console.log(accessToken);
              if (accessToken.jwtToken) {
                localStorage.setItem("refreshToken", accessToken.jwtToken);
              }

              // console.log(exp);
              // console.log(
              //   JSON.parse(localStorage.getItem("AUTH_USER_TOKEN_KEY")) ===
              //     accessToken.jwtToken
              // );
            })
            .catch(err => console.log(err));
          this.setState({ user: data });
          break;
        case "signOut":
          console.log("user is signout");
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
        case "signIn_failure":
          this.setState({ user: null });
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }

  signout = () => {
    Auth.signOut()
      .then(() => {
        this.setState({ user: null });
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    const { authStatus, user } = this.state;

    // console.log(user.pool);
    return (
      <Router>
        {/* <Signup /> */}
        {/* <Authenticator usernameAttributes="email" /> */}
        <Navbar />
        {user ? <button onClick={this.signout}>Sign out</button> : null}
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
