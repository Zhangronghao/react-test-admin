import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Card, Form, Select, Input, Button, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

//我们后面不使用redux了，使用组件内部的state来储存值
// import {getSubjectList} from '../../redux'
// import {connect} from 'react-redux'
// import Subject from '../..'
import {reqGetSubjectList, reqAddSubjectList} from '@api/edu/subject'


const Option = Select.Option
//表单布局属性
const layout = {
    // antd把一个宽度分为24份
    // 表单文字描述部分
    labelCol: {
        span: 3
    },
    // 表单项部分
    wrapperCol: {
        span: 6
    }
}

// 点击添加按钮,表单校验成功之后的回调函数

// 表单校验失败的回调函数
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
}


//要传入数据，所以要用connect包装一下
//不用redux了，注释掉
// @connect(state => ({subjectList: state.subjectList}), {getSubjectList})
class AddSubject extends Component {
    //一开始就定义一个page，上来就发送请求第一页的数据，后续每次++
    page = 1
    //定义一个state，在里面存储参数
    state = {
        subjectList: {
            total: 0,
            items: []
        }
    }
    //我们应该在这个组件加载的时候重新发送请求，请求最新的redux数据
    async componentDidMount() {
        //这个函数返回一个promise，所以用awiat接住
        const res = await reqGetSubjectList(this.page++, 10)
        console.log(res);
        this.setState({
            subjectList: res
        })
    }
    getMore = async () => {
        const res = await reqGetSubjectList(this.page++, 10)
        //吧原来的数据和新的数据拼接形成一个新的数组
        const newItems = [...this.state.subjectList.items, ...res.items]
        this.setState({
            subjectList: {
                ...res,
                items: newItems
            }
        })
    }
    // 点击添加按钮,表单校验成功之后的回调函数

    onFinish = async values => {
        console.log('Success:', values)
        //判断成功还是失败，因为这个返回的是promise，所以用try catch接住
        try {
            await reqAddSubjectList(values.subjectname, values.parentid)
            message.success('添加数据成功')
            this.props.history.push('/edu/subject/list')
        } catch (error) {
            message.error('添加数据失败')
        }
    }
    render() {
        return (
            <>
                <Card
                    title={
                        <>
                            <Link to='/edu/subject/list'>
                                <ArrowLeftOutlined />
                            </Link>
                            <span className='title'>新增课程</span>
                        </>
                    }
                >
                    <Form
                        {...layout}
                        name='subject'
                        onFinish={this.onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label='课程分类名称'
                            name='subjectname'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入课程分类!'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label='父级分类id'
                            name='parentid'
                            rules={[
                                {
                                    required: true,
                                    message: '请选择分类id'
                                }
                            ]}
                        >
                            <Select
                                dropdownRender={meau => {
                                    return <>
                                        {meau}
                                        {/* 这个案例有一个需要注意的点，我们不能使用redux了，因为每次调用会把原先的数据覆盖 */}
                                        {/* 判断，如果数据加载完了，就不显示这个加载更多数据的按钮了 */}
                                        {this.state.subjectList.total != this.state.subjectList.items.length && (<Button type="link" onClick={this.getMore}>加载更多数据</Button>)}
                                    </>
                                }}
                            >
                                <Option value={0} key={0}>
                                    {'一级菜单'}
                                </Option>
                                {this.state.subjectList.items.map(subject => {
                                    return <Option value={subject._id} key={subject._id}>{subject.title}</Option>
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type='primary' htmlType='submit'>
                                Submit
                        </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </>
        )
    }
}
export default AddSubject