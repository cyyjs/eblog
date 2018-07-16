let setting = {};
try {
  let s = localStorage.getItem("setting");
  setting = JSON.parse(s);
  if (!setting) {
    setting = { theme: "green", codeStyle: "vs2015" };
  }
} catch (e) {
  setting = { theme: "green", codeStyle: "vs2015" };
}
const state = {
  message: {},
  viewType: +localStorage.getItem("viewType") || 1, // 视图类型1卡片，2摘要
  loading: false,
  setting
};

const mutations = {
  SET_MESSAGE(state, data) {
    state.message = data;
  },
  SET_LOADING(state, data) {
    state.loading = data;
  },
  SET_VIEW_TYPE(state, data) {
    state.viewType = data;
    localStorage.setItem("viewType", data);
  },
  SET_SETTING(state, setting) {
    state.setting = setting;
    localStorage.setItem("setting", JSON.stringify(setting));
  }
};

const actions = {
  // 保存上传图片
  setMessage({ commit }, { type, message }) {
    commit("SET_MESSAGE", {
      type,
      message,
      date: Date.now()
    });
  },
  setViewType({ commit }, t) {
    commit("SET_VIEW_TYPE", t);
  },
  setLoading({ commit }, data) {
    commit("SET_LOADING", data);
  },
  setSetting({ commit }, data) {
    commit("SET_SETTING", data);
  }
};

export default {
  state,
  mutations,
  actions
};
