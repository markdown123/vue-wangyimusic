<template>
  <div>
    <div class="main-header">
      <i class="el-icon-arrow-left" @click="$router.push('../music')"></i>
      <slot></slot>
      <!-- 搜索框 -->
      <div class="search">
        <el-input
          placeholder="请输入歌曲名"
          class="input-with-select"
          @focus="getGuideBox"
          @blur="hideGuide"
          v-model="searchValueNew"
          @keyup.enter="searchEvent"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchEvent"></el-button>
        </el-input>
        <div class="searchGuide" v-show="searchOpenclose">
          <div class="guide-box">
            <div>热门搜索</div>
            <div class="hot-tags">
              <el-tag
                type="info"
                v-for="(item,i) in searchHot"
                :key="i"
                @click="toSearchList(item.first)"
              >{{item.first}}</el-tag>
            </div>
            <div>
              历史搜索
              <span class="close-all" @click="closeAll">清除所有</span>
            </div>
            <div class="history-tags">
              <el-tag
                closable
                type="info"
                v-for="(item,i) in historyTags"
                :key="i"
                @click="toSearchList(item)"
                @close="historyTagClose(item)"
              >{{item}}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="header">
        <strong>{{searchValueNew}}</strong>
        <span>共找到{{songcount}}首</span>
      </div>

      <!-- 列表区 -->
      <el-table :data="searchData" style="width: 100%" @row-click="getMusicUrl">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="name" label="音乐标题" width="180"></el-table-column>
        <el-table-column prop="author" label="歌手" width="180"></el-table-column>
        <el-table-column prop="album" label="专辑" width="180"></el-table-column>
        <el-table-column prop="time" label="时长"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import NavHeader from "../common/Navheader.vue";
export default {
  data() {
    return {
      // 搜索参数
      searchQury: {
        offset: 0,
        limit: 10,
        type: 1,
      },
      //   文本框的值
      searchValueNew: window.sessionStorage.getItem("searchValue"),
      // 查询到单曲数
      songcount: 0,
      //   搜索的返回值
      searchData: [],
      searchOpenclose: false,
      historyTags: [],
      // 热搜标签数据
    searchHot: [],
    };
  },
  components: {
    "nav-header": NavHeader,
  },
  created() {
    this.getSearch(this.searchValueNew);
  },
  watch: {
    searchValueNew(val) {
      this.getSearch(val);
    },
  },
  methods: {
    // 获得搜索数据
    async getSearch(val) {
      this.searchData = []
      const { data: res } = await this.$request.get(`/search?keywords= ${val}`);
      console.log(res);
      this.songcount = res.result.songCount;
      //   从源数据中得到新的数组
      res.result.songs.forEach((item) => {
        const obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.time = this.timeFormat(item.duration);
        obj.album = item.album.name;
        obj.pic = item.album.artist.img1v1Url;
        obj.arr = [];

        item.artists.forEach((i) => {
          obj.arr.push(i.name);
        });
        obj.author = obj.arr.join(" ");
        this.searchData.push(obj);
      });
      console.log(this.searchData);
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
        artist: obj.author,
        src: res.data[0].url,
        pic: obj.pic,
        id: obj.id,
      };
      window.sessionStorage.setItem("nowMusic", JSON.stringify(music));
      this.$store.dispatch("dealAutoPlay", music);
    },


     // 获得热搜标签数据
    async getGuideBox(el) {
      const {data:res} = await this.$request.get(`/search/hot`)
      console.log(res);
      this.searchHot = res.result.hots
      // 获取历史搜索数据
      const history = window.sessionStorage.getItem('historyData')
      var arr = history === null ? [] : JSON.parse(history)
      this.historyTags = arr
      this.searchOpenclose = true
      var guideBox = document.querySelector('.searchGuide')
      window.onclick = e => {
        if(!guideBox.contains(e.target) && !el.target.contains(e.target)) {
          this.searchOpenclose = false
          window.onclick = null
        }
      }
    },
    // 展示热搜框
    showGuide() {
     this.searchOpenclose = true
    },
    hideGuide() {
      this.$store.commit('showSearch',false)
    },
    // 点击热搜标签，搜索
    toSearchList(name) {
      this.$store.commit('showSearch',false)
      this.searchValueNew = name
      console.log(name);
      this.searchEvent()
    },
    // 处理文本框数据
    searchEvent() {
      if (this.searchValueNew.trim().length === 0) {
        return this.$message.error('输入搜索内容为空！')
      }
      this.searchOpenclose = true
      window.sessionStorage.setItem('searchValue',this.searchValueNew)
      const history = window.sessionStorage.getItem('historyData')
      var arr = history === null ? [] : JSON.parse(history)
      // 判断该搜索内容是否在历史标签中
      if(!arr.includes(this.searchValueNew.trim())) {
        if(arr.length <6) {
          arr.unshift(this.searchValueNew.trim())
        } else {
          arr.splice(5,1)
          arr.unshift(this.searchValueNew.trim())
        }
      }
      window.sessionStorage.setItem('historyData',JSON.stringify(arr))
      this.$router.push('/searchlist')  
    },
    // 清除历史搜索数据
    historyTagClose(item) {
      let index = this.historyTags.findIndex(i => {
        return i === item
      })
      this.historyTags.splice(index,1)
       window.sessionStorage.setItem(
        'historyData',
        JSON.stringify(this.historyTags)
      )
    },
    // 清除所有历史
    closeAll() {
      this.historyTags.splice(0)
      window.sessionStorage.setItem(
        'historyData',
        JSON.stringify(this.historyTags)
      )
    }

  },
  
};
</script>

<style lang="less" scoped>
.box {
  height: 430px;
  overflow: hidden scroll;
}
.header {
  padding: 20px;

  strong {
    font-size: 20px;
  }

  span {
    padding-left: 10px;
    opacity: 0.7;
  }
}

.main-header {
  position: relative;
  height: 40px;
  line-height: 40px;
  background-color: #f6f6f6;

  .el-icon-arrow-left {
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;
  }
  .search {
    position: absolute;
    right: 20px;
    top: 0;
    outline: none;

    .searchGuide {
      position: absolute;
      width: 283px;
      height: 420px;
      background-color: #fff;
      z-index: 999;
      box-shadow: -6px 6px 6px rgba(0, 0, 0, 0.25);

      .guide-box {
        padding: 8px 20px;

        .close-all {
          font-size: 12px;
          opacity: 0.6;
          cursor: pointer;
          padding-left: 20px;
        }
        

        .el-tag {
          font-size: 12px;
          margin-right: 10px;
          border-radius: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>