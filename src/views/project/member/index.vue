<template>
  <div class="app-main">
    <el-tabs v-if="isprojectusershow" @tap-click="tabTap">
      <el-tab-pane v-if="isprojectadminshow" label="项目管理员" >
        <Superadmin />
      </el-tab-pane>
      <el-tab-pane label="人员" lazy>
        <Member />
      </el-tab-pane>
      <el-tab-pane label="角色" lazy>
        <permission />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Superadmin from './components/superadmin'
import permission from './components/permission'
import Member from './components/Member'
import { mapGetters } from 'vuex'

export default {
  components: { Member, permission, Superadmin },
  data() {
    return {
      key: 0,
      activeName: 'company'
    }
  },
  computed: {
    ...mapGetters([
      'Account_Type'
    ]),
    isprojectadminshow: function() {
      return [1, 2, 10].includes(this.Account_Type)
    },
    isprojectusershow: function() {
      return [1, 2, 10, 11].includes(this.Account_Type)
    }
  },
  methods: {
    tabTap() {
      this.key++
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
