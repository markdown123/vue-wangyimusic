<template>
  <div>
      <!-- 头部区 -->
    <div class="header">
      <div class="header-select">
        <span :class="selectIndex === i ? 'select': ''" 
        v-for="(item,i) in headerSelect" :key="i"
        @click="selectchange(i)"
        >{{item}}</span>
      </div>
    </div>
    <!-- 列表区 -->
    <div :is="Components"></div>
  </div>
</template>

<script>
import first from "./NewMusic.vue";
import second from "./NewDisc.vue";
export default {
  data() {
    return {
        headerSelect: ['新歌速递', '新碟上架'],
      // 最新歌曲页面的选中状态
      selectIndex: this.$store.state.newMusicStatus ? 0 : 1,
    //   选中对应的内容
      Components: this.$store.state.newMusicStatus ? first : second,
    };
  },
  created() {},
  methods: {
    // 切换按钮
    selectchange(i) {
        this.selectIndex = i
        if(i == 1) {
            this.Components = second
            this.$store.commit('changeNewMusicStatus', false)
        } else {
            this.Components = first
            this.$store.commit('changeNewMusicStatus', true)
        }
    }
  },
};
</script>

<style lang="less" scoped>
.header {
  position: relative;
  width: 100%;
  height: 50px;

  .header-select {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 186px;
    height: 28px;
    background-color: #fff;
    border-radius: 100px;
    border: 1px solid #ccc;

    span {
      display: block;
      float: left;
      width: 50%;
      height: 100%;
      line-height: 28px;
      text-align: center;
      border-radius: 100px;
      cursor: pointer;
    }

    .select {
      background-color: #bebebe;
    }
  }
}
</style>