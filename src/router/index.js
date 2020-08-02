import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import PlayList from '../components/music/PlayList.vue'
import Collection from '../components/Collection.vue'
import SingerList from '../components/song/SingerList.vue'
import FindMusic from '../components/FindMusic.vue'
import DailyRecommend from '../components/music/DailyRecommend.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Index,
    children: [
      {path: '/playlist',component: PlayList},
      {path: '/collection',component: Collection},
      {path: '/singerlist/:id',component: SingerList},
      {path: '/music',component: FindMusic},
      {path: '/dailyrecommend',component: DailyRecommend},
    ]
  }
]

const router = new VueRouter({
  routes
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
