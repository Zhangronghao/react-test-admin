import React, {Component} from 'react'
// 导入antd组件
import {Button, Table} from 'antd'
// 导入antd-图标
import {PlusOutlined, DeleteOutlined, FormOutlined} from '@ant-design/icons'

//引入connect，包装组件
import {connect} from 'react-redux'

//引入redux里面的异步action来发送请求
import {getSubjectList} from './redux'
//导入定义的发送请求的方法,使用了redux，已经不需要在这里导入了
// import {reqGetSubjectList} from '@api/edu/subject'

//导入样式文件
import './index.css'

const columns = [
  // columns 定义表格的列
  // title属性: 表示列的名称
  // dataIndex决定: 这一列展示的是data中哪一项的数据
  {title: '分类名称', dataIndex: 'title', key: 'title'},

  {
    title: '操作',
    dataIndex: '', //表示这一列不渲染data里的数据
    key: 'x',
    // 自定义这一列要渲染的内容
    render: () => (
      <>
        <Button type='primary' className='firstBtn'>
          <FormOutlined />
        </Button>
        <Button type='danger'>
          <DeleteOutlined />
        </Button>
      </>
    ),
    // 设置这一列的宽度
    width: 200
  }
]

const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description:
      'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description:
      'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
  },
  {
    key: 3,
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable'
  },
  {
    key: 4,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description:
      'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
  }
]
//使用标识符方法来包装组件，注意语法问题，这里的默认到处要放到最下面了
@connect(state => ({subjectList: state.subjectList}), {getSubjectList})
class Subject extends Component {
  page = '1'
  // state = {
  //   subject: {}, //用于存储数据,
  // }
  componentDidMount() {
    // 一打开页面就发送请求,这里改用异步action了
    // this.handleChange(1, 10)
    this.props.getSubjectList(1,10)
  }
  //使用redux的异步action，已经不需要这个了
  // getSubjectList = async (page, pageSize) => {
  //   const res = await reqGetSubjectList(page, pageSize)
  //   console.log(res)
  //   this.page = page
  //   this.setState({
  //     subject: res
  //   })
  // }
  handleChange = (page, pageSize) => {
    this.props.getSubjectList(page, pageSize)
    this.page = page
  }
  hangdleSizeChange = (current, pageSize) => {
    this.props.getSubjectList(current, pageSize)
    this.page = current

  }
  render() {
    console.log(this.props)
    return (
      <div className='bgc'>
        <Button type='primary' className='tablePad'>
          <PlusOutlined />
          新建
        </Button>
        <Table
          // 控制列
          columns={columns}
          // 控制可展开项
          expandable={{
            // 可展开项展示的内容
            expandedRowRender: record => (
              <p style={{margin: 0}}>{record.description}</p>
            ),
            // 控制这一列是否可展开
            rowExpandable: record => record.name !== 'Not Expandable'
          }}
          //表示里面的数据,这里要改用redux里面state的了
          dataSource={this.props.subjectList.items}
          // 告诉Table组件,使用数据中_id作为key值
          rowKey='_id'
          pagination={{
            current: this.page,
            total: this.props.subjectList.total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'], //设置每天显示数据数量的配置项
            // defaultPageSize: 5,
            onChange: this.handleChange,
            onShowSizeChange: this.hangdleSizeChange
          }}
        />
      </div>
    )
  }
}
export default Subject
