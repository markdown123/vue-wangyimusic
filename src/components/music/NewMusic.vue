<template>
  <div class="main">
    <div>最新音乐</div>
    <div class="new-music">
      <el-row :gutter="24">
        <el-col :span="12" v-for="(item,i) in newSongs" :key="i">
          <el-card shadow="hover">
            <div class="new-item" @click="getMusicUrl(item)">
              <img :src="item.picUrl" alt @click="getMusicUrl(item)" />
              <span class="order">{{i+1}}</span>
              <div class="musicMsg">
                <span>{{item.name}}</span> 
                <span class="author">{{item.authour}}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newSongs: [],
    };
  },
  created() {
    this.getNewMusic();
  },
  methods: {
    // 获取最新歌曲数据
    async getNewMusic() {
      const { data: res } = await this.$request.get("personalized/newsong");
      console.log(res);
      res.result.forEach((item) => {
        item.song.artists.forEach(i => {
            item.authour = i.name
        })
      });
      this.newSongs = res.result;
    },
    // 获得点击歌曲的地址
    async getMusicUrl(obj){
        console.log(obj);
      const { data: res } = await this.$request.get(`/song/url?id=${obj.id}`);

      console.log(res);

      let music = {
        title: obj.name,
        artist: obj.authour,
        src: res.data[0].url,
        pic: obj.picUrl,
        id: obj.id,
      };
      window.sessionStorage.setItem("nowMusic", JSON.stringify(music));
      this.$store.dispatch("dealAutoPlay", music);
  
    }
  },
};
</script>

<style lang="less" scoped>
.main {
  margin-bottom: 30px;

  .el-col {
      margin-bottom: 10px;
  }

  .el-card:hover {
       background-color: #ededed;
          cursor: pointer;
  }

  .new-item {
    display: flex;
    align-items: center;
    margin-left: 10px;
    padding: 10px 0;

    .order {
      width: 30px;
      text-align: center;
      color: rgba(0,0,0,.5);
      font-size: 14px;
    }

    .musicMsg {
      
      padding-left: 6px;
      color: #000;
      opacity: 0.7;
      font-size: 14px;
      height: 60px;
      line-height: 35px;
      max-width: 180px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      .author {
          display: block;
      }
    }
  }
  .newMusic img {
    width: 70px;
    height: 70px;
  }
}
</style>