<template>
  <div>
    <nav-header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个性推荐" name="first">
          <person-recommend></person-recommend>
        </el-tab-pane>
        <el-tab-pane label="排行榜" name="second">排行榜</el-tab-pane>
        <el-tab-pane label="歌手" name="third">歌手</el-tab-pane>
        <el-tab-pane label="最新歌曲" name="fourth">最新歌曲</el-tab-pane>
      </el-tabs>
    </nav-header>
  </div>
</template>

<script>
import NavHeader from "./common/Navheader.vue";
import Recommend from "./personRecommend/Recommend.vue";
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    "nav-header": NavHeader,
    "person-recommend": Recommend,
  },
  created() {},
  methods: {
    handleClick() {},
  },
};
</script>

<style lang="less" scoped>

</style>