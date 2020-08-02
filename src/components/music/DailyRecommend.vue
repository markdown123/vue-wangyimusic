<template>
  <div>
    <nav-header></nav-header> 
    <div class="main-list"> 
        <!-- 歌单头部信息 -->
      <div class="list-header">
        <img
          src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3167851396,2438977824&fm=26&gp=0.jpg"
          alt
        />
        <div class="headerText">
          <div class="headerText1">
            <strong>每日推荐歌曲</strong>
          </div>
          <div class="headerText2">根据你的音乐口味自动生成，每天更新</div>

          <div class="headerText5">
            <el-button
              type="danger"
              icon="el-icon-video-play"
              @click="playMusicAtonce(singerSongList)"
            >立即播放</el-button>
          </div>
        </div>
      </div>

      <!-- 每日推荐歌曲列表 -->
      <el-table :data="songList" style="width: 100%" stripe @row-click="getMusicUrl">
        <el-table-column type="index" width="70"></el-table-column>
        <el-table-column prop="name" label="音乐标题" width="180"></el-table-column>
        <el-table-column prop="author" label="歌手" width="180"></el-table-column>
        <el-table-column prop="album" label="专辑" width="180"></el-table-column>
        <el-table-column prop="time" label="时长" width="180"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import NavHeader from "../common/Navheader.vue";
export default {
  data() {
    return {
        // 每日推荐歌曲 
        songList: [],
    };
  },
  components: {
    "nav-header": NavHeader,
  },
  created() {},
  async mounted() {
    try {
      const time = new Date().getTime();
      await this.$request.get(`login/status?timestamp=${time}`);
      this.getRecommendList();
    } catch (error) {
      this.$message.error("该功能需要先登录,请先登录");
    }
  },
  methods: {
    //   获得每日推荐歌曲
    async getRecommendList() {
      const { data: res } = await this.$request.get(`/recommend/songs`);
      console.log(res);
    //   处理歌曲数据，准备渲染数据
       res.data.dailySongs.forEach((item) => {
        var arr = [];
        item.ar.forEach((i) => {
          arr.push(i.name);
        });
        item.author = arr.join(" ");
        item.album = item.al.name;
        item.time = this.timeFormat(item.dt);
      });
      this.songList = res.data.dailySongs
    },
    // 格式化时长
    timeFormat(time) {
      let m = parseInt((time - 0) / 60000);

      m = m >= 10 ? m : "0" + m;
      let s = parseInt(((time - 0) % 60000) / 1000);
      s = s >= 10 ? s : "0" + s;
      return `${m}:${s}`;
    },
     // 获得歌曲地址
    async getMusicUrl(obj) {
      console.log(obj);
      const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`);

      console.log(res);

      let music = {
        title: obj.name,
        artist: obj.author,
        src: res.data[0].url,
        pic: obj.al.picUrl,
        id: obj.id,
      };
      window.sessionStorage.setItem("nowMusic", JSON.stringify(music));
      this.$store.dispatch("dealAutoPlay", music);
    },
  },
};
</script>

<style lang="less" scoped>
.main-list {
  width: 100%;
  height: 434px;
  overflow: hidden;
  overflow-y: scroll;

  .list-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 160px;
    //   background-color: pink;

    img {
      width: 130px;
      height: 130px;
      margin: 0 0 0 30px;
      border-radius: 10px;
    }
    .headerText {
      margin-left: 30px;
      font-size: 12px;

      .headerText1 .el-button {
        margin-left: 10px;
      }

      .headerText1 span {
        font-size: 12px;
        color: red;
        border: 2px solid red;
        border-radius: 4px;
        padding: 2px 10px;
        margin-right: 10px;
      }
      .headerText1 strong {
        font-size: 18px;
        padding: 10px 0;
      }
      .headerText2 {
        font-size: 16px;
        margin: 20px 0;
      }
      .headerText2 span {
        color: rgb(65, 107, 200);
        font-size: 12px;
        margin-right: 5px;
      }

      .headerText5 {
        margin-top: 7px;

        .el-button {
          border-radius: 20px;
          padding: 8px 20px;
        }
      }
    }
  }

  .el-table {
    cursor: pointer;
  }
}
</style>