<template>
  <div>
    <div class="main">
      <el-row class="row-home">
        <!-- 放大，缩小，最小化 -->
        <el-col class="left-list">
          <div class="control">
            <el-button type="danger" icon="el-icon-circle-close"></el-button>
            <el-button type="warning" icon="el-icon-circle-plus-outline"></el-button>
            <el-button type="success" icon="el-icon-remove-outline"></el-button>
          </div>

          <!-- 登录区 -->
          <div class="login">
            <div @click="loginDialogVisible=true" v-if="userInfoStatus">
              <i class="el-icon-user"></i>
              <span>未登录</span>
              <span @click="registerDialogVisible = true">注册</span>
            </div>
            <div v-else class="userInfo">
              <img :src="userInfo.avatarUrl" alt />
              <span>{{userInfo.nickname}}</span>
              <i
                class="el-icon-caret-right"
                style="margin-left:20px;cursor: pointer;"
                @click="userLogout"
              ></i>
            </div>
          </div>

          <!-- 左侧菜单栏 -->
          <el-menu
            background-color="#ededed"
            class="left-menu"
            active-text-color="red"
            text-color="rgba(0,0,0,.7)"
            unique-opened
            :default-active="activePath"
          >
            <el-menu-item index="music" @click="toMusic">
              <i class="el-icon-headset"></i>
              <span slot="title">发现音乐</span>
            </el-menu-item>
            <!-- 我的音乐区 -->
            <el-row class="el-myMusic">我的音乐</el-row>
            <el-menu-item index="collection" @click="toCollection">
              <i class="el-icon-star-on"></i>
              <span slot="title">我的收藏</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-circle-plus-outline"></i>
                <span>创建歌单</span>
              </template>
              <template v-for="(item,i) in userMusicList">
                <el-menu-item
                  class="music-list-item"
                  :key="i"
                  v-if="item.creator.userId === userInfo.userId"
                  @click="getSonglistMusic(item.id)"
                >{{item.name}}</el-menu-item>
              </template>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-paperclip"></i>
                <span>收藏歌单</span>
              </template>
              <template v-for="(item,i) in userMusicList">
                <el-menu-item
                  class="music-list-item"
                  :key="i"
                  v-if="item.creator.userId !== userInfo.userId"
                  @click="getSonglistMusic(item.id)"
                >{{item.name}}</el-menu-item>
              </template>
            </el-submenu>
          </el-menu>
        </el-col>

        <!-- 右侧区域 -->
        <el-col class="right-box">
          <router-view></router-view>
        </el-col>

        <!-- 播放器 -->
        <div class="player-box">
          <aplayer
            preload="auto"
            :music="$store.state.playMusic"
            ref="musicRef"
            :list="musicList"
            :controls="true"
            :listFolded="true"
            :lrcType="1"
            :showLrc="isShowLrc"
            @loadstart="loadStartMusic"
          >
           <aplayer-list>
          <ol>
            <li>清除所有</li>
          </ol>
        </aplayer-list>
          </aplayer>
          <i class="el-icon-caret-left el-icon-common" @click="skipBackwardSong"></i>
          <i class="el-icon-caret-right el-icon-common" @click="skipForwardSong"></i>
          <i
            class="lrcToggle"
            :class="isShowLrc ? 'lrcdisplay' : ''"
            @click="isShowLrc = !isShowLrc"
          >词</i>
        </div>
      </el-row>

      <!-- 注册对话框 -->
      <el-dialog title="注册账户" :visible.sync="registerDialogVisible" width="50%">
        <el-form
          :model="registerForm"
          :rules="registerFormRules"
          ref="registerFormRef"
          label-width="100px"
        >
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="registerForm.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="registerForm.phone" @blur="phoneValid"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="captcha" class="captcha">
            <el-input v-model="registerForm.captcha" placeholder="短信验证码"></el-input>
            <el-button
              v-show="Verification"
              type="info"
              plain
              size="mini"
              @click="handleClick"
            >获取验证码</el-button>
            <el-button v-show="!Verification" type="info" plain size="mini">
              <span>{{timer}}</span>秒后重新获取
            </el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="registerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="registerValid">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 登录对话框 -->
      <el-dialog
        title="手机登录"
        :visible.sync="loginDialogVisible"
        width="50%"
        @close="loginDialogClose"
      >
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="100px">
          <el-form-item label="手机" prop="phone">
            <el-input type="text" v-model="loginForm.phone" name="phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input text="password" v-model="loginForm.password" name="password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click=" loginDialogVisible= false">取 消</el-button>
          <el-button type="primary" @click="saveLoginInfo">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import aplayer from "vue-aplayer";
export default {
  data() {
    var checkMobile = (rule, value, callback) => {
      // const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      const regMobile = /^1[3578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      // 控制登录对话框的显示和隐藏
      loginDialogVisible: false,
      // 控制注册对话框的显示和隐藏
      registerDialogVisible: false,
      // 登录表单数据
      loginForm: {
        phone: "15072779225",
        password: "13814160135hwf",
        // phone: "",
        // password: '',
      },
      loginFormRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      // 是否切换登录区
      userInfoStatus: JSON.parse(window.localStorage.getItem('isShowInfo')),
      userInfo: JSON.parse(window.localStorage.getItem('userInfo')),
      // 用户歌单
      userMusicList: [],
      // 选中的歌单
      activePath: "music",
      // 注册表单数据
      registerForm: {
        nickname: "",
        phone: "",
        password: "",
        captcha: 0,
      },
      registerFormRules: {
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "昵称长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        captcha: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 6,
            message: "验证码长度在 6 个字符",
            trigger: "blur",
          },
        ],
      },
      // 注册验证码按钮状态
      Verification: true,
      // 重新获取验证码的初始时间
      timer: 60,
      isShowLrc: false,
      // 第一次播放的歌曲索引
      firstplayIndex: -1,
    };
  },
  components: {
    aplayer: aplayer,
  },
  computed: {
    musicList: () => {
      // 获取音乐列表
      if (window.sessionStorage.getItem("musiclist")) {
        return JSON.parse(window.sessionStorage.getItem("musiclist"));
      } else {
        return [];
      }
    }, 
  },
  
  created() {
    this.getUserInfo()
    // 记录当前播放
    if (
      window.sessionStorage.getItem("musiclist") &&
      window.sessionStorage.getItem("nowMusic")
    ) {
      this.$store.commit(
        "firstComeMusic",
        JSON.parse(window.sessionStorage.getItem("nowMusic"))
      );
    }
    // 获得第一次播放音乐在musiclist中的索引
    this.firstplayIndex = window.sessionStorage
      .getItem("musiclist")
      .findIndex((item) => {
        JSON.parse(window.sessionStorage.getItem("nowMusic")).src === item.src;
      });
    this.getUserInfo();
  },
  mounted() {
    this.$store.commit("controlMusic", this.$refs.musicRef);
    this.$refs.musicRef.playIndex = this.firstplayIndex;
  },
  methods: {
    // 注册验证手机号是否注册过
    async phoneValid() {
      const { data: res } = await this.$request.get(
        `/cellphone/existence/check?phone=${this.registerForm.phone}`
      );
      console.log(res);
    },
    // 处理验证码倒计时
    async handleClick() {
      this.Verification = false;
      let auth_timer = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
          this.Verification = true;
          clearInterval(auth_timer);
          this.timer = 60;
        }
      }, 1000);

      // 发送短信验证码
      const { data: res } = await this.$request.get(
        `/captcha/sent?phone=${this.registerForm.phone}`
      );
      console.log(res);
    },
    // 注册验证
    registerValid() {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) return;
        // 注册
        const { data: re } = await this.$request.get(
          `/register/cellphone?phone=${this.registerForm.phone}
          &password=${this.registerForm.password}
          &captcha=${this.registerForm.captcha}
          &nickname=${this.registerForm.nickname}`
        );
        console.log(re);
      });
    },
    // 登录关闭，重置表单
    loginDialogClose() {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录-提交表单数据
    saveLoginInfo() {
      // 表单预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;

        const { data: isRegister } = await this.$request.get(
          `/cellphone/existence/check?phone=${this.loginForm.phone}`
        );
        console.log(isRegister);
        if (isRegister.exist === -1) return this.$message.error("该账户未注册");

        // 验证登录账号
        const { data: res } = await this.$request.get("login/cellphone", {
          params: {
            phone: this.loginForm.phone,
            password: encodeURIComponent(this.loginForm.password),
          },
        });
        // let md5_password = encodeURIComponent(this.loginForm.password)
        // const {data: res} = await this.$request.get(`/login/cellphone?
        // phone=${this.loginForm.phone}&md5_password=${md5_password}`)
        if (res.code !== 200) {
          return this.$message.error("登录失败");
        }
        this.$message.success("登录成功");

       
       this.getUserInfo();

      this.loginDialogVisible = false;
      });

        
    },
    // 获得用户信息
    async getUserInfo() {
      try {
        var time = new Date().getDate();
        const { data: res } = await this.$request.get(
          `login/status?timestamp=${time}`
        );
        console.log(res);
        const { data: res1 } = await this.$request.get(
          `/user/playlist?uid=${res.profile.userId}`
        );
        console.log(res1);
        this.userInfoStatus = false;
        window.localStorage.setItem('isShowInfo',JSON.stringify(false))
        this.userInfo = res.profile;
        window.localStorage.setItem('userInfo',JSON.stringify(this.userInfo))
        this.userMusicList = res1.playlist;
      } catch (error) {}
    },
    // 退出登录
    async userLogout() {
      this.userInfoStatus = true;
      this.userInfo = {};
      await this.$request.get("logout");
      this.$message.success("退出登录");
    },
    // 下一首
    skipForwardSong() {
      console.log(this.$refs.musicRef);
      var step = 1;
      // 当前播放歌曲的索引
      // if(this.$refs.musicRef.playIndex === -1) {
      //   this.$refs.musicRef.playIndex = 0
      // } 
      console.log(this.$refs.musicRef.playIndex);
      const listLength = this.$refs.musicRef.musicList.length;
      // 判断是否播放到了最后一首，然后重新回到第一首
      this.$refs.musicRef.playIndex =
        this.$refs.musicRef.playIndex === listLength - 1
          ? 0
          : this.$refs.musicRef.playIndex + step;
      console.log(this.$refs.musicRef.playIndex); 
      // this.$store.state.playIndex.push(this.$refs.musicRef.playIndex)
      // 播放下一首
      setTimeout(() => {
        this.$refs.musicRef.play()
      }, 500);
    },
    // 上一首
    skipBackwardSong() {
      const listLength = this.$refs.musicRef.musicList.length
      this.$refs.musicRef.playIndex =
        this.$refs.musicRef.playIndex === 0 ||
        this.$refs.musicRef.playIndex === -1
          ? listLength - 1
          : this.$refs.musicRef.playIndex - 1
      setTimeout(() => {
        this.$refs.musicRef.play()
      }, 500)
    },
    // 加载音乐
    async loadStartMusic(e) {
      if (
        this.$refs.musicRef.currentMusic.id &&
        this.$refs.musicRef.currentMusic.lrc === undefined
      ) {
        const { data: res } = await this.$request.get(
          `/lyric?id=${this.$refs.musicRef.currentMusic.id}`
        );
        if (res.lrc !== undefined) {
          this.$refs.musicRef.currentMusic.lrc = res.lrc.lyric;
        } else {
          this.$refs.musicRef.currentMusic.lrc = "[00:00.000]暂无歌词";
        }
        if (this.isShowLrc) {
          this.isShowLrc = false;
          setTimeout(() => {
            this.isShowLrc = true;
          }, 300);
        }
      }
    },
    // 获得列表歌曲
    async getSonglistMusic(id) {
      // 将当前选择的歌单id保存到store
      this.$store.commit("setPlaylistId", id);
      window.sessionStorage.setItem("playListId", id);
      this.$router.push("playlist");
    },
    toCollection() {
      this.$router.push('/collection')
    },
    toMusic() {
      this.$router.push('/music')
    }
  },
  // 监听菜单切换
   watch: {
    $route(to, from) {
      if (to.path.replace('/', '') === 'collection') {
        this.activePath = 'collection'
      } else if (to.path.replace('/', '') === 'music') {
        this.activePath = 'music'
      }
    },
    
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 1000px;
  background: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.23);
  height: 540px;
  margin: 50px auto;

  .row-home {
    position: relative;
    overflow: hidden;

    .player-box {
      width: 100%;
      height: 66px;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 999;

      .el-icon-common {
        position: absolute;
        font-size: 30px;
        top: 20px;
        color: red;
        cursor: pointer;
      }
      .el-icon-caret-left {
        left: 50%;
        margin-left: -70px;
      }
      .el-icon-caret-right {
        right: 50%;
        margin-right: -100px;
      }
      .aplayer {
        margin: 0 !important;
      }
    }

    // 左侧菜单样式
    .left-list {
      display: block;
      width: 200px;
      height: 540px;
      background-color: #ededed;

      // 控制图标样式
      .control {
        height: 40px;
        line-height: 30px;
        background: rgba(255, 255, 255, 0.4);
      }

      .control .el-button {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin: 0;
        margin-left: 8px;
        font-size: 12px;
        padding: 0;
      }

      // 选中登录
      .login {
        height: 70px;
        display: flex;
        align-items: center;
        .el-icon-user {
          width: 40px;
          height: 40px;
          text-align: center;
          border: 1px solid rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          font-size: 22px;
          line-height: 35px;
          margin-left: 20px;
          cursor: pointer;
        }
        span {
          font-size: 14px;
          margin-left: 20px;
          color: rgba(0, 0, 0, 0.6);
          cursor: pointer;
        }
        .userInfo {
          display: flex;
          align-items: center;
        }
        .userInfo img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-left: 20px;
          border: 1px solid red;
        }
        .userInfo span {
          text-align: center;
        }
      }
      .left-menu {
        letter-spacing: 2px;

        .el-myMusic {
          color: rgba(0, 0, 0, 0.6);
          font-size: 13px;
          margin-top: 15px;
          margin-left: 20px;
          height: 28px;
        }
        .el-menu-item-group {
          font-size: 12px !important;
        }
      }
    }

    // 歌单样式
    .music-list-item {
      font-size: 12px;
      padding: 0 20px !important;
      // 不会换行
      white-space: nowrap;
      // 多余文字用省略号显示
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .right-box {
      height: 540px;
      width: 800px;
    }
  }
}

.lrcToggle {
  border: 1px solid #333;
  font-style: normal;
  width: 18px;
  height: 18px;
  display: inline-block;
  position: absolute;
  top: 22px;
  right: 142px;
  box-sizing: border-box;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  border-radius: 2px;
}

.lrcdisplay {
  color: red !important;
  border-color: red;
}
.lrcToggle:hover {
  color: #000;
}

// 注册验证码
.captcha {
  width: 50%;
}
</style>
