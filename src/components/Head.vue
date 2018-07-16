<template>
    <div class="top-head drag">
        <div class="title">{{title}}</div>
    </div>
</template>
<script>
export default {
  props: {
    title: String
  }
};
</script>
<style lang="scss" scoped>
.top-head {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 45px;
  z-index: 1;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  .title {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    line-height: 45px;
  }
}
</style>
