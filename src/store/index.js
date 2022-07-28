import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login"
import { getCaptche_ensbled } from "../utils/getLocation"

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
   captche_enabled: false
  },
  mutations: {
  SET_captche_enabled:(state,captche)=>{
    state.captche_enabled = captche
  }
  },
  actions: {},
  getters:{
    captche_enabled:state => state.captche_enabled
  },

});
