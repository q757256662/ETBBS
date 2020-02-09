import Cookies from 'js-cookie'

const app = {
  state: {
    device: 'desktop',
    background:""
  },
  mutations: {
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_BACKGROUND:(state,background)=>{
      state.background = background
    }
  },
  actions: {
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    SetBackground({ commit }, background){
      commit('SET_BACKGROUND',background)
    }
  }
}

export default app
