import request from '@/utils/request'


/**修改员工信息 */
export function updateUser(data) {
    return request({
        url: '/User/updateUser',
        method: 'put',
        data
    })
}


/**修改员工密码 */
export function updatePwd(data) {
    return request({
        url: '/User/updatePwd',
        method: 'put',
        data
    })
}