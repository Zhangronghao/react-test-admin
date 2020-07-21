import React, {Component, useState} from "react";
import {Form, Input, Button, Checkbox, Row, Col, Tabs, message} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import {login, mobileLogin} from "@redux/actions/login";

import "./index.less";
import {reqGetverifyCode} from '@api/acl/oauth'

const {TabPane} = Tabs;


//这里要用到表单de useForm方法获取到form的实例对象，所以改写类组件变成函数组件要使用hook
function LoginForm(props) {
  //获取到form的实例对象，并且在form表单那里要进行关联
  const [form] = Form.useForm()
  //定义一个state
  const [isShowDownCount, setIsShowDownCount] = useState(false)
  //设置一个倒计时
  let [daojishi, setDaojishi] = useState(5)
  //这个在标签切换的时候会进行设置改变
  const [activeKey, setActiveKey] = useState('user')


  const onFinish = () => {
    //1. 判断当前这个登录按钮,是用户名密码登录还是手机登录

    // console.log(activeKey)
    if (activeKey === 'user') {
      // 通过form.validateFields校验用户名和密码
      //form的这个方法会返回一个promise，可以拿到输入的值
      form.validateFields(['username', 'password']).then(res => {
        console.log(res)
        let {username, password} = res
        //在上面将拿到的值结构，然后发送action请求，发送请求只会会拿到一个token，然后存起来
        props.login(username, password).then(token => {
          // 登录成功
          // console.log("登陆成功~");
          // 持久存储token
          localStorage.setItem('user_token', token)
          props.history.replace('/')
        })
      })
    } else {
      // 校验手机号和验证码
      form.validateFields(['phone', 'verify']).then(res => {
        // console.log(res)
        let {phone, verify} = res
        props.mobileLogin(phone, verify).then(token => {
          // 登录成功
          // console.log("登陆成功~");
          // 持久存储token
          localStorage.setItem('user_token', token)
          props.history.replace('/')
        })
      })
    }
    // console.log('finish执行了')
    // props.login(username, password).then(token => {
    //   // 登录成功
    //   // console.log("登陆成功~");
    //   // 持久存储token
    //   localStorage.setItem('user_token', token)
    //   props.history.replace('/')
    // })
    // .catch(error => {
    //   notification.error({
    //     message: "登录失败",
    //     description: error
    //   });
    // });
  }

  const validator = (rules, value, name) => {
    console.log(rules);
    if (rules.field == 'username') {
      name = '用户名'
    }
    if (rules.field == 'password') {
      name = '密码'
    }
    return new Promise((res, rej) => {
      if (!value) {
        return rej(`请输入+${name}`)
      }
      if (value.length < 4) {
        return rej(`${name}长度必须大于四位`)
      }
      if (value.length > 16) {
        return rej(`${name}长度必须小于十六位`)
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return rej(`${name}由数字字母下划线组成`)
      }
      return res()
    })
  }

  //获取验证码
  const getVerifyCode = async () => {
    const res = await form.validateFields(['phone'])
    console.log(res);
    //在获取到手机号之后发送请求
    reqGetverifyCode(res.phone)
    setIsShowDownCount(true)
    let timeId = setInterval(() => {
      setDaojishi(--daojishi)
      if (daojishi <= 0) {
        clearInterval(timeId)
        setIsShowDownCount(false)
        setDaojishi(5)
      }
    }, 1000);
  }

  //登录按钮的点击事件
  const handleTabChange = (activeKey) => {
    setActiveKey(activeKey)
  }

  //这个是gitLogin
  const gitLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=6e8efec6afb66c64f399`
  }
  //hook也不要要render了
  // render() {
  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{remember: true}}
        onFinish={onFinish}
        form={form}
      >
        <Tabs
          defaultActiveKey="user"
          tabBarStyle={{display: "flex", justifyContent: "center"}}
          onChange={handleTabChange}
        >
          <TabPane tab="账户密码登陆" key="user">
            <Form.Item name="username"
              rules={[{
                validator
              }]}>
              <Input
                prefix={<UserOutlined className="form-icon" />}
                placeholder="用户名: admin"
              />
            </Form.Item>
            <Form.Item name="password"
              rules={[{
                validator
              }]}>
              <Input
                prefix={<LockOutlined className="form-icon" />}
                type="password"
                placeholder="密码: 111111"
              />
            </Form.Item>
          </TabPane>
          <TabPane tab="手机号登陆" key="phone">
            <Form.Item name="phone"
              rules={[
                {
                  required: true,
                  message: '请输入手机号码'
                },
                {
                  pattern: /^1[3456789]\d{9}$/,
                  message: '你输入的不是手机号'
                }
              ]}>
              <Input
                prefix={<MobileOutlined className="form-icon" />}
                placeholder="手机号"
              />
            </Form.Item>

            <Row justify="space-between">
              <Col span={16}>
                <Form.Item name="verify">
                  <Input
                    prefix={<MailOutlined className="form-icon" />}
                    placeholder="验证码"
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Button className="verify-btn" onClick={getVerifyCode} disabled={isShowDownCount}>{isShowDownCount ? `${daojishi}秒后获取` : '获取验证码'}</Button>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <Row justify="space-between">
          <Col span={7}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>自动登陆</Checkbox>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Button type="link">忘记密码</Button>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登陆
            </Button>
        </Form.Item>
        <Form.Item>
          <Row justify="space-between">
            <Col span={16}>
              <span>
                其他登陆方式
                  <GithubOutlined className="login-icon" onClick={gitLogin} />
                <WechatOutlined className="login-icon" />
                <QqOutlined className="login-icon" />
              </span>
            </Col>
            <Col span={3}>
              <Button type="link">注册</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
}
// }

export default withRouter(
  connect(null, {
    login, mobileLogin
  })(LoginForm)
)
