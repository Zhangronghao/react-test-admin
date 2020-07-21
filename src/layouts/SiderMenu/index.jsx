import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Layout, Menu, Breadcrumb} from 'antd'

import {Link, withRouter} from 'react-router-dom'

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

import Icons from '@conf/icons.js'

//这个是config里面的router.js的默认路由
import {defaultRoutes} from '@conf/routes'
//把SubMenu从Menu里面结构出来，二级菜单的时候要用
const {SubMenu} = Menu


@withRouter
@connect(state => ({permissionList: state.user.permissionList}))
class SiderMenu extends Component {
  renderMenu = (menus) => {

    // 这里要return，不然调用函数没有返回值的话就不会进行渲染
    return menus.map(menu => {
      // 如果这个是hidden的话就不展示了直接返回
      if (menu.hidden) {
        return
      }

      const Icon = Icons[menu.icon]
      // console.log(Icon);

      if (menu.children && menu.children.length) {
        return (
          <SubMenu key={menu.path} icon={<Icon />} title={menu.name}>
            {/* //有children的时候再次进行遍历，生成二级的选项 */}
            {menu.children.map(secMenu => {
              if (secMenu.hidden) return
              return (<Menu.Item key={menu.path + secMenu.path}>
                {<Link to={menu.path + secMenu.path}>{secMenu.name}</Link>}
              </Menu.Item>)
            })}
          </SubMenu>
        )
      } else {
        return (
          <Menu.Item key={menu.path} icon={<Icon />}>
            {menu.path === '/' ? <Link to={'/'}>{menu.name}</Link> : menu.name}
          </Menu.Item>
        )
      }
    })
  }
  render() {
    console.log(this.props);
    let path = this.props.location.pathname

    const reg = /[/][a-z]*/ //提取一级菜单路径的正则
    const firstPath = path.match(reg)[0]
    return (
      <>
        <Menu theme='dark' defaultSelectedKeys={[path]} mode='inline' defaultOpenKeys={[firstPath]}>
          {this.renderMenu(defaultRoutes)}
          {this.renderMenu(this.props.permissionList)}
        </Menu>
      </>
    )
  }
}
export default SiderMenu