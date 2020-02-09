import request from '@/utils/request'

/**获取列表 */
export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

/**初始化信息 */
export function getAboutMessage(params) {
  return request({
    url: '/AboutMessage/loadPostdata',
    method: 'get',
    params
  })
}

//检查手机号接口
export function checkTel(obj) {
  return request({
    url: '/AboutMessage/checkphone',
    method: 'post',
    data: obj
  })
}


//发帖子
export function submitTopic(obj) {
  return request({
    url: '/AboutMessage/userpostmessage',
    method: 'post',
    data: obj
  })
}

//获取oss参数


export function getOssMes(params) {
  return request({
    url: '/AboutMessage/getOSSpara',
    method: 'get',
    params
  })
}


//客户发帖
export function customerUserpostmessage(data) {
  return request({
    url: '/AboutMessage/customerUserpostmessage',
    method: 'post',
    data
  })
}