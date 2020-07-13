// 跟课程分类相关的所有请求方法都放在这里

import request from '@utils/request'

// 请求路径不写主机名,会将这个路径和package.json中配置的代理proxy的主机名进行拼接
const BASE_URL = '/admin/edu/course'

// 现在要从mock上面获取数据,所以重新定义一个请求mock的路径
// 这里有主机名,就不会和proxy拼接了
// const MOCK_URL = `http://localhost:8888${BASE_URL}`

// 获取学科列表
export function reqGetCourseList() {
    // request返回一个promise
    return request({
        url: `${BASE_URL}`,
        // http://localhost:8888/admin/edu/subject/1/10
        method: 'GET'
    })
}