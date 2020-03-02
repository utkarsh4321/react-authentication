import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "./Vriables";
import { NavLink } from "react-router-dom";
import Amplify, { Auth } from "aws-amplify";
import {
  Form,
  Input,
  Icon,
  Button,
  notification,
  Popover,
  Spin,
  Col,
  Row,
  Checkbox,
  Layout,
  Typography
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  DownloadOutlined
} from "@ant-design/icons";
const passwordValidator = require("password-validator");
// import awsconfig from "../aws-exports";
// Amplify.configure(awsconfig);
const schema = new passwordValidator();

schema
  .is()
  .min(6)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();

// const Wrapper = styled.section`
//   width: 100%;
//   height: 100%;
//   display: grid;
//   place-items: center;
//   box-sizing: border-box;
// `;
const Div = styled.div`
// display:flex;
// flex-direction:column;
// align-items:center;
  margin: 0 auto;
  // border: 1px solid ${colors.primaryColor};
  box-shadow:0 0px 2px rgba(0,0,0,.5);
  padding: 1rem;
`;
// const Input = styled.input`
//   width: 100%;
//   padding: 10px 14px;
//   border: 1px solid ${colors.primaryColor};
//   border-radius: 4px;
//   display: inline;
//   margin: 0;
//   &:not(last-child) {
//     margin-bottom: 1rem;
//   }
// `;
// const Button = styled.button`
//   background: palevioletred;
//   color: #fff;
//   border: none;
//   border-radius: 3px;
//   padding: 0.9rem 1.3rem;
//   width: 50%;
// `;
// const InsiderDiv = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

const layout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16
  }
};
const anotherLayout = {
  wrapperCol: {
    lg: { offset: 4, span: 16 },
    sm: { span: 12 }
  }
};
const { Content } = Layout;
const { Title } = Typography;
class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    phoneNumber: 0,
    confirmDirty: false,
    redirect: false,
    loading: false
  };
  gotoSignIn = () => {
    this.props.onStateChange("signIn", {});
  };
  onChangeHandler = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };
  valueChecker = (...value) =>
    (value[0].trim().length > 0 &&
      value[1].trim().length > 0 &&
      value[2].trim().length > 0) ||
    alert("please fill all the field");
  onSubmitHandler = e => {
    const { username, email, password } = { ...this.state };
    console.log(this.state);
    if (this.valueChecker(username, email, password)) {
      console.log("every thing ok please got");
    } else {
      console.log("Please fiil all the filed");
    }
  };
  render() {
    const { redirect, loading } = this.state;
    const title = "Password Policy";
    const passwordPolicyContent = (
      <React.Fragment>
        <h4>Your password should contain: </h4>
        <ul>
          <li>Minimum length of 8 characters</li>
          <li>Numerical characters (0-9)</li>
          <li>Special characters</li>
          <li>Uppercase letter</li>
          <li>Lowercase letter</li>
        </ul>
      </React.Fragment>
    );
    const onFinish = values => {
      console.log("Success:", values);
    };

    const onFinishFailed = errorInfo => {
      console.log("Failed:", errorInfo);
    };

    return (
      <Content>
        <Row align="center">
          <Col xs={{ span: 20 }} lg={{ span: 12 }} style={{ marginTop: 30 }}>
            <Div>
              <Title style={{ textAlign: "center" }}>Signup</Title>
              <Form
                {...layout}
                name="basic"
                initialValues={{
                  remember: true
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                onSubmit={this.onSubmitHandler}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!"
                    }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!"
                    }
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Phone number"
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!"
                    }
                  ]}
                >
                  <Popover
                    placement="right"
                    title={title}
                    content={passwordPolicyContent}
                    trigger="focus"
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password"
                    />
                  </Popover>
                </Form.Item>

                <Form.Item
                  {...tailLayout}
                  name="remember"
                  valuePropName="checked"
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                {/* <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>

                </Form.Item> */}
                <Form.Item {...anotherLayout}>
                  <Row justify="space-between">
                    <Col lg={24} sm={12}>
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        disabled={loading}
                        htmlType="submit"
                      >
                        {loading ? <DownloadOutlined /> : "Register"}
                      </Button>
                    </Col>
                    <Col lg={24} sm={12}>
                      Or <NavLink to="/login">login to your account!</NavLink>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Div>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default Signup;
