import React, {Component} from 'react'
// 导入antd组件
import {Button, Table, Tooltip, Input, message, Modal, Space} from 'antd'
// 导入antd-图标
import {PlusOutlined, DeleteOutlined, FormOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
//引入connect，包装组件
import {connect} from 'react-redux'

//引入redux里面的异步action来发送请求
import {getSubjectList, getSecSubjectList, getUpdateSubject} from './redux'
//导入定义的发送请求的方法,使用了redux，已经不需要在这里导入了
// import {reqGetSubjectList} from '@api/edu/subject'
//引入删除学科的api
import {reqDelSubject} from '@api/edu/subject'
//导入样式文件
import './index.css'

const {confirm} = Modal;
const columns = [
  // columns 定义表格的列
  // title属性: 表示列的名称
  // dataIndex决定: 这一列展示的是data中哪一项的数据
  {
    title: '分类名称', key: 'title', render: () => {
      return <Input className="subject-input"></Input>
    }
  },

  {
    title: '操作',
    dataIndex: '', //表示这一列不渲染data里的数据
    key: 'x',
    // 自定义这一列要渲染的内容
    render: () => (
      <>
        <Tooltip title="修改数据">
          <Button type='primary' className='firstBtn'>
            <FormOutlined />
          </Button>
        </Tooltip>
        <Tooltip title="删除数据">
          <Button type='danger'>
            <DeleteOutlined />
          </Button>
        </Tooltip>
      </>
    ),
    // 设置这一列的宽度
    width: 200
  }
]

//使用标识符方法来包装组件，注意语法问题，这里的默认到处要放到最下面了
@connect(state => ({subjectList: state.subjectList}), {getSubjectList, getSecSubjectList, getUpdateSubject})
class Subject extends Component {

  //定义一个state，用来存放一个标识，决定输入框是否展示
  state = {
    //这是一个标识符，来决定文本框是否开启
    subjectId: '',
    subjectTitle: ''//这个用来控制输入框的值，是个受控组件
  }
  page = '1'
  pageSize = 10
  // state = {
  //   subject: {}, //用于存储数据,
  // }
  componentDidMount() {
    // 一打开页面就发送请求,这里改用异步action了
    // this.handleChange(1, 10)
    this.props.getSubjectList(1, 10)
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
    this.page = page
    // console.log(page, pageSize);
    this.props.getSubjectList(page, pageSize)
  }
  hangdleSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.page = current
    this.pageSize = pageSize
    this.props.getSubjectList(current, pageSize)

  }
  handleGoAddSubmit = () => {
    this.props.history.push('/edu/subject/add')
  }
  //这个是点击展开按钮时候的函数,接收两个参数，第一个参数是布尔值，由展开隐藏决定，第二个参数是该行的数据
  handleClickExpand = (expanded, record) => {
    //判断如果是展开的，就发送请求
    if (expanded) {
      //这个是传进来的异步action，通过record能拿到当前的id
      this.props.getSecSubjectList(record._id)
    }
  }
  //这个是点击修改按钮的函数,这个value是当前行的所有数据
  handleUpdateClick = (value) => {
    // console.log(value);
    return () => {
      this.setState({
        subjectId: value._id,
        //一点击就会修改state里面的值，state里面的值一改变就会重新渲染render，然后文本框的也被渲染
        subjectTitle: value.title
      })
    }
  }
  //文本框修改时候触发的事件
  handleTitleChange = (e) => {
    this.setState({
      subjectTitle: e.target.value
    })
  }
  //点击取消按钮事件
  handleCancle = () => {
    this.setState({
      subjectId: '',
      subjectTitle: ''
    })
  }
  //点击修改按钮事件
  handleUpdate = (value) => {
    return async () => {

      // console.log(value);
      //先把原先的数据结构，然后传到action里面，这里的state里面保存的就是数据
      let {subjectId, subjectTitle} = this.state

      //判断输入的是否为空，空的话不给添加
      if (this.state.subjectTitle.length === 0) {
        message.error('输入内容不能为空')
        return
      }
      this.oldSubjectTitle = this.statesubjectTitle
      if (value.title === this.state.subjectTitle) {
        message.error('内容不能相同')
        return
      }

      await this.props.getUpdateSubject(subjectTitle, subjectId)
      message.success('更改成功')

      // 手动调用取消按钮的事件处理函数,让表格行展示内容
      this.handleCancle()
    }
  }
  //删除学科
  delSubject = (value) => {
    return () => {
      confirm({
        title: `确定要删除${value.title}这行数据吗`,
        icon: <ExclamationCircleOutlined />,
        content: '你真的确定吗？删错了你别哭！',
        onOk: async () => {
          await reqDelSubject(value._id)
          message.success('删除成功')
          //这个是判断是否是最后一页，用subjectList里面的总条数total去除以分页，得到当前页
          const what = Math.ceil(this.props.subjectList.total / this.pageSize)
          //如果是最后一页最后一条，删除的时候会全部数据都没了，所以如果是最后一页最后一条删除，我们要请求上一页的数据
          //判断，当前不是第一页，当前的数据里面不是最后一条，当前不是唯一的一页，我们就请求上一页的数据
          console.log(this.page, this.props.subjectList.items.length, what, this.pageSize);
          if (this.page != 1 && this.props.subjectList.items.length === 1 && what === this.page) {
            this.props.getSubjectList(--this.page, this.pageSize)
            return
          }
          this.props.getSubjectList(this.page, this.pageSize)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }
  render() {
    //因为这个值要在state更新的时候重新渲染，所以要放到render里面
    const columns = [
      // columns 定义表格的列
      // title属性: 表示列的名称
      // dataIndex决定: 这一列展示的是data中哪一项的数据
      {
        title: '分类名称', key: 'title',
        //这里的render也能传一个value，接收的是整行的数据
        //因为有十条数据，所以我们的render会执行十次渲染十次，对比this.state里面的值和哪条的——id相同，就变成输入框
        render: (value) => {
          if (this.state.subjectId === value._id) {
            //受控组件需要一个onchange，不然就算变成文本框也无法输入
            return <Input value={this.state.subjectTitle.trim()} className="subject-input" onChange={this.handleTitleChange}></Input>
          } else {
            return <span>{value.title}</span>
          }
        }
      },

      {
        title: '操作',
        dataIndex: '', //表示这一列不渲染data里的数据
        key: 'x',
        // 自定义这一列要渲染的内容
        //这个render里面可以穿一个value，能到到整行的数据
        //当变成文本框的时候，这两个按钮也要变化，所以我们也需要判断，判断的方法和上面的相同，看看id和state里面存的是否一样
        render: (value) => {

          if (this.state.subjectId == value._id) {
            return <>
              <Button type='primary' className='queren' onClick={this.handleUpdate(value)}>确认</Button>
              <Button type='danger' onClick={this.handleCancle}>取消</Button>
            </>
          }
          return (
            <>
              <Tooltip title="修改数据">
                <Button type='primary' className='firstBtn' onClick={this.handleUpdateClick(value)}>
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="删除数据">
                <Button type='danger' onClick={this.delSubject(value)}>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </>
          )
        },
        // 设置这一列的宽度
        width: 200
      }
    ]
    console.log(this.props)
    return (
      <div className='bgc'>
        <Button type='primary' className='tablePad' onClick={this.handleGoAddSubmit}>
          <PlusOutlined />
          新建
        </Button>
        <Table
          // 控制列
          columns={columns}
          // 控制可展开项
          expandable={{
            //这个api会在列表展开的时候触发
            onExpand: this.handleClickExpand
          }}
          //表示里面的数据,这里要改用redux里面state的了
          dataSource={this.props.subjectList.items}
          // 告诉Table组件,使用数据中_id作为key值
          rowKey='_id'
          pagination={{
            current: this.page,
            total: this.props.subjectList.total,
            showQuickJumper: true,
            // defaultPageSize: 5,
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
