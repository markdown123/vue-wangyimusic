<template>
  <div>
    <nav-header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个性推荐" name="first">
          <person-recommend></person-recommend>
        </el-tab-pane>
        <el-tab-pane label="排行榜" name="second">
          <rank-list></rank-list>
        </el-tab-pane>
        <el-tab-pane label="歌手" name="third" style="overflow: hidden !important">
          <singer></singer>
        </el-tab-pane>
        <el-tab-pane label="最新歌曲" name="fourth">
          <new-music></new-music>
        </el-tab-pane>
      </el-tabs>
    </nav-header>
  </div>
</template>

<script>
import NavHeader from "./common/Navheader.vue";
import Recommend from "./personRecommend/Recommend.vue";
import RankList from "./song/RankList.vue"
import Singer from "./singer/Singer.vue"
import Main from "./newMusic/Main.vue"
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    "nav-header": NavHeader,
    "person-recommend": Recommend,
    "rank-list" : RankList,
    "singer": Singer,
    "new-music": Main,
  },
  created() {},
  methods: {
    handleClick() {},
  },
};
</script>

<style lang="less" scoped>

</style>