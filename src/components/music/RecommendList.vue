<template>
  <div>
    <div class="main-re">
      <div class="header">推荐歌单</div>
      <el-row :gutter="20" class="recommendlist">
        <el-col :span="6">
          <el-card>
            <img
              src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3167851396,2438977824&fm=26&gp=0.jpg"
              alt
              @click="getDailySong()"
            />
            <i class="el-icon-video-play video-play-hover"></i>
          </el-card>
          <div class="recommend-name">
            <span @click="getDailySong()">每日推荐</span>
          </div>
        </el-col>
        <el-col :span="6" v-for="(item,i) in recommendData" :key="i">
          <el-card>
            <img :src="item.picUrl" alt @click="getPlayList(item.id)" />
            <div class="playNum">
              <i class="el-icon-video-play"></i>
              <i>{{item.playCount}}次</i>
            </div>
            <i class="el-icon-video-play video-play-hover"></i>
          </el-card>
          <div class="recommend-name">
            <span @click="getPlayList(item.id)">{{item.name}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recommendData: [],
    };
  },
  created() {
    this.getRecommendData();
  },
  methods: {
    //   获取推荐歌单数据
    async getRecommendData() {
      const { data: res } = await this.$request.get("/personalized?limit=7");
      this.recommendData = res.result;
      console.log(this.recommendData);
    },
    // 获得每日推荐歌曲
    getDailySong() {
      this.$router.push("/dailyrecommend");
    },
    // 跳转到推荐歌单
    getPlayList(id) {
      window.sessionStorage.setItem("playListId", id);
      this.$router.push("/playlist");
    },
  },
};
</script>

<style lang="less" scoped>
.main-re {
  .el-col {
    position: relative;
  }
  .playNum {
    position: absolute;
    top: 0;
    left: 15px;
    color: #fff;
    font-size: 12px;
    opacity: 0.7;
  }
  .video-play-hover {
    position: absolute;
    right: 18px;
    bottom: 120px;
    font-size: 30px;
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .el-card:hover .video-play-hover {
    opacity: 0.5;
  }
  .header {
    margin-bottom: 10px;
  }
  .recommendlist img {
    width: 100%;
    height: 160px;
    border-radius: 8px;
    cursor: pointer;
  }

  .recommend-name {
    height: 80px;
    line-height: 20px;
    padding: 10px 0;
    font-size: 14px;

    span {
      cursor: pointer;
      opacity: 0.6;
    }
  }

  .recommend-name span:hover {
    opacity: 1;
  }
}
</style>