import request from '@/utils/request'

//获取收藏
export function getList(params) {
  return request({
    url: '/MyCollection/getMyCollections',
    method: 'get',
    params
  })
}

//移除收藏
export function deleteColletion(data) {
  return request({
    url: '/MyCollection/deleteColletion',
    method: 'put',
    data
  })
}

//设为紧急或撤销紧急

//Hot 2 紧急 0普通  TopicIds[] 帖子ID
export function setHot(data) {
  return request({
    url: '/MyCollection/setHot',
    method: 'put',
    data
  })
}