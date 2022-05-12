<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleCommand">
        <div>
          <!-- <div class="avatar-wrapper">
            <img :src="user_image+'?imageView2/1/w/80/h/80'" class="user-avatar" @error="imgError">
          </div> -->
          <span class="username-item">{{ nick_name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/home">
            <el-dropdown-item>
              项目首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided command="projects" >
            管理平台
          </el-dropdown-item>
          <el-dropdown-item divided command="userInfo">
            信息修改
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <template>
        <screenfull class="right-menu-item hover-effect"/>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters([
      'Account_Type',
      'sidebar',
      'nick_name',
      'user_image',
      'user_name'
    ])
  },
  methods: {
    imgError(event) {
      const img = event.srcElement
      img.src = process.env.HEAD_IMAGE_URL + '0.png?imageView2/1/w/80/h/80'
      img.onerror = null
      console.log(456)
    },
    handleCommand(com) {
      switch (com) {
        case 'projects':
          this.$router.push({ path: '/platform/projects' })
          break
        case 'userInfo':
          this.$router.push({ path: '/userinfo/password' })
          break
        case 'logout':
          this.$store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
          break
      }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar').then(() => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dropdown-item{
  padding: 8px;
}
/*顶部导航栏布局*/
.navbar {
  position: relative;
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  z-index: 998;
  /*面包屑布局*/
  /*.hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }*/
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
    cursor: pointer;
    transition: background .3s;

    &:hover {
      background: rgba(0, 0, 0, .1)
    }
  }
  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .1)
        }
      }
    }

    .avatar-container {
      margin-right: 0px;

      .username-item {
        display: inline-block;
        margin-left: 8px;
        height: 100%;
        font-size: 16px;
        color: #666666;
        vertical-align: text-bottom;
      }

      .avatar-wrapper {
        display: inline-block;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 999px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

