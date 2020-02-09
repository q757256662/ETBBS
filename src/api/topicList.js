import request from '@/utils/request'

export function LoadQueryCondition() {
  return request({
    url: '/topicList/GetSearchCondition',
    method: 'get'
  })
}

export function GetTopicList(data) {
  return request({
    url: '/topicList/GetTopicData',
    method: 'post',
    data
  })
}

//查看帖子限制分
export function GetLimitScore(data){
  return request({
    url: '/topicList/GetLimitScore',
    method: 'post',
    data
  })
}


//转为为结帖
export function changeTopic(data) {
  return request({
    url: '/Topic/truning',
    method: 'put',
    data
  })
}


export function getNobodyList(data) {
  return request({
    url: '/topic/nobody',
    method: 'get',
    params:data
  })
}