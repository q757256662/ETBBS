import request from '@/utils/request'

/**查看已有公司名 */
export function getallcompanyNames() {
    return request({
        url: '/systemmanage/getallcompanyNames',
        method: 'get',
    })
}

/**查看已有关键字 */
export function getallkeyNames() {
    return request({
        url: '/systemmanage/getallkeyNames',
        method: 'get',
    })
}

/**查看所有人员信息 */
export function getallusers() {
    return request({
        url: '/systemmanage/getallusers',
        method: 'get',
    })
}

/**新增公司名称 */
export function newcompany(data) {
    return request({
        url: '/systemmanage/newcompany',
        method: 'post',
        data
    })
}

/**添加用户 */
export function addUser(data) {
    return request({
        url: '/systemmanage/addUser',
        method: 'post',
        data
    })
}

/**身份验证 */
export function authentication(data) {
    return request({
        url: '/systemmanage/authentication',
        method: 'post',
        data
    })
}

/**添加关键词 */
export function addkeyname(data) {
    return request({
        url: '/systemmanage/addkeyname',
        method: 'post',
        data
    })
}

/**添加关键词 */
export function deletetimesolttopic(data) {
    return request({
        url: '/systemmanage/deletetimesolttopic',
        method: 'post',
        data
    })
}

/**设置用户权限 */
export function setUserpower(data) {
    return request({
        url: '/systemmanage/setUserpower',
        method: 'post',
        data
    })
}

/**查看用户权限 */
export function getscore(data) {
    return request({
        url: '/systemmanage/getscore',
        method: 'get',
        data
    })
}

/**查看用户权限 */
export function updateuser(data) {
    return request({
        url: '/systemmanage/updateuser',
        method: 'Put',
        data
    })
}
