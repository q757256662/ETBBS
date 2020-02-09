import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */


function fliterRouter(asyncRouterMap, menu) {
  // console.log(asyncRouterMap)
  const accessedRouters = asyncRouterMap.filter(v => {
    if (v.children && v.children.length != 0) {
      v.children = fliterRouter(v.children, menu)
      return true
    }
    // console
    // console.log(v.meta.role.includes(menu))
    if (v.meta && v.meta.role.includes(menu)) {
      return true
    } else {
      if (v.path == "*") {
        return true
      }
      return false
    }
  })
  return accessedRouters
}


function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    // console.log(asyncRoutes)
    // console.log(constantRoutes)
    return new Promise(resolve => {
      let accessedRoutes
      if (roles==1) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = fliterRouter(asyncRoutes, roles)
      }
      // console.log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
