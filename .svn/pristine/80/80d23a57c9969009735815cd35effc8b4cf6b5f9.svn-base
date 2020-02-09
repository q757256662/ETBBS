import request from '@/utils/request';

//标签相关
//获取标签列表
export function getTag(params) {
    return request({
      url: '/tag/gettags',
      method: 'get',
      params
    })
  }
  
//添加标签
  export function addTag(data) {
    return request({
      url: '/tag/add',
      method: 'post',
      data:data
    })
  }

//修改标签名
  export function editTag(data) {
    return request({
      url: '/tag/update',
      method: 'put',
      data
    })
  }
 
  //给帖子定义标签  topicId帖子Id   tagId标签Id
  export function updataTagTopic(data) {
    return request({
      url: '/Concern/updatetagid',
      method: 'put',
      data
    })
  }