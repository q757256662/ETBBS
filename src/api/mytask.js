import request from '@/utils/request'

export function GetNewTopic(data) {
    return request({
      url: '/Topic/GetNewTopic',
      method: 'get',
      params:data
    })
  }