// 跟课程分类相关的所有请求方法都放在这里

import request from '@utils/request'

// 请求路径不写主机名,会将这个路径和package.json中配置的代理proxy的主机名进行拼接
const BASE_URL = '/admin/edu/subject'

// 现在要从mock上面获取数据,所以重新定义一个请求mock的路径
// 这里有主机名,就不会和proxy拼接了
// const MOCK_URL = `http://localhost:8888${BASE_URL}`

// 获取学科列表
export function reqGetSubjectList(page, limit) {
  // request返回一个promise
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    // http://localhost:8888/admin/edu/subject/1/10
    method: 'GET'
  })
}
//获取二级分类接口
export function reqGetSecSubjectList(parentId) {
  // request返回一个promise
  return request({
    url: `${BASE_URL}/get/${parentId}`,
    // http://localhost:8888/admin/edu/subject/1/10
    method: 'GET'
  })
}
//添加课程分类借楼
// http://localhost:5000/admin/edu/subject/save
export function reqAddSubjectList(title, parentId) {
  // request返回一个promise
  return request({
    url: `${BASE_URL}/save`,
    // http://localhost:8888/admin/edu/subject/1/10
    method: 'POST',
    //axios的post请求发送数据用data
    data: {
      title,
      parentId
    }
  })
}
//点击修改时候触发的函数
export function reqUpdateSubject(title, id) {
  return request({
    url: `${BASE_URL}/update`,
    // http://localhost:8888/admin/edu/subject/1/10
    method: 'PUT',
    //axios的post请求发送数据用data
    data: {
      title,
      id
    }
  })
}
//点击删除时候触发的函数
export function reqDelSubject(id) {
  return request({
    url: `${BASE_URL}/remove/${id}`,
    // http://localhost:8888/admin/edu/subject/1/10
    method: 'DELETE',
    //axios的post请求发送数据用data

  })
}