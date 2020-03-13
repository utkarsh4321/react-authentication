import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "./Vriables";
import { NavLink } from "react-router-dom";
import { notification, Spin } from "antd";
import Amplify, { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";
import { withOAuth } from "aws-amplify-react";

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  box-sizing: border-box;
`;
const Div = styled.div`
  margin: 0 auto;
  // border: 1px solid ${colors.primaryColor};
  box-shadow:0 0px 2px rgba(0,0,0,.5);
  padding: 1rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${colors.primaryColor};
  border-radius: 4px;
  display: inline;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;
const Button = styled.button`
  background: palevioletred;
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 0.9rem 1.3rem;
`;
const InsiderDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;
class Login extends Component {
  state = {
    email: "",
    Password: "",
    loading: false
  };
  onChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmitHandler = () => {
    const { email, Password } = this.state;
    this.setState({ loading: true });
    if (email.trim().length > 0 && Password.trim().length > 0) {
      Auth.signIn({
        username: email, // Required, the username
        password: Password // Optional, the password
      })
        .then(user => {
          const { history, location } = this.props;
          const { from } = location.state || {
            from: {
              pathname: "/dashboard"
            }
          };

          localStorage.setItem(
            "AUTH_USER_TOKEN_KEY",
            user.signInUserSession.accessToken.jwtToken
          );

          notification.success({
            message: "Succesfully logged in!",
            description: "Logged in successfully, Redirecting you in a few!",
            placement: "topRight",
            duration: 1.5
          });

          history.push("/dashboard");
        })
        .catch(err => {
          notification.error({
            message: "Error",
            description: err.message,
            placement: "topRight"
          });

          console.log(err);

          this.setState({ loading: false });
        });
    }
  };
  render() {
    console.log(this.props);
    const { email, Password, loading } = this.state;
    return (
      <Wrapper>
        <h1>Login</h1>
        <Div>
          <Input
            placeholder="Email"
            name="email"
            value={email}
            onChange={this.onChangeHandler}
          />
          <Input
            placeholder="Password"
            name="Password"
            value={Password}
            onChange={this.onChangeHandler}
            type="password"
          />
          <button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>
            Open Google
          </button>
          <InsiderDiv>
            <h5>Forgot Password</h5>
            <Button onClick={this.onSubmitHandler}>
              {loading ? <Spin /> : "Login"}
            </Button>
          </InsiderDiv>
          <h5
            style={{
              textAlign: "center",
              margin: 0,
              padding: 0,
              marginTop: 10
            }}
          >
            Don't have account? <NavLink to="/signup">Signup</NavLink>
          </h5>
        </Div>
      </Wrapper>
    );
  }
}
export default withOAuth(Login);
