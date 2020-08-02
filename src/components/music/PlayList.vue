<template>
  <div>
    <nav-header></nav-header>
    <!-- 歌单头部信息 -->
    <div class="main-list">
      <div class="list-header">
        <img :src="playListDetail.pic" alt />
        <div class="headerText">
          <div class="headerText1">
            <span>歌单</span>
            <strong>{{playListDetail.name}}</strong>
          </div>
          <div class="headerText2">
            <span>{{playListDetail.author}}</span>
            {{playListDetail.time| dataFormat}}
          </div>
          <div class="headerText3">
            <span>标签: {{playListDetail.tags}}</span>
          </div>
          <div class="headerText4">
            <span>描述: {{playListDetail.description}}</span>
          </div>

          <div class="headerText5">
            <el-button type="danger" icon="el-icon-video-play"
            @click="playNow(playTableData)">立即播放</el-button>
          </div>
        </div>
      </div>

      <!-- 歌单列表 -->
      <el-table :data="playTableData" style="width: 100%" stripe @row-click="getMusicUrl">
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
      // 歌单相关的信息
      playListDetail: {},
      // 歌单表格数据
      playTableData: [],
    };
  },
  created() {
    this.getPlayList();
  },
  methods: {
    // 获得歌单详情
    async getPlayList() {
      // 从本地拿到选中的歌单id
      const id = window.sessionStorage.getItem("playListId", id);
      const { data: res } = await this.$request.get(`playlist/detail?id=${id}`);
      console.log(res);
      //   歌单相关信息
      const playListMsgData = {
        pic: res.playlist.coverImgUrl,
        name: res.playlist.name,
        description: res.playlist.description,
        tags: res.playlist.tags.join(' '),
        author: res.playlist.creator.nickname,
        time: res.playlist.updateTime,
      };
      this.playListDetail = playListMsgData;
      //   歌单列表数据
      res.playlist.tracks.forEach((item) => {
        //   将演唱这首歌的歌手的名字放入一个数组
        let arr = [];
        item.ar.forEach((i) => {
          arr.push(i.name);
        });
        item.author = arr;

        item.album = item.al.name;
        item.time = this.timeFormat(item.dt);
      });

      this.playTableData = res.playlist.tracks;
    },

    // 格式化时长
    timeFormat(time) {
      let m = parseInt((time - 0) / 60000);

      m = m >= 10 ? m : "0" + m;
      let s = parseInt(((time - 0) % 60000) / 1000);
      s = s >= 10 ? s : "0" + s;
      return `${m}:${s}`;
    },
    // 点击某行，获取音乐地址
    async getMusicUrl(obj) {
      console.log(obj);
      const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`);

      console.log(res);

      let music = {
        title: obj.name,
        artist: obj.author.join(" "),
        src: res.data[0].url,
        pic: obj.al.picUrl,
        id: obj.id,
      };
      window.sessionStorage.setItem("nowMusic", JSON.stringify(music));
      this.$store.dispatch("dealAutoPlay", music);
    },
    // 立即播放歌单
    async playNow(obj1) {
      console.log(obj1);
      obj1.forEach(async item => {
        const { data: res } = await this.$request.get(`/song/url?id=${item.id}`);
      console.log(res);
      let music = {
        title: obj.name,
        artist: obj.author.join(" "),
        src: res.data[0].url,
        pic: obj.al.picUrl,
        id: obj.id,
      };
      window.sessionStorage.setItem("nowMusic", JSON.stringify(music));
      this.$store.dispatch("dealAutoPlay", music);
 
      })
       
    }
    
  },
  components: {
    "nav-header": NavHeader,
  },
  // 监听vuex 当前歌单id数据变化 进行列表刷新
  watch: {
    "$store.state.thisPlaylistId": function (newFlag, oldFlag) {
      if (newFlag !== oldFlag) {
        this.getPlayList();
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