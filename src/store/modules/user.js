import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getTag } from "@/api/addtag.js";


const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userinfo:{},
    topicTitle:'',
    currentState:'NewTopic',
    systemManagerAuth:false,
    dot:0,
    tagArr:[]
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERINFO:(state, userInfo)=>{
      state.userinfo = userInfo
    },
    SET_TOPICTITLE:(state,title)=>{
      state.topicTitle = title
    },
    SET_CURRENTSTATE:(state,currentState)=>{
      state.currentState = currentState
    },
    SET_SYSTEMMANAGERAUTH:(state,systemManagerAuth)=>{
      state.systemManagerAuth = systemManagerAuth
    },
    SET_DOT:(state,dot)=>{
      state.dot = dot
    },
    SET_TAGARR:(state,tagArr)=>{
      state.tagArr = tagArr
    }
  },

  actions: {
    //获取TagArr信息
    get_tagArr({ commit },tagArr){
      return new Promise((resolve, reject)=>{
        getTag().then(res => {
          if (res.Success) {
            let dynamicTags = res.Data.Rows;
            commit('SET_TAGARR',dynamicTags)
            resolve(res.Success)
          } else {
            this.$message.warning(res.ErrMes);
            reject(res.ErrMes)
          }
        })
      })
      
    },
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          // console.log(response)
          if(response.Success){
            setToken(response.Token)
            commit('SET_TOKEN', response.Token)
            commit('SET_USERINFO',{...response.Data.info,CompanyName:response.Data.CompanyName,isCustomerUser:response.Data.isCustomerUser})
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response
          if (data.Success) { // 验证返回的roles是否是一个非空数组
            commit('SET_USERINFO', {...data.Data.info,CompanyName:data.Data.CompanyName,isCustomerUser:response.Data.isCustomerUser})
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          resolve(response.Data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
