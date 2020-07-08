import React, {Component} from "react";
//首先引入button按钮
// import {Button} from 'antd';
import {Button, Table} from 'antd';
import {
  FormOutlined, DeleteOutlined, PlusOutlined
} from '@ant-design/icons';
import './index.css'

const columns = [
  {title: '学科', dataIndex: 'name', key: 'name'},

  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    render: () => <>
      <Button type="primary" className="firstBtn"><FormOutlined /></Button>

      <Button type="danger"><DeleteOutlined /></Button>
    </>,
    width: 200
  },
];

const data = [
  {
    key: 1,
    name: '前端',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    name: '大数据',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    name: 'JAVA',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: 4,
    name: 'UI',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
];

export default class Subject extends Component {

  render() {
    return <div className="bgc">
      <Button type="primary" icon={<PlusOutlined />}>添加</Button>
      <Table className="tablePad"
        columns={columns}
        expandable={{
          expandedRowRender: record => <p style={{margin: 0}}>{record.description}</p>,
          rowExpandable: record => record.name !== 'Not Expandable',
        }}
        dataSource={data}
      />,
    </div>;
  }
}
