import {
  reqGetSubjectList,
  reqGetSecSubjectList,
  reqUpdateSubject
} from "@api/edu/subject";

import {
  GET_SUBJECT_LIST,
  GET_SECSUBJECT_LIST,
  UPDATE_SUBJECT
} from "./constants";
/**
 * 获取/搜索 用户分页数据
 */
//获取一级学科列表
const getSubjectListSync = (list) => ({
  type: GET_SUBJECT_LIST,
  data: list,
});

export const getSubjectList = (page, limit) => {
  console.log(page, limit);
  return (dispatch) => {
    return reqGetSubjectList(page, limit).then((response) => {
      dispatch(getSubjectListSync(response));
      return response.total;
    });
  };
};
//获取二级学科列表
const getSecSubjectListSync = (list) => ({
  type: GET_SECSUBJECT_LIST,
  data: list,
});

export const getSecSubjectList = (parentId) => {
  return (dispatch) => {
    return reqGetSecSubjectList(parentId).then((response) => {
      dispatch(getSecSubjectListSync(response));
      return response.total;
    });
  };
};

//更新学科数据
const getUpdateSubjectSync = (data) => ({
  type: UPDATE_SUBJECT,
  data
})

export const getUpdateSubject = (title, id) => {
  return (dispatch) => {
    return reqUpdateSubject(title, id).then((res) => {
      dispatch(getUpdateSubjectSync({title, id}))
      return res
    })
  }
}