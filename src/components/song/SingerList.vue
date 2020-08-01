<template>
  <div>
    <nav-header></nav-header>
    <!-- 歌单头部信息 -->
    <div class="main-list">
      <div class="list-header">
        <img :src="singerMsg.pic" alt />
        <div class="headerText">
          <div class="headerText1">
            <strong>{{singerMsg.name}}</strong>
            <el-button
              round
              type="info"
              plain
              size="mini"
              v-if="singerMsg.isFollowed"
              @click="conllectionSongs(singerMsg.id,2)"
            >
              <i class="el-icon-folder-checked"></i>
              已收藏
            </el-button>
            <el-button
              size="mini"
              round
              class="tt-conlection"
              @click="conllectionSongs(singerMsg.id,1)"
              v-else
            >
              <i class="el-icon-folder-add"></i> 未收藏
            </el-button>
          </div>
          <div class="headerText2">{{singerMsg.time}}</div>
          <div class="headerText4">
            <span>描述: {{singerMsg.description}}</span>
          </div>

          <div class="headerText5">
            <el-button
              type="danger"
              icon="el-icon-video-play"
              @click="playMusicAtonce(singerSongList)"
            >立即播放</el-button>
          </div>
        </div>
      </div>

      <!-- 歌单列表 -->
      <el-table :data="singerSongList" style="width: 100%" stripe @row-click="getMusicUrl">
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
      // 传过来的歌手id
      urlId: 0,
      //   歌手信息
      singerMsg: {},
      //   歌手最热50首
      singerSongList: [],
      //   isFollowed: false,
    };
  },
  components: {
    "nav-header": NavHeader,
  },
  created() {
    // 获取传入歌手id
  let str = this.$route.path.substr(1);
    let index = str.indexOf("/")
    this.urlId = this.$route.path.substr(index+2)
    // 获取歌手详细信息
    this.getSingerSong();
  },
  mounted() {},
  methods: {
    // 获取歌手详细信息（简介和歌曲）
    async getSingerSong() {
      const { data: res } = await this.$request.get(
        `/artists?id=${this.urlId}`
      );
      console.log(res);

      // 歌手信息
      let singerSongMsg = {
        id: res.artist.id,
        pic: res.artist.picUrl,
        name: res.artist.name,
        description: res.artist.briefDesc,
        isFollowed: res.artist.followed,
        time: res.artist.publishTime,
      };
      this.singerMsg = singerSongMsg;

      // 音乐列表
      res.hotSongs.forEach((item) => {
        var arr = [];
        item.ar.forEach((i) => {
          arr.push(i.name);
        });
        item.author = arr.join(" ");
        item.album = item.al.name;
        item.time = this.timeFormat(item.dt);
      });
      this.singerSongList = res.hotSongs;
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
    //   点击收藏
    async conllectionSongs(id, status) {
      try {
        await this.$request.get(`artist/sub?id=${id}&t=${status}`);
        if (status == 1) {
          this.$message.success("已添加收藏");
          this.singerMsg.isFollowed = true;
        } else {
          this.singerMsg.isFollowed = false;
          this.$message.success("已取消收藏");
        }
      } catch (error) {
        this.$message.error("请先登录");
      }
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
        font-size: 16px;
      }
      .headerText2 {
        font-size: 12px;
        margin-top: 5px;
      }
      .headerText2 span {
        color: rgb(65, 107, 200);
        font-size: 12px;
        margin-right: 5px;
      }
      .headerText3 {
        margin-top: 5px;
      }
      .headerText4 {
        margin-top: 5px;

        span {
          white-space: nowrap;
          text-overflow: ellipsis;
        }
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