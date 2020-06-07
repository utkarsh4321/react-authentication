import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  notification,
  Spin,
  Col,
  Row,
  Layout,
} from "antd";
import * as colors from "./Vriables";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { Auth } from "aws-amplify";

const Div = styled.div`
// display:flex;
// flex-direction:column;
// align-items:center;
  margin: 0 auto;
  // border: 1px solid ${colors.primaryColor};
  box-shadow:0 0px 2px rgba(0,0,0,.5);
  padding: 1rem;
`;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const anotherLayout = {
  wrapperCol: {
    lg: { offset: 4, span: 16 },
    sm: { span: 12 },
  },
};
const { Content } = Layout;
export default class ConfirmEmail extends Component {
  state = {
    username: "",
    loading: false,
    redirect: false,
    confirmationCode: "",
    error: "",
    resendCode: false,
    resendLoading: false,
  };
  componentDidMount() {
    if (this.props.location.search) {
      // get username from url params
      let username = this.props.location.search.split("=")[1];

      this.setState({ username });
    }
  }
  onChangeHandler = (e) => {
    this.setState({ confirmationCode: e.target.value });
  };
  onResendVerificationCode = () => {
    const { username } = this.state;
    this.setState({ resendLoading: true });
    Auth.resendSignUp(username)
      .then(() => {
        this.setState({ resendCode: true });
        this.setState({ resendLoading: false });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ resendLoading: false });
      });
  };
  render() {
    const {
      loading,
      redirect,
      username,
      resendCode,
      resendLoading,
    } = this.state;
    const onFinish = (values) => {
      let { confirmationcode } = values;
      this.setState({ loading: true });
      Auth.confirmSignUp(username, confirmationcode, {
        forceAliasCreation: true,
      })
        .then((data) => {
          notification.success({
            message: data,
            description:
              "Your email verify successfully, Redirecting you in a few!",
            placement: "topRight",
            duration: 2,
            onClose: () => {
              this.setState({ redirect: true });
            },
          });
          this.setState({ confirmationCode: confirmationcode });
        })
        .catch((err) => {
          notification.error({
            message: err,
            description: "Email verification fail",
            placement: "topRight",
            duration: 2,
          });
          this.setState({ loading: false });
        });
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return (
      <Content>
        <Row align="center">
          <Col xs={{ span: 20 }} lg={{ span: 12 }} style={{ marginTop: 30 }}>
            <Div>
              <h2>Check your email</h2>
              <p>We've sent a six­ digit confirmation code to {username}</p>
              <Form
                {...layout}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Confirmation code"
                  name="confirmationcode"
                  rules={[
                    {
                      required: true,
                      message: "please enter your confirmation code!",
                    },
                  ]}
                >
                  <Input placeholder="Code" />
                </Form.Item>

                <Form.Item {...anotherLayout}>
                  <Row justify="space-between">
                    <Col lg={24} sm={12}>
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        disabled={loading}
                        htmlType="submit"
                      >
                        {loading ? <Spin /> : "Verify"}
                      </Button>
                    </Col>
                    <Col
                      lg={24}
                      sm={12}
                      style={{ marginTop: 20, marginLeft: 10 }}
                    >
                      <Button
                        style={{ width: "100%" }}
                        type="primary"
                        disabled={resendLoading}
                        htmlType="button"
                        onClick={this.onResendVerificationCode}
                      >
                        {resendLoading ? <Spin /> : "Resend"}
                      </Button>
                      {resendCode && "Verification code send successfully"}
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
              {redirect && (
                <Redirect
                  to={{
                    pathname: "/login",
                  }}
                />
              )}
            </Div>
          </Col>
        </Row>
      </Content>
    );
  }
}
