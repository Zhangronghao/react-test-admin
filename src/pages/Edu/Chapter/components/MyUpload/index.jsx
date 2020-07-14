import React, {Component} from 'react'

import {message, Upload, Button} from 'antd'
import {UploadOutlined} from '@ant-design/icons'

import {reqGetQiniuToken} from '@api/edu/lesson'

import * as qiniu from 'qiniu-js'
import {nanoid} from 'nanoid'

export default class MyUpload extends Component {
    //我们一上来使用构造器，来初始化state里面的值
    constructor() {
        super()
        const str = localStorage.getItem('upload_token')
        const newStr = JSON.parse(str)
        //如果一开始有值，就把这里面的数据复制给state,没有的话就给state一个初始的值，0
        if (str) {
            this.state = {
                ...newStr
            }
        } else {
            this.state = {
                expires: 0,
                uploadToken: ''
            }
        }
    }
    //在视频上传之前会这行这个函数，可以使retrun 布尔值，false就不上传，true就会上传file
    //也可以返回一个promise，如果是rej（），就失败不上传，如果上传，要在res（file）上传
    handleBeforeUpload = (file) => {
        const MAX_VIDEO_SIZE = 20 * 1024 * 1024
        return new Promise(async (res, rej) => {
            //判断大小
            if (file > MAX_VIDEO_SIZE) {
                message.error('上传文件超过大小限制（20m），请重新选择视频！')
                rej()
            }
            //在判断大小符合之后再判断时间是否过期，如果过期的话重新发送一个请求
            if (Date.now() > this.state.expires) {
                //发送请求，接收到两个参数
                const {expires, uploadToken} = await reqGetQiniuToken()
                //收到参数之后调用方法存起来
                this.saveUoloadToken(expires, uploadToken)
            }
            res(file)
        })
    }
    //这个方法是用来存数据的
    saveUoloadToken = (expires, uploadToken) => {
        //先把获取到的时间加一下，然后重新赋值给expires，这个是计算过的加过之后的时候，后面的时候用这个和data.now（）判断比较，就知道是不是过期
        //因为token的过期时间是在七牛云发送的时候就开始计算的，因为网络不同可能会有延迟有时间差，我们需要减掉一部分时间
        const targetTime = Date.now() + expires * 1000 - 5 * 60 * 1000
        expires = targetTime
        //转成JSON字符串
        const upload_token = JSON.stringify({expires, uploadToken})
        //转成字符串之后加到缓存里面和state里面
        localStorage.setItem('upload_token', upload_token)
        this.state = {
            expires,
            uploadToken
        }
    }
    handleCustomRequest = (value) => {
        const file = value.file
        const key = nanoid(10) + 'zrh'
        const token = this.state.uploadToken
        const putExtra = {
            mimeType: ['video/*']
        }
        const config = {
            region: qiniu.region.z2
        }

        console.log(file, key, token, putExtra, config);
        const observable = qiniu.upload(file, key, token, putExtra, config)

        const observer = {
            //上传过程中触发的回调函数
            next(res) {
                console.log('上传中');
                value.onProgress(res.total)
            },
            //上传失败触发的回调函数
            error(err) {
                console.log('上传失败' + err);
                value.onError(err)

            },
            // 上传成功触发的回调函数
            complete:(res) =>{
                console.log('上传成功');
                value.onSuccess(res)
                
                this.props.onChange('http://qdg8pxnny.bkt.clouddn.com/' + res.key)
            }
        }

        this.subscription = observable.subscribe(observer)
    }

    componentWillUnmount() {
        //this里面有这个参数才会执行后面的写在代码，不然的话会报错（注意：这个bug是魏老师解决的。魏老师，编程滴神！）
        this.subscription&&this.subscription.unsubscribe()
    }
    render() {
        return (
            <div>
                <Upload
                    //这是Upload的两个API
                    beforeUpload={this.handleBeforeUpload}
                    customRequest={this.handleCustomRequest}
                    // 前端控制上传视频的类型, 不是视频文件,就看不到
                    accept='video/*'
                >
                    <Button>
                        <UploadOutlined /> 上传视频
                    </Button>
                </Upload>
            </div>
        )
    }
}
