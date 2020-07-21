import React, {Component} from 'react'
import {loginSuccessSync} from '@redux/actions/login'
import {connect} from 'react-redux'

@connect()
class Oauth extends Component {
    componentDidMount() {
        const token = window.location.search.split('=')[1]
        // 因为这里的actions和reducer传过去的是对象，就是token：token
        this.props.dispatch(loginSuccessSync({token}))
        localStorage.setItem('user_token', token)
        this.props.history.push('/')

    }
    render() {
        return (
            <div>
                git授权登录
            </div>
        )
    }
}
export default Oauth