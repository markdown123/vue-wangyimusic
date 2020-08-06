<template>
  <div>
    <div class="main-header">
      <i class="el-icon-arrow-left" @click="$router.push(returnLink)"></i>
      <slot></slot>
      <!-- 搜索框 -->
      <div class="search">
        <el-input placeholder="请输入歌曲名" class="input-with-select" 
        @focus="getGuideBox" @blur="hideGuide"
         v-model="searchValueNew" @keyup.enter="searchEvent"
        >
          <el-button slot="append" icon="el-icon-search"
          @click="searchEvent"></el-button>          
        </el-input>
        <div class="searchGuide" v-show="searchOpenclose">
          <div class="guide-box">
            <div>热门搜索</div>
            <div class="hot-tags">
              <el-tag type="info" v-for="(item,i) in searchHot"
              :key="i" @click="toSearchList(item.first)">{{item.first}}</el-tag>
            </div>
            <div>历史搜索 <span class="close-all" @click="closeAll">清除所有</span></div>
             <div class="history-tags">
              <el-tag closable type="info" v-for="(item,i) in historyTags"
              :key="i" @click="toSearchList(item)"
               @close="historyTagClose(item)">{{item}}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  props: {
    returnLink: {
      type: String,
      default: "/music",
      required: false,
    },   
  },
  data() {
    return {
       // 热搜标签数据
    searchHot: [],
    // 是否显示热搜框
    isShow: false,
    searchOpenclose: false,
  //  历史搜索内容
    historyTags: [],
      // 文本框输入的值
      searchValueNew: '',
    };
  },
  created() {
    
    
  },
  methods: {
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