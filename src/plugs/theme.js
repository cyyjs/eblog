import theme from "muse-ui/lib/theme";
let list = [
  { name: "green", color: "#2e7d32" },
  { name: "cyan", color: "#006064" },
  { name: "blue", color: "#01579b" },
  { name: "indigo", color: "#3f51b5" },
  { name: "pink", color: "#880e4f" },
  { name: "purple", color: "#6a1b9a" },
  { name: "brown", color: "#795548" },
  { name: "grey", color: "#607d8b" }
];
list.forEach(i => {
  theme.add(
    i.name,
    { primary: i.color, text: { secondary: i.color } },
    "light"
  );
});
// 主题样式扩展
theme.addCreateTheme(theme => {
  return `
  .mu-item-action>.mu-secondary-text-color,
  .mu-option.is-selected .mu-item,
  .mu-checkbox-checked,
  .mu-input__focus,
  .mu-form-item__focus {
    color: ${theme.primary};
  }
  .mu-primary-boder{
      border:1px solid ${theme.primary};
      border-radius:3px;
  }
  .mu-chip.mu-primary-color,
  #editor .add-image-link-wrapper .add-image-link .op-btn.sure{
      background:${theme.primary};
  }
  .mu-circle-spinner{
    border-color:${theme.primary};
  }
  `;
});

function install(Vue) {
  Vue.prototype.$themeList = list;
  Vue.prototype.$theme = theme;
}
export default { install };
