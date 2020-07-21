import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserInfo, getUserMenu} from './redux'

import Loading from '@comps/Loading'


@connect(
  null,
  {getUserInfo, getUserMenu}
)
class Authorized extends Component {
  state = {
    loading: true
  }
  async componentDidMount() {
    //发送请求获取数据
    // this.props.getUserInfo()
    // this.props.getUserMenu()
    //像上面一条一条获取数据太慢，所以使用promise.all，一次性获取
    let {getUserInfo, getUserMenu} = this.props
    await Promise.all([getUserInfo(), getUserMenu()])
    this.setState({
      loading: false
    })
  }
  render() {
    let {loading} = this.state
    // return this.props.render()
    //现在根据state里面loading的状态来进行渲染
    return loading ? <Loading></Loading> : this.props.render()
  }
}

export default Authorized
