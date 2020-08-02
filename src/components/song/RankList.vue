<template>
  <div>
    <div class="header">排行榜</div>
    <div class="boxline" v-for="(item,i) in rankListData" :key="i">
      <div class="left-box">
        <img :src="item.img" alt />

        <!-- 排行榜列表 -->
        <div class="right">
          <el-table :data="item.musiclist" 
          stripe
          :show-header="false"
          size="mini"  @row-click="getMusicUrl">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="name" width="300"></el-table-column>
            <el-table-column prop="author" width="180"></el-table-column>
          </el-table>
          <div class="more" @click="toList(item.id)">查看更多
              <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rankListData: [],
    };
  },
  created() {
    this.getRankList();
  },
  methods: {
    async getRankList() {
      // const {data: res} = await this.$request.get(`/playlist/catlist`)
      const { data: res1 } = await this.$request.get(`top/list?id=${19723756}`);
      const { data: res2 } = await this.$request.get(`top/list?id=${3779629}`);
      const { data: res3 } = await this.$request.get(`top/list?id=${2884035}`);
      const { data: res4 } = await this.$request.get(`top/list?id=${3778678}`);
      const { data: res5 } = await this.$request.get(
        `top/list?id=${991319590}`
      );

      console.log(res1.playlist);
      console.log(res2.playlist);
      console.log(res1.playlist);

      this.dealRankMsg(res1.playlist);
      this.dealRankMsg(res2.playlist);
      this.dealRankMsg(res3.playlist);
      this.dealRankMsg(res4.playlist);
      this.dealRankMsg(res5.playlist);
    //   console.log(this.rankListData);
    },
    // 处理获得的排行榜数据
    dealRankMsg(item) {
      const obj = {};
      obj.name = item.name;
      obj.id = item.id;
      obj.img = item.coverImgUrl;
      obj.musiclist = [];
      item.tracks.slice(0, 5).forEach((item) => {
        const mobj = {};
        mobj.name = item.name;
        mobj.id = item.id;
        mobj.pic = item.al.picUrl;
        mobj.author = "";
        item.ar.forEach((i) => {
          mobj.author += i.name + " ";
        });
        obj.musiclist.push(mobj);
      });
      obj.time = item.updateTime;
      this.rankListData.push(obj);
      // console.log(obj.musicList);
    },
    // 获取歌曲地址
    async getMusicUrl(obj) {
      const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`)
      let music = {}
      music = {
        title: obj.name,
        artist: obj.author,
        src: res.data[0].url,
        pic: obj.pic,
        id: obj.id
      }
      window.sessionStorage.setItem('nowMusic', JSON.stringify(music))
      this.$store.dispatch('dealAutoPlay', music)
    },
    // 跳转到该歌单
    toList(id) {
        window.sessionStorage.setItem('playListId',id)
        this.$router.push('/playlist')
    }
  },
};
</script>

<style lang="less" scoped>
.header {
  width: 800px;
  margin: 5px 20px;
  font-weight: 700;
  font-size: 16px;
}

.boxline {
    display: flex;
    position: relative;
    margin-bottom: 20px;

.left-box {
    
  width: 140px;
  height: 140px;
  margin: 0 30px 30px 30px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
}

.right {
    // flex: 1;
    position: absolute;
    right: 50px;
    top: 0;
}

.more {
    height: 16px;
    width: 100px;
    line-height: 16px;
    font-size: 12px;
    margin: 5px 0 10px;
    color: rgba(0, 0, 0, .6);
    cursor: pointer;
}
}

</style>