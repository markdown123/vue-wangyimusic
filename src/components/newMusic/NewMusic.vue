<template>
  <div>
    <div class="header">
      <ul>
        <li v-for="(item,i) in typeList" :key="i" 
        @click="selectType(item.type,i) "
        :class="selectIndex === i ? 'select': ''">{{item.name}}</li>
      </ul>
       <el-button type="danger" size="mini">立即播放</el-button>
      </div>

        <!-- 最新歌曲表格 -->
      <el-table :data="musicLists" style="width: 100%"
      :show-header="false"
      stripe
      @row-click="getMusicUrl">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column width="250">
            <template slot-scope="scope">
                <img :src="scope.row.pic" alt="">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="author"  width="200"></el-table-column>
        <el-table-column prop="time" width="200"></el-table-column>
      </el-table>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
        selectIndex: 0,
      // 最新歌曲分类
      typeList: [
        { name: "全部", type: 0 },
        { name: "华语", type: 7 },
        { name: "欧美", type: 96 },
        { name: "日本", type: 8 },
        { name: "韩国", type: 16 },
      ],
      queryInfo: {
        type: 0,
      },
      // 最新歌曲数据
      musicLists: [],
    };
  },
  created() {
    this.getNewSongs();
  },
  methods: {
    // 获取最新歌曲数据
    async getNewSongs() {
        this.musicLists = []
      const { data: res } = await this.$request.get(
        `/top/song?type=${this.queryInfo.type}`
      );
      
      res.data.slice(0,30).forEach(item =>{
          const obj = {}
          obj.author = []
          obj.id = item.id
          obj.name = item.name
          obj.pic = item.album.picUrl
          item.artists.forEach(i =>{
            obj.author.push(i.name)
          })
          obj.author = obj.author.join('/')
          obj.time = this.timeFormat(item.duration)
          this.musicLists.push(obj)
      })
    },
     // 格式化时长
    timeFormat(time) {
      let m = parseInt((time - 0) / 60000);

      m = m >= 10 ? m : "0" + m;
      let s = parseInt(((time - 0) % 60000) / 1000);
      s = s >= 10 ? s : "0" + s;
      return `${m}:${s}`;
    },
    selectType(type,i) {
        this.selectIndex = i
      console.log(type);
      this.queryInfo.type = type;
      this.getNewSongs();
    },
    async getMusicUrl(obj) {
      const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`);

      console.log(res);

      let music = {
        title: obj.name,
        artist: obj.author,
        src: res.data[0].url,
        pic: obj.pic,
        id: obj.id,
      };
      window.sessionStorage.setItem("nowMusic", JSON.stringify(music));
      this.$store.dispatch("dealAutoPlay", music);
    },
  },
};
</script>

<style lang="less" scoped>
.header {
    position: relative;
  padding-left: 30px;

  .el-button {
    position: absolute;
    right: 60px;
    border-radius: 15px;
}
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
ul li {
  float: left;
  padding: 2px 10px;
  opacity: 0.8;
}

li:hover {
  opacity: 1;
  cursor: pointer;
}

.select {
    
    border-radius: 15px;
    color: red;
}

.el-table {
    overflow: hidden scroll;
    height: 300px;
}

.el-table-pane {
    overflow: hidden;
}

.el-table img {
    float: left;
    width: 50px;
    height: 50px;
}
.el-table span {
    display: block;
    float: left;
    padding-left: 10px;
    line-height: 60px;
    white-space: wrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>