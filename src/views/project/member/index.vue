<template>
  <div class="app-main">
    <el-tabs lazy @tab-click="changeTab">
      <el-tab-pane v-if="isSuperadminshow" label="项目管理员" >
        <Superadmin />
      </el-tab-pane>
      <el-tab-pane v-if="isCompanyShow" label="单位" >
        <company />
      </el-tab-pane>
      <el-tab-pane v-if="isDepartmentShow" label="部门" lazy>
        <Department />
      </el-tab-pane>
      <el-tab-pane v-if="isRoleShow" label="人员" lazy>
        <Member />
      </el-tab-pane>
      <el-tab-pane v-if="isRoleShow" label="角色" lazy>
        <permission />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import permission from './components/permission'
import Company from './components/Company'
import Member from './components/Member'
import Department from './components/Department'
import Superadmin from './components/superadmin'
import { mapGetters } from 'vuex'

export default {
  components: { Company, Member, Department, permission, Superadmin },
  data() {
    return {
      key: 0,
      mangmentTab: [
        { name: 'department', label: '部门管理', cName: 'Department' },
        { name: 'member', label: '人员管理', cName: 'Member' }
      ],
      activeName: 'company'
    }
  },
  computed: {
    ...mapGetters([
      'Account_Type'
    ]),
    isSuperadminshow: function() {
      return [1, 2, 10].includes(this.Account_Type)
    },
    isCompanyShow: function() {
      return [1, 2, 10, 11].includes(this.Account_Type)
    },
    isDepartmentShow: function() {
      return [1, 2, 10, 11, 12].includes(this.Account_Type)
    },
    isRoleShow() {
      return [1, 2, 10, 11, 12, 13].includes(this.Account_Type)
    }
  },
  methods: {
    changeTab() {
      this.key++
    }
    // tabShow() {
    //   if (this.Account_Type === 0) {
    //     this.activeName = 'company'
    //   } else {
    //     this.activeName = 'department'
    //   }
    // }
  }
}
</script>

<style scoped>
  .app-main{
    padding: 12px 34px 0px 34px;
    z-index:0;
  }
</style>
