import request from '@/utils/request'

export function login(Name, Pwd) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      Name,
      Pwd
    }
  })
}

export function getInfo() {
  return request({
    url: '/user/person',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**获取二维码 */
export function getQcode(){
  return request({
    url: '/User/getQcode',
    method: 'get'
  })
}


/**验证二维码 */
export function validateCode(data){
  return request({
    url: '/User/validateCode',
    method: 'post',
    data
  })
}

/**查询二维码 */
export function scanQCode(data){
  return request({
    url: '/User/qcodelogin',
    method: 'post',
    data
  })
}

/**查询二维码 */
export function forgetpwd(params){
  return request({
    url: '/User/forgetpwd',
    method: 'get',
    params
  })
}