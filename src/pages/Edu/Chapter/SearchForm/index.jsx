import React, {useEffect, useState} from "react";
import {Form, Select, Button, message} from "antd";
import {reqGetCourseList} from "@api/edu/controller"

import {connect} from 'react-redux'
import {getChapterList} from '../redux'

import "./index.less";

const {Option} = Select;

function SearchForm(props) {
  const [form] = Form.useForm();
  const [Course, setCourse] = useState([])

  const resetForm = () => {
    form.resetFields();
  };

  useEffect(() => {
    reqGetCourseList().then((res) => {
      setCourse(res)
      console.log(res);
    })
  }, [])

  const getChapterList =async (value) => {
    console.log(value);
    const data = {
      page: 1,
      limit: 10,
      courseId: value.courseId
    }
    //这里用async和await褚翠是为了完成之后使用message
    await props.getChapterList(data)
    message.success('查询成功')
  }
  return (

    <Form layout="inline" form={form} onFinish={getChapterList}>
      <Form.Item name="courseId" label="课程">
        <Select
          allowClear
          placeholder="课程"
          style={{width: 250, marginRight: 20}}
        >
          {Course.map(item => (<Option key={item._id} value={item._id}>{item.title}</Option>))}

        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{margin: "0 10px 0 30px"}}
        >
          查询课程章节
        </Button>
        <Button onClick={resetForm}>重置</Button>
      </Form.Item>
    </Form>
  );
}

export default connect(null, {getChapterList})(SearchForm);
