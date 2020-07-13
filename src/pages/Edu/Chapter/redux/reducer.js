import {GET_CHAPTER_LIST, GET_LESSON_LIST} from './constants'
import {Children} from 'react'
const initChapterList = {
    total: '',
    items: []
}
export function chapterList(prevState = initChapterList, action) {
    switch (action.type) {
        case GET_CHAPTER_LIST:
            action.data.items.forEach(item => {
                item.children = []
            })
            return action.data
        case GET_LESSON_LIST:
            //这里发送请求，拿到的就是章节下面的数据，里面如果有数据的话，会有一个自身的_id，和父组件的chapterId
            if (action.data.length > 0) {
                const chapterId = action.data[0].chapterId
                //我们对比子组件的chapterId和父组件的_id是否一致，就可以进行数据添加了
                prevState.items.forEach(item => {
                    if (item._id === chapterId) {
                        item.children = action.data
                    }
                })
            }
            return {...prevState}
        default:
            return prevState
    }
}