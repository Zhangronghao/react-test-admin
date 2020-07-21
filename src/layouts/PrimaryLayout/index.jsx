import React, {Component} from 'react'
import {Layout, Menu, Breadcrumb} from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  GlobalOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'

//把siderMenu引进来
import SiderMenu from '../SiderMenu'

import './index.less'

import logo from '@assets/images/logo.png'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

const {Header, Content, Footer, Sider} = Layout
const {SubMenu} = Menu

@withRouter
@connect(state => ({user: state.user}))
class PrimaryLayout extends Component {
  state = {
    collapsed: false
  }

  onCollapse = collapsed => {
    console.log(collapsed)
    this.setState({collapsed})
  }
  render() {
    //正则提取式不需要^$，后面加g是表示全部获取，默认的是获取第一个
    const reg = /[/][a-z]*/g
    //获得完整的路径
    const path = this.props.location.pathname
    //这里用match提取，返回的是一个数组
    const all = path.match(reg)
    console.log(all);
    //将三个路径获取到，第三个路径可能是空，用||判断
    const firstPath = all[0]
    const secPath = all[1]
    const thPath = all[2] || ''

    //结构permissionList，需要foreach遍历，看里面的path属性和我们外面通过正则提取的是否相同，相同的话就获取里面的name属性
    let {permissionList} = this.props.user
    let firstName
    let secName
    permissionList.forEach(item => {
      if (item.path === firstPath) {
        firstName = item.name
        item.children.forEach(secItem => {
          if (secItem.path === secPath + thPath) {
            secName = secItem.name
          }
        })
      }
    })
    return (
      <Layout className='layout'>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className='logo'>
            <img src={logo} alt='' />
            {/* <h1>硅谷教育管理系统</h1> */}
            {!this.state.collapsed && <h1>硅谷教育管理系统</h1>}
          </div>
          <SiderMenu></SiderMenu>
          //这个组件是写在外面的，现在引进来
          {/* <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
            <Menu.Item key='1' icon={<PieChartOutlined />}>
              Option 1
            </Menu.Item>
            <Menu.Item key='2' icon={<DesktopOutlined />}>
              Option 2
            </Menu.Item>
            <SubMenu key='sub1' icon={<UserOutlined />} title='User'>
              <Menu.Item key='3'>Tom</Menu.Item>
              <Menu.Item key='4'>Bill</Menu.Item>
              <Menu.Item key='5'>Alex</Menu.Item>
            </SubMenu>
            <SubMenu key='sub2' icon={<TeamOutlined />} title='Team'>
              <Menu.Item key='6'>Team 1</Menu.Item>
              <Menu.Item key='8'>Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key='9' icon={<FileOutlined />} />
          </Menu> */}
        </Sider>

        <Layout className='site-layout'>
          <Header className='layout-header'>
            <img src={this.props.user.avatar} alt='' />
            <span>{this.props.user.name}</span>
            <GlobalOutlined />
          </Header>
          <Content>
            <div className='layout-nav'>
              //这里的话进行判断，如果是首页的话，firstName是获取不到的，就是und，如果是und的话就渲染首页，不然的话就渲染面包屑
              {firstName ? <>
                <Breadcrumb>
                  <Breadcrumb.Item>{firstName}</Breadcrumb.Item>
                  <Breadcrumb.Item>{secName}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{secName}</h3>
              </>
                : <h2>首页</h2>}
            </div>

            <div className='layout-content'>Bill is a cat.</div>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
export default PrimaryLayout