<template>
  <div class="main">
    <div class="header">
      <ul>
        <li v-for="(item,i) in area" :key="i"
        :class="selectIndex === i ? 'select': ''"
        @click="selectChange(i,item)">{{item.name}}</li>
      </ul>
    </div>
    <div class="box">
      <el-row >
        <el-col :span="6" v-for="(item,i) in newDisc" :key="i">
          <img :src="item.pic" alt @click="linkSongsDisc(item.id)" />
          <div @click="linkSongsDisc(item.id)">{{item.name}}</div>
          <div @click="linkSingerSongs(item.authorId[0])">{{item.author}}</div>
        </el-col>
      </el-row>

      <div class="main-page">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="(queryInfo.offset/queryInfo.limit) + 1"
                  
          :page-size="8"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectIndex: 0,
      queryInfo: {
        type: 0,
        offset: 0,
        limit: 30,
        area: "ALL",
      },
      area: [
        {name: '全部',value: 'ALL'},
        {name: '华语',value: 'ZH'},
        {name: '欧美',value: 'EA'},
        {name: '韩国',value: 'KR'},
        {name: '日本',value: 'JP'},
      ],
      total: 0,
      //   月新碟数据
      newDisc: [],
    };
  },
  created() {
    this.getDisc();
  },
  methods: {
    // 获得新碟数据
    async getDisc() {
        this.newDisc = []
      const { data: res } = await this.$request.get(`/album/new`,{
        params: this.queryInfo
      });
      console.log(res);
      res.albums.forEach((item) => {
        const obj = {};
        obj.name = item.name;
        obj.id = item.id;
        obj.pic = item.picUrl;
        obj.author = [];
        obj.authorId = [];
        item.artists.forEach((i) => {
          obj.author.push(i.name);
          obj.authorId.push(i.id);
        });
        obj.author = obj.author.join(" ");
        this.newDisc.push(obj);
      });
      this.total = this.newDisc.length
      console.log(this.newDisc);
    },
      // 切换选择地区
    selectChange(i,item) {
      this.selectIndex = i
      this.queryInfo.area = item.value
      this.getDisc()
    },

    handleCurrentChange(page) {
        console.log(page);
        this.queryInfo.offset = (page-1) * this.queryInfo.limit
        this.queryInfo.limit = 8
        this.getDisc()
    },
  
    // 跳转到歌手歌单
    linkSingerSongs(id) {
      this.$router.push(`/singerlist/${id}`);
    },
    // 跳转到专辑歌单
    linkSongsDisc(id) {
      window.sessionStorage.setItem("playListId", id);
      this.$router.push(`/playlist`);
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  margin: 0 30px;
}
.select {
  color: red;
}
ul {
  margin: 0;
  margin-bottom: 20px;
  padding: 0;
  list-style: none;
  overflow: hidden;
}
ul li {
  float: left;
  padding: 0 20px;
  cursor: pointer;
}
.box {
  position: relative;
  margin: 0 30px;

  // .el-row {
  //   position: absolute;
  //   top: 50px;
  //   overflow: hidden;
  // }

  .el-col {
    margin-bottom: 30px;
    margin-right: 20px;
    width: 160px;
  }
  img {
    width: 158px;
    height: 158px;
    border-radius: 10px;
  }

  div {
    font-size: 13px;
    line-height: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
  }
}
.main {
  position: relative;
}
.main-page {
  position: absolute;
  
}
</style>