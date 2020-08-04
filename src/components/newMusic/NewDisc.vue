<template>
  <div>
    <div class="header">全部专辑</div>
    <div class="box">
      <el-row>
        <el-col :span="6" v-for="(item,i) in newDisc" :key="i">
          <img :src="item.pic" alt @click="linkSongsDisc(item.id)" />
          <div @click="linkSongsDisc(item.id)">{{item.name}}</div>
          <div @click="linkSingerSongs(item.authorId[0])">{{item.author}}</div>
        </el-col>
      </el-row>

      <div class="main-page">
        <el-pagination
            @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="(queryInfo.offset/queryInfo.limit) + 1"
          :page-sizes="[8,16,24]"         
          :page-size="queryInfo.limit"
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
      queryInfo: {
        type: 0,
        offset: 0,
        limit: 8,
      },
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
      const { data: res } = await this.$request.get(`/top/album?
      offset=${this.queryInfo.offset}&limit=${this.queryInfo.limit}`);
      console.log(res);
      res.monthData.forEach((item) => {
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
    handleSizeChange(size) {
        this.queryInfo.limit = size
        this.getDisc()
    },
    handleCurrentChange(page) {
        console.log(page);
        this.queryInfo.offset = (page-1) * this.queryInfo.limit
        
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
.box {
  margin: 0 30px;

  .el-col {
    margin-bottom: 30px;
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
</style>