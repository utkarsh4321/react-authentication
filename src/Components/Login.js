import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "./Vriables";
import { NavLink } from "react-router-dom";

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
export default class Login extends Component {
  render() {
    return (
      <Wrapper>
        <h1>Login</h1>
        <Div>
          <Input placeholder="Email" />
          <Input placeholder="Password" />
          <InsiderDiv>
            <h5>Forgot Password</h5>
            <Button>Login</Button>
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
