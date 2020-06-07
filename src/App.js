import React from "react";
import Jwt_Decode from "jwt-decode";
// import "./App.css";
import "antd/dist/antd.css";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

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

const checkAuth = () => {
  let refershToken = localStorage.getItem("refreshToken");
  let localToken = localStorage.getItem("AUTH_USER_TOKEN_KEY");
  if (localToken || refershToken) {
    if (localToken) {
      let { exp } = Jwt_Decode(localToken);

      if (!localToken || !refershToken) {
        return false;
      }

      if (exp < new Date().getTime() / 1000) {
        return false;
      }

      return true;
    }
    if (!localToken) {
      if (!refershToken) {
        return false;
      } else {
        let { exp } = Jwt_Decode(refershToken);
        if (exp < new Date().getTime() / 1000) {
          return false;
        }
        return true;
      }
      // return auth;
    }
  } else {
    let oauthRedirect = JSON.parse(
      localStorage.getItem("amplify-signin-with-hostedUI")
    );
    return oauthRedirect;
  }
};

const AuthRoute = ({ component: Component, user, signOutHandler, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      checkAuth() ? (
        <Component {...props} user={user} handler={signOutHandler} />
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
    customState: null,
  };
  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          Auth.currentSession()
            .then((data) => {
              const { accessToken } = data;

              if (accessToken.jwtToken) {
                localStorage.setItem("refreshToken", accessToken.jwtToken);
              }
            })
            .catch((err) => console.log(err));
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
          break;
        case "signIn_failure":
          this.setState({ user: null });
          break;
        default:
          console.log("sign out");
      }
    });

    Auth.currentAuthenticatedUser()
      .then((user) => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }

  signout = () => {
    Auth.signOut()
      .then(() => {
        this.setState({ user: null });
        delete localStorage["AUTH_USER_TOKEN_KEY"];
        if (!localStorage.getItem("amplify-signin-with-hostedUI")) {
          this.props.history.push("/");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return (
      <div>
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
          <AuthRoute
            path="/dashboard"
            component={UserDashboard}
            user={this.state.user}
            signOutHandler={this.signout}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
