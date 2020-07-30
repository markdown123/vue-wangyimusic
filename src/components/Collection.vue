<template>
  <div>
    <nav-header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane type="danger" label="歌手" name="first">
          <div class="header">收藏的歌手({{collectCount}})</div>

          <!-- 卡片区，收藏歌手列表 -->
          <div class="card">
            <div class="cardItem" v-for="(item,i) in collectData" 
            :key="i" @click="getSingerSongs(item.id)">
              <img :src="item.img1v1Url" alt />
              <span>{{item.name}}</span>
              <span>专辑:{{item.albumSize}}</span>
              <span>MV:{{item.mvSize}}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频" name="second">
             <div class="cardItem" v-for="(item,i) in collectVideoData" 
            :key="i">
              <img :src="item.coverUrl" alt />
              <span>{{item.title}}</span>
            </div>
          
        </el-tab-pane>
      </el-tabs>
    </nav-header>
  </div>
</template>

<script>
import NavHeader from "./common/Navheader.vue";
export default {
  data() {
    return {
      collectData: [],
      collectCount: 0,
      collectVideoData: [],
      videoCount : 0,
    };
  },
  components: {
    "nav-header": NavHeader,
  },
  created() {
    this.getCollection();
  },
  methods: {
    // 获取收藏数据
    async getCollection() {
      try {
        const time = new Date().getTime();
        await this.$request.get(`login/status?timestamp=${time}`);

        // 获取收藏歌手数据
        const { data: res } = await this.$request.get(
          `/artist/sublist?timestamp=${time}`
        );
        // 获取收藏视频数据
        const { data: res1 } = await this.$request.get(`/mv/sublist`)
        console.log(res);
        console.log(res1);
        this.collectCount = res.count;
        this.collectData = res.data;
        this.videoCount = res1.count
        this.collectVideoData = res1.data
      } catch (error) {}
    },
    // 获取歌手热门歌曲
    async getSingerSongs(id) {
        const {data:res} = await this.$request.get(`/artist/top/song?id=${id}`)
        console.log(res);
    }
  },
};
</script>

<style lang="less" scoped>
.el-tabs {
  float: left;
  padding-left: 40px;

  .header {
    height: 60px;
    width: 100%;
  }
  .card {
    width: 780px;
    background-color: #f6f6f6;

    .cardItem {
      display: flex;
      align-items: center;
      width: 760px;
      margin-bottom: 20px;
      cursor: pointer;
    }
  }
  .cardItem img {
    width: 62px;
    height: 62px;
    margin-right: 20px;
  }

  .card span {
      flex: 1;
      color: rgba(0,0,0,0.5)
  }
}
</style>