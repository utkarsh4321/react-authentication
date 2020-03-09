import React, { Component } from "react";
import Amplify, { Auth } from "aws-amplify";

class UserDashBoard extends Component {
  onClickHandker = () => {
    Auth.signOut({ global: true })
      .then(data => {
        console.log(data);
        delete localStorage["AUTH_USER_TOKEN_KEY"];
        this.props.history.push("/login");
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <div>
        <h1>User UserDashBoard</h1>
        <p>This the user dashBoard</p>
        <button onClick={this.onClickHandker}>Logout</button>
      </div>
    );
  }
}

export default UserDashBoard;
