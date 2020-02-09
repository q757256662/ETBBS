import request from '@/utils/request'

//获取新帖子
export function GetNewTopic(data) {
    return request({
      url: '/Topic/GetNewTopic',
      method: 'get',
      params:data
    })
  }

//删除帖子
export function DeleteTopic(data) {
  return request({
    url: '/Topic/DeleteTopic',
    method: 'post',
    data
  })
}

//钉一下
export function MarkTopic(params){
  return request({
    url: '/Topic/MarkTopic',
    method: 'get',
    params
  })
}

/**让它从我眼前消失 */
export function Disappera(data){
  return request({
    url: '/Topic/disappera',
    method: 'post',
    data
  })
}

/**解决 */
export function Solveday(data){
  return request({
    url: '/AboutMessage/solveday',
    method: 'post',
    data
  })
}

/**回复帖子 */
export function ReplyMessage(data){
  return request({
    url: '/AboutMessage/replyMessage',
    method: 'post',
    data
  })
}


/**草稿贴 */
export function draftTopic(data){
  return request({
    url: '/Topic/draftTopic',
    method: 'get',
    data
  })
}

/**获取最近公告贴数量 */
export function getNewpublic(params){
  return request({
    url: '/Topic/getNewpublic',
    method: 'get',
    params
  })
}


/**取消帖子提醒 */
export function cancleRemind(data){
  return request({
    url: '/Topic/cancleRemind',
    method: 'put',
    data
  })
}


/**关注帖子/我要加入 */
export function join(data){
  return request({
    url: '/Topic/join',
    method: 'post',
    data
  })
}

/**退出关注 */
export function cancleAttention(data){
  return request({
    url: '/Topic/cancleAttention',
    method: 'post',
    data
  })
}