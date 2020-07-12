import {
  GET_SUBJECT_LIST,
  GET_SECSUBJECT_LIST,
} from "./constants";

const initSubjectList = {
  total: 0, // 总数
  items: [], // 详细user数据
};

export default function subjectList(prevState = initSubjectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      console.log(action);
      //在这里给每条items加一个children属性，加号就能够展开
      action.data.items.forEach(items => items.children = [])
      return action.data;
    case GET_SECSUBJECT_LIST:

      //判断传进来的data的item长度
      //先获取一级分类的id，等一下要进行添加
      if (action.data.items.length > 0) {
        const parentId = action.data.items[0].parentId
        prevState.items.forEach(item => {
          //拿到自己身上的-id，和二级分类的parentId比较，相同的话就加进去
          if (item._id === parentId) {
            item.children = action.data.items
          }
        })
      }
      //由于redux也是浅层比较，我们一直在原有的prevState上修改，地址没变，不会重新渲染，所以我们要重新解构，给他一个新的地址
      return {...prevState}
    default:
      return prevState
  }
}
