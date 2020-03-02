import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
const Wrapper = styled.section`
  padding: 0 1rem;
  background: papayawhip;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    & li {
      margin: 20px;
    }
  }

  a {
    text-decoration: none;
  }
`;
const Title = styled.h1`
  font-size: 1.3rem;
  text-align: center;
  color: palevioletred;
`;
function Navbar() {
  return (
    <Wrapper>
      <Title>Auth</Title>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="login">Login</Link>
          </li>
          <li>
            <Link to="signup">Signup</Link>
          </li>
        </ul>
      </nav>
    </Wrapper>
  );
}

export default Navbar;
