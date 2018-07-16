import Vue from "vue";
import Router from "vue-router";
import PostList from "./views/post/list.vue";
import Post from "./views/post/form.vue";
import TypeList from "./views/post/type.vue";
import TagsList from "./views/post/tags.vue";
import TrashList from "./views/post/trash.vue";
import About from "./views/About.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "list",
      component: PostList
    },
    {
      path: "/post",
      name: "post",
      component: Post
    },
    {
      path: "/post/:id",
      name: "postid",
      component: Post
    },
    {
      path: "/types",
      name: "types",
      component: TypeList
    },
    {
      path: "/tags",
      name: "tags",
      component: TagsList
    },
    {
      path: "/trash",
      name: "trash",
      component: TrashList
    },
    {
      path: "/about",
      name: "about",
      component: About
    }
  ]
});
