import React, { Component } from "react";

class UserDashBoard extends Component {
  render() {
    return (
      <div>
        <h1>User UserDashBoard</h1>
        <p>This the user dashBoard</p>
        <button onClick={this.props.handler}>Logout</button>
      </div>
    );
  }
}

export default UserDashBoard;
