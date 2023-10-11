<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"/>
          <span>导航一</span>
        </template>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-close"/>
            <span slot="title">导航二
            </span>
          </template>
          <el-menu-item index="6">
            导航三
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="7">
          导航四
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
// import { name, str } from './components/test.js'
export default {
  data() {
    return {

    }
  },
  created() {
    console.log(123)
  }
}
</script>
