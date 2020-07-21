import {GET_USER_INFO, GET_USER_MENU} from './constants'

const initUser = {
    name: '', // 用户名
    avatar: '', // 用户头像
    permissionValueList: [], // 用户按钮级别权限
    permissionList: [] // 用户菜单级别的权限/路由级别的权限
}

export default function user(prevState = initUser, action) {
    switch (action.type) {
        case GET_USER_INFO:
            return {
                ...prevState,
                ...action.data
            }
        case GET_USER_MENU:
            return {
                ...prevState,
                permissionList: action.data
            }
        default:
            return prevState
    }
}