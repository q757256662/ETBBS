//获取图标数据
import request from '@/utils/request'
//帖子总数
export function GetTopicCount(data) {
    return request({
      url: '/Statis/TopicStatustics', 
      method: 'get',
      params:data
    })
  }
//发帖子
  export function GetPostCount(data) {
    return request({
      url: '/Statis/PostTopicStatis', 
      method: 'get',
      params:data
    })
  }
//回帖子总数
  export function GetReplyCount(data) {
    return request({
      url: '/Statis/ReplyTopicStatic', 
      method: 'get',
      params:data
    })
  }
//人均回帖
  export function GetAverageCount(data) {
    return request({
      url: '/Statis/AveragePople', 
      method: 'get',
      params:data
    })
  }


//为结帖统计
export function GetFinishCount(data) {
  return request({
    url: '/Statis/nofinish', 
    method: 'get',
    params:data
  })
}

//折线图统计
export function GetreplyLine() {
  return request({
    url: '/Statis/replyLine', 
    method: 'get',
  })
}