<template>
  <div class="app-main">
    <el-tabs>
      <el-tab-pane label="人员备案" >
        <staffs :staff_type_id="0"/>
      </el-tab-pane>
      <el-tab-pane label="消防控制室值班人员" >
        <staffs :staff_type_id="1"/>
      </el-tab-pane>
      <el-tab-pane label="消防安保巡查人员" >
        <staffs :staff_type_id="2"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import staffs from './components/staffs'

export default {
  components: { staffs },
  data() {
    return {
    }
  }
}
</script>

<style scoped>
  .app-main{
    padding: 12px 34px 0px 34px;
    z-index:0;
  }
</style>
