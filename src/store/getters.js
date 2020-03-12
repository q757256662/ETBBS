const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userinfo:state => state.user.userinfo,
  currentState:state =>state.user.currentState,
  menu:state=>state.permission.routes,
  background:state =>state.app.background,
  tagArr:state =>state.user.tagArr
}
export default getters
