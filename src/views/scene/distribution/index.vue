<template>
  <div class="app-main">
    <el-tabs >
      <el-tab-pane v-if="isCompanyShow" label="公司分配" >
        <company />
      </el-tab-pane>
      <el-tab-pane v-if="isDepartmentShow" label="人员分配" lazy>
        <user />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import company from './company'
import user from './user'
import { mapGetters } from 'vuex'
export default {
  components: { company, user },

  data() {
    return {

    }
  },

  computed: {
    ...mapGetters(['Account_Type']),
    isCompanyShow() {
      return this.Account_Type <= 11
    },
    isDepartmentShow() {
      return this.Account_Type <= 12
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
