<template>
  <div class="box">
    <div class="select-type">
      <ul>
        <li v-for="(item,i) in areaSongs" :key="i"
        :class="i === num1 ? 'select': ''" 
        @click="showSelectData(i,item)">{{item.name}}</li>
      </ul>
      <br />
      <ul>
        <li v-for="(item,i) in typeSongs" :key="i"
        :class="i === num2 ? 'select': ''"
        @click="showSelectData(i,item)">{{item.name}}</li>
      </ul>
      <br />

      <ul>
        <li v-for="(item,i) in screenSongs" :key="i"
        :class="i === num3 ? 'select': ''"
        @click="showSelectData(i,item)">{{item}}</li>
      </ul>
    </div>

    <!-- 歌手榜 -->
    <div class="singer-list">
      <el-row>
        <el-col :span="6" v-for="(item,i) in singerList" :key="i">
          <div class="singerbox">
            <img :src="item.picUrl" alt @click="toSingerList(item.id)" />
            <span @click="toSingerList(item.id)">{{item.name}}</span>
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
        num1: 1,
        num2: 1,
        num3: 1,
      // 歌手信息列表
      singerList: [],
      areaSongs: [
        {id:0, name: "地区", value: -2 },
        {id:0, name: "全部", value: -1 },
        {id:0, name: "华语", value: 7 },
        {id:0, name: "欧美", value: 96 },
        {id:0, name: "日本", value: 8 },
        {id:0, name: "韩国", value: 16 },
        {id:0, name: "其他", value: 0 },
      ],
      typeSongs: [
        {id:1, name: "分类", value: -2 },
        {id:1, name: "全部", value: -1 },
        {id:1, name: "男歌手", value: 1 },
        {id:1, name: "女歌手", value: 2 },
        {id:1, name: "乐队组合", value: 3 },
      ],
      // 请求数据参数
      queryInfo: {
        limit: 100,
        offset: 0,
        type: -1,
        area: -1,
        initial: -1
      }
    };
  },
  components: {},
  created() {
    this.getSingerRank()
  },
  computed: {
    screenSongs() {
      const str =
        "筛选,热门,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
      return str.split(",");
    },
  },
  methods: {
    // //   获得歌手榜数据100条
    // async getSingerFullRank() {
    //   const { data: res } = await this.$request.get(`/toplist/artist/`);
    //   console.log(res);

    //   res.list.artists.forEach((item) => {
    //     const obj = {};
    //     obj.id = item.id;
    //     obj.name = item.name;
    //     obj.picUrl = item.picUrl;
    //     this.singerList.push(obj);
    //   });
    // },
    // 获取数据30首
    async getSingerRank() {
      const { data: res } = await this.$request.get(`/artist/list`,{
        params: this.queryInfo
      });
      this.singerList = res.artists
      console.log(res);

      res.artists.forEach((item) => {
        const obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.picUrl = item.picUrl;
        this.singerList.push(obj);
      });
    },
    // 跳转到歌手歌单
    toSingerList(id) {
      this.$router.push(`/singerlist/${id}`);
    },
    // 显示选中的
    async showSelectData(i,item) {
      // 选中地区 
      console.log(i);   
        if(item.id == 0) {
           this.num1 = i 
          this.queryInfo.area = this.areaSongs[i]['value'] 
        }
        
        // 选中分类
        else if(item.id == 1) {
            this.num2 = i
            this.queryInfo.type = this.typeSongs[i]['value']
        } 
        // 选中筛选
        else {
            this.num3 = i
            this.queryInfo.initial = this.screenSongs[i]
        }
        this.getSingerRank()
       
    }
  },
};
</script>

<style lang="less" scoped>
ul {
  margin: 0;
  padding: 0;
}
ul li {
  list-style: none;
  float: left;
  padding: 3px 10px;
  height: 18px;
  line-height: 18px;
  font-size: 13px;
  opacity: 0.6;
}
li:hover {
  opacity: 1;
  cursor: pointer;
}
  .select {
    color: red !important;
    background: rgba(255, 0, 0, 0.05);
    border-radius: 10px;
  }
// .line1 {
//     height: 5px;
// }
.box {
  width: 767px;

  margin: 0 30px 30px;
}
.select-type {
  position: fixed;
  width: 767px;
  height: 150px;
 
}
.singer-list {
  position: relative;
}

.el-row {
  position: absolute;
  top: 150px;
  height: 275px;
  margin-bottom: 20px;
  overflow: auto;
}
.el-col:nth-child(n+5) {
  margin-top: 60px;
}
.singerbox {
  width: 130px;
  height: 130px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  span {
    display: block;
    padding-bottom: 10px;
    height: 20px;
    line-height: 20px;
   
  }
}
</style>