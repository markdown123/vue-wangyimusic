<template>
  <div>
    <div class="main-header">
      <i class="el-icon-arrow-left"  @click="$router.push(returnLink)"></i>
      <slot></slot>
      <!-- 搜索框 -->
      <div class="search">
        <el-input placeholder="请输入歌曲名"  class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
   props: {
    returnLink: {
      type: String,
      default: '/music',
      required: false
    }
  },
  data() {
    return {

    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.main-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    background-color: #F6F6F6;

    .el-icon-arrow-left {
        position: absolute;
        top: 10px;
        left: 10px;
        cursor: pointer;

    }
    .search {
        position: absolute;
        right: 20px;
        top: 0;
        outline: none;
        
    }
}
</style>