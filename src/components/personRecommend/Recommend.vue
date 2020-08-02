<template>
  
    <div class="box">
      <!-- 轮播图 -->
      <div class="swiper">
        <el-carousel :interval="4000" type="card" height="160px" style="width: 700px">
          <el-carousel-item v-for="(item,i) in swiperData" :key="i">
            <img :src="item.imageUrl" alt @click="getMusicUrl(item.song)" />
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 推荐歌单 -->
      <div class="recommend">
        <recommend-list></recommend-list>
      </div>
      <!-- 最新音乐 -->
      <div class="newMusic">
      <m-newmusic></m-newmusic>
      </div>
    </div>
</template>

<script>
import RecommendList from "../music/RecommendList.vue";
import NewMusic from "../music/NewMusic.vue";

export default {
  data() {
    return {
      swiperData: [],
    };
  },
  components: {
    "recommend-list": RecommendList,
    "m-newmusic": NewMusic,
  },
  created() {
    this.getSwiperData();
  },
  methods: {
    // 获得轮播图数据
    async getSwiperData() {
      const { data: res } = await this.$request.get("/banner");
      this.swiperData = res.banners;
    },
    // 获取音乐播放地址
    async getMusicUrl(obj) {
      if (obj !== null) {
        const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`);
        let music = {};
        music = {
          title: obj.name,
          artist: [],
          src: res.data[0].url,
          pic: obj.al.picUrl,
          id: obj.id,
        };
        obj.ar.forEach((item) => {
          music.artist.push(item.name);
        });
        music.artist = music.artist.join(" ");
        window.sessionStorage.setItem("nowMusic", JSON.stringify(music));
        this.$store.dispatch("dealAutoPlay", music);
      } else {
        this.$message({
          message: "点我没用,我没有数据!!!",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
// .el-carousel__item h3 {
//   color: #475669;
//   font-size: 14px;
//   opacity: 0.75;
//   line-height: 200px;
//   margin: 0;
// }

// .el-carousel__item:nth-child(2n) {
//   background-color: #99a9bf;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }
.box {
  width: 700px;
  margin: 0 40px;


  .swiper {
    height: 190px;
    width: 98%;
    border-radius: 10px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
  }
}
</style>