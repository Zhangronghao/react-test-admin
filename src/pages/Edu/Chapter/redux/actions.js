import {GET_CHAPTER_LIST, GET_LESSON_LIST} from './constants'
import {reqGetChapterList} from '@api/edu/chapter'
import {reqGetLessonList} from '@api/edu/lesson'
const getChapterListSync = (data) => {
    return {
        type: GET_CHAPTER_LIST,
        data
    }
}
export const getChapterList = ({page, limit, courseId}) => {
    return dispatch => {
        return reqGetChapterList({page, limit, courseId}).then((res) => {
            dispatch(getChapterListSync(res))
            return res
        })
    }
}
//获取课时
const getLessonListSync = (data) => {
    return {
        type: GET_LESSON_LIST,
        data
    }
}
export const getLessonList = (chapterId) => {
    return dispatch => {
        return reqGetLessonList(chapterId).then((res) => {
            dispatch(getLessonListSync(res))
            return res
        })
    }
}