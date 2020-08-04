import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    thisPlaylistId: 0,
    playMusic: {
      name: '',
      artist: '',
      url: '',
      pic: '',
    },
    controlMsc: {},
    // 最新歌曲页面选中状态
    newMusicStatus: true
  },
  mutations: {
    // 接收播放对象
    controlMusic(state,obj) {
      state.controlMsc = obj
    },
    // 记录当前歌单id
    setPlaylistId(state,id) {
      state.thisPlaylistId = id

    },
    // 传入歌曲对象,设置当前播放
    setPlayMusic(state,obj) {
      state.playMusic = obj
      // 设置播放列表musiclist
      console.log(obj);
      console.log(state.controlMsc)
      // 如果选择的歌曲在列表内
      if (JSON.parse(window.sessionStorage.getItem('musiclist')) !== null) {
        const id = state.controlMsc.musicList.findIndex(item => obj.id === item.id)
        // 如果选择的歌曲在列表中，则去掉该歌曲，把选择的歌曲放入列表
        if (id < state.controlMsc.musicList.length - 1 && id !== -1) {
          state.controlMsc.musicList.splice(id, 1)
        }
        state.controlMsc.musicList.unshift(obj)
        window.sessionStorage.setItem('musiclist', JSON.stringify(state.controlMsc.musicList))
      } else {
        // 如果选择的歌曲不在列表内
        state.controlMsc.musicList.unshift(obj)
        window.sessionStorage.setItem('musiclist', JSON.stringify(state.controlMsc.musicList))
      }
    },
     
     // 播放器记一次加载
     firstComeMusic(state, obj) {
      state.playMusic = obj
    },
    // 开始播放音乐
    autoPlayMusic(state){
      state.controlMsc.play()
    },
    // 改变最新音乐页面的选中状态
    changeNewMusicStatus(state,str) {
      state.newMusicStatus = str
    }
  },
  actions: {
    dealAutoPlay(context,obj) {
      setTimeout(() => {
        context.commit('autoPlayMusic')
      }, 1000)
      context.commit('setPlayMusic',obj)
    }
  },
  modules: {
  }
})
