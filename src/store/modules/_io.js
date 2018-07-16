import Io from "../../../electron/lib/io";
const state = {};
const mutations = {};
const actions = {
  async exportFile({ dispatch }, { type, title, mk, html }) {
    let r = await Io.export({ type, title, mk, html });
    if (r.code === 1) {
      dispatch("setMessage", {
        type: "success",
        message: "文章导出成功"
      });
    }
  },
  async importFile({ dispatch }) {
    let post = await Io.importFile();
    dispatch("importPost", post.data);
    return post.data;
  }
};
export default {
  state,
  mutations,
  actions
};
