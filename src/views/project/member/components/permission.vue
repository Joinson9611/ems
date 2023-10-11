<template>
  <div style="margin-top: 10px">
    <div>
      <div class="filter-container">
        <el-select v-if="isCompanyShow" v-model="requestGetGroups.company_id" placeholder="单位" style="width: 200px" class="filter-item" @change="companySelect">
          <el-option v-for="item in companyFilterOptions" :key="item.company_id" :label="item.name" :value="item.company_id"/>
        </el-select>
        <el-select v-if="isDepartmentShow" v-model="requestGetGroups.department_id" placeholder="部门" style="width: 200px" class="filter-item" @change="departmentSelect">
          <el-option v-for="item in departmentFilterOptions" :key="item.department_id" :label="item.name" :value="item.department_id"/>
        </el-select>
        <el-input v-model="requestGetGroups.name" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch"/>
        <!--筛选按钮-->
        <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        <!--新建按钮-->
        <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openDialogGroupInfoAdd">新建</el-button>
        <!--删除按钮-->
        <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteUserGroups">删除</el-button>
      </div>
      <el-table
        v-loading="isGroupListLoadingShow"
        :data="groupList"
        element-loading-text="加载中"
        style="width:100%;"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center"
          width="50"/>
        <el-table-column
          align="center"
          type="index"
          width="80"
          label="序号"/>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="openDialogGroupInfoEdit(scope.row)"><i>{{ scope.row.name }}</i></a>
          </template>
        </el-table-column>
        <el-table-column label="所属单位" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.company_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.department_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ getTime(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--弹出窗口-->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false" :title="title" @close="closeDialog">
      <el-form ref="formUserGroup" :model="requestGroup" :rules="groupInfoRules" label-position="right" >
        <div class="row">
          <el-form-item label="角色名称" class="dialog-form-item" prop="name" >
            <el-input v-model="requestGroup.name" type="text"/>
          </el-form-item>
          <!--单位-->
          <el-form-item v-if="isCompanyShow" label="所属单位" class="dialog-form-item" prop="company_id">
            <el-select v-if="!isEditDialog" v-model="requestGroup.company_id" :disabled="isEditDialog" filterable placeholder="请选择单位">
              <el-option v-for="item in companyOptions" :key="item.company_id" :label="item.name" :value="item.company_id"/>
            </el-select>
            <el-input v-else v-model="requestGroup.company_name" disabled/>
          </el-form-item>
          <!--单位-->
          <el-form-item v-if="isDepartmentShow" label="所属部门" class="dialog-form-item" prop="department_id">
            <el-select v-if="!isEditDialog" v-model="requestGroup.department_id" :disabled="isEditDialog" filterable placeholder="请选择部门">
              <el-option v-for="item in departmentOptions" :key="item.department_id" :label="item.name" :value="item.department_id"/>
            </el-select>
            <el-input v-else v-model="requestGroup.department_name" disabled/>
          </el-form-item>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="权限选择" >
            <!-- 权限选择 -->
            <el-form-item prop="rules">
              <div v-for="(item,index) in authority" :key="index" class="checkbox-group-item">
                <checkboxItem v-if="isRowModuleShow(item)" :checkbox-data="item" :disabled-roles="disabledRoles" :checked-item="requestGroup.rules" :checked.sync="item.checkedCB"/>
              </div>
            </el-form-item>
          </el-tab-pane>
          <!-- <el-tab-pane label="消息通知" >
            <el-form-item prop="rules">
              <div v-for="(item,index) in notification" :key="index" class="checkbox-group-item">
                <checkboxItem v-if="isRowModuleShow(item)" :checkbox-data="item" :is-need-disable="false" :disabled-roles="disabledRoles" :checked-item="requestGroup.rules_app" :checked.sync="item.checkedCB"/>
              </div>
            </el-form-item>
          </el-tab-pane> -->
          <el-tab-pane label="登录权限" >
            <el-checkbox v-model="requestGroup.is_web_permit" :true-label="1" :false-label="0">允许登录后台管理系统</el-checkbox>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogGroup">取消</el-button>
        <el-button v-waves :loading="isButtonLoadingShow" type="primary" @click.native="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { Formattimestamp } from '@/utils/time'
import { getProjectCompany } from '@/api/company'
import { getDepartmentsByCompany } from '@/api/departments'
import { getProjectGroups, addProjectGroups, deleteProjectGroups, editProjectGroups } from '@/api/authgroups'
import { mapGetters } from 'vuex'
import { contains } from '@/utils/tools'
import checkboxItem from './components/checkbox'
export default {
  components: {
    checkboxItem
  },
  directives: { waves },
  data() {
    return {
      // checkedCB接收组件回传的已选中的checkbox数组,属于必填项，属性值设为空即可
      authority: [],
      notification: [],
      companyFilterOptions: [{ company_id: -1, name: '全部单位' }],
      companyOptions: [],
      userGroupOptions: [],
      departmentFilterOptions: [{ department_id: -1, name: '全部部门' }],
      departmentOptions: [],
      allRoles: [],
      disabledRoles: [],

      isEditDialog: false,
      isAddDialog: false,
      isGroupListLoadingShow: false,
      groupList: [],
      multipleSelection: [],
      groupInfoRules: {
        company_id: [{ required: true, trigger: 'change', message: '请选择单位' }],
        department_id: [{ required: true, trigger: 'change', message: '请选择部门' }],
        name: [{ required: true, trigger: 'change', message: '请输入新的角色名' }],
        rules: [{ required: false, trigger: 'change', message: '请选择角色赋予的权限' }],
        rules_app: [{ required: false, trigger: 'change', message: '请选择角色赋予的权限' }]
      },
      requestGetGroups: {
        company_id: -1,			// 2020.09.27新增	 用于筛选 -1=该单位所有
        department_id: -1,
        project_id: undefined,
        name: undefined
      },
      isButtonLoadingShow: false,
      dialogVisible: false,
      requestGroup: {
        project_id: undefined,
        conmpany_name: undefined,
        department_name: undefined,
        company_id: -1,
        department_id: -1,
        group_id: undefined,
        name: undefined,
        rules: [],
        app_module: [],
        is_web_permit: 1,
        rules_app: []
      }
    }
  },

  computed: {
    title() {
      return this.isEditDialog ? '编辑角色' : '新建角色'
    },
    ...mapGetters([
      'app_module',
      'is_web_permit',
      'selected_project_id',
      'roles',
      'Account_Type',
      'company_id',
      'department_id'
    ]),
    isCompanyShow() {
      return [1, 2, 10, 11].includes(this.Account_Type)
    },
    isDepartmentShow() {
      return [1, 2, 10, 11, 12].includes(this.Account_Type)
    }
  },
  watch: {
    'requestGroup.company_id': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal && curVal !== '' && curVal !== undefined) {
          this.departmentOptions = undefined
          this.getDepartmentsByCompany(curVal)
        }
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    this.requestGetGroups.company_id = this.company_id
    this.requestGroup.company_id = this.company_id
    if (this.Account_Type === 13) {
      this.requestGetGroups.department_id = this.department_id
      this.requestGroup.department_id = this.department_id
    }
    this.getProjectGroups()
    this.getCompanyList()
    this.getDepartmentList()
    this.authority = [
      {
        label: '操作日志',
        list: [
          { pid: '481', label: '查看', show: true }
        ],
        checkedCB: []
      },
      {
        label: '建筑管理',
        list: [
          { pid: '191', label: '建筑查看', show: true },
          { pid: '192', label: '建筑物编辑（包括楼层）', show: true }
        ],
        checkedCB: []
      },
      {
        label: '网关管理',
        list: [
          { pid: '301', label: '网关查看', show: true },
          { pid: '302', label: '网关编辑', show: true }
        ],
        checkedCB: []
      },
      {
        label: '设备管理',
        list: [
          { pid: '311', label: '设备查看', show: true },
          { pid: '312', label: '设备编辑（包括通道）', show: true }
        ],
        checkedCB: []
      },
      {
        label: '组管理',
        list: [
          { pid: '321', label: '组查看', show: true },
          { pid: '322', label: '组编辑（包括绑定通道）', show: true }
        ],
        checkedCB: []
      },
      {
        label: '开关绑定',
        list: [
          { pid: '331', label: '开关查看', show: true },
          { pid: '332', label: '开关绑定', show: true }
        ],
        checkedCB: []
      },
      {
        label: '场景管理',
        list: [
          { pid: '341', label: '场景查看', show: true },
          { pid: '342', label: '场景编辑（包括绑定组）', show: true },
          { pid: '343', label: '场景分配（包括公司和个人）', show: true }
        ],
        checkedCB: []
      },
      {
        label: '定时管理',
        list: [
          { pid: '351', label: '定时器查看', show: true },
          { pid: '352', label: '定时器编辑（包括绑定场景）', show: true }
        ],
        checkedCB: []
      },
      {
        label: '自动化管理',
        list: [
          { pid: '371', label: '自动化条件查看', show: true },
          { pid: '372', label: '自动化条件编辑（包括条件编辑）', show: true }
        ],
        checkedCB: []
      },
      {
        label: '配置下发',
        list: [
          { pid: '361', label: '控制器/开关配置数据下发', show: true }
        ],
        checkedCB: []
      }
    ]
    this.notification = [
      {
        label: '设备报修',
        list: [
          { pid: '1', label: '报修指派', show: this.isModuleShow('1') },
          { pid: '2', label: '接收系统停用通知', show: this.isModuleShow('1') },
          { pid: '3', label: '任务审核处理', show: this.isModuleShow('1') },
          { pid: '4', label: '材料更换审批', show: this.isModuleShow('1') }
        ],
        checkedCB: []
      },
      {
        label: '施工申请',
        list: [
          { pid: '101', label: '一级审核', show: this.isModuleShow('12') },
          { pid: '102', label: '二级审核', show: this.isModuleShow('12') },
          { pid: '103', label: '三级审核', show: this.isModuleShow('12') },
          { pid: '104', label: '消控中心通知', show: this.isModuleShow('12') }
        ],
        checkedCB: []
      },
      {
        label: '设备过期',
        list: [
          { pid: '11', label: '设备过期通知', show: true }
        ],
        checkedCB: []
      },
      {
        label: 'FAS(报警)',
        list: [
          { pid: '21', label: '火警', show: true },
          { pid: '27', label: '火警确认', show: true },
          { pid: '28', label: '火警再确认', show: true },
          { pid: '22', label: '故障', show: true }
        ],
        checkedCB: []
      },
      {
        label: '无线烟感(报警)',
        list: [
          { pid: '31', label: '火警事件(恢复)', show: this.isModuleShow('8') },
          { pid: '32', label: '电量过低(恢复)', show: this.isModuleShow('8') },
          { pid: '33', label: '防拆事件(恢复)', show: this.isModuleShow('8') }
        ],
        checkedCB: []
      },
      {
        label: '水位监测(报警)',
        list: [
          { pid: '41', label: '过高/过低(恢复)', show: this.isModuleShow('9') },
          { pid: '42', label: '电量过低(恢复)', show: this.isModuleShow('9') }
        ],
        checkedCB: []
      },
      {
        label: '水压监测(报警)',
        list: [
          { pid: '46', label: '过高/过低(恢复)', show: this.isModuleShow('10') },
          { pid: '47', label: '电量过低(恢复)', show: this.isModuleShow('10') }
        ],
        checkedCB: []
      },
      {
        label: '水浸监测(报警)',
        list: [
          { pid: '61', label: '水浸报警(恢复)', show: this.isModuleShow('7') },
          { pid: '62', label: '电量过低(恢复)', show: this.isModuleShow('7') }
        ],
        checkedCB: []
      },
      {
        label: '电气火灾',
        list: [
          { pid: '71', label: '报警', show: this.isModuleShow('17') }
        ],
        checkedCB: []
      },
      {
        label: 'AI摄像头',
        list: [
          { pid: '51', label: '报警', show: this.isModuleShow('15') }
        ],
        checkedCB: []
      },
      {
        label: 'AI火灾识别系统',
        list: [
          { pid: '81', label: '报警', show: this.isModuleShow('18') }
        ],
        checkedCB: []
      }
    ]
    this.getAllRoles()
  },
  methods: {
    isRowModuleShow(res) {
      let list = []
      list = res.list.filter(item => item.show)
      return list.length !== 0
    },
    isModuleShow(roles) {
      return contains(roles, this.roles)
    },
    appDisabled(id) {
      return !this.app_module.includes(id)
    },
    getAllRoles() {
      const allRoles = []
      this.authority.forEach(item => {
        item.list.forEach(item2 => {
          allRoles.push(item2.pid)
        })
      })
      this.notification.forEach(item => {
        item.list.forEach(item2 => {
          allRoles.push(item2.pid)
        })
      })
      this.allRoles = allRoles
      this.disableItem()
    },
    disableItem() {
      var arr = this.allRoles
      var brr = this.roles
      var temp = []
      var temparray = []
      for (let i = 0; i < brr.length; i++) {
        temp[brr[i]] = typeof brr[i]
      }
      for (let i = 0; i < arr.length; i++) {
        var type = typeof arr[i]
        if (!temp[arr[i]]) {
          temparray.push(arr[i])
        } else if (temp[arr[i]].indexOf(type) < 0) {
          temparray.push(arr[i])
        }
      }
      this.disabledRoles = temparray
    },
    companySelect(id) {
      this.requestGetGroups.company_id = id
      this.requestGetGroups.department_id = -1
      this.getDepartmentsByCompany2(id)
      this.getProjectGroups()
    },
    departmentSelect(id) {
      this.requestGetGroups.department_id = id
      this.getProjectGroups()
    },
    getCompanyList() {
      getProjectCompany({ project_id: this.selected_project_id }).then(res => {
        this.companyFilterOptions = this.companyFilterOptions.concat(res.data.items)
        this.companyOptions = res.data.items
      }).catch(() => {

      })
    },
    getDepartmentList() {
      getDepartmentsByCompany({ company_id: this.requestGetGroups.company_id }).then(res => {
        this.departmentFilterOptions = this.departmentFilterOptions.concat(res.data)
        this.departmentOptions = res.data
      }).catch(() => {
      })
    },
    getDepartmentsByCompany(id) {
      const params = {
        company_id: id
      }
      getDepartmentsByCompany(params).then(response => {
        this.departmentOptions = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 关闭角色添加对话框
     * @Date: 2019/9/24
     **/
    closeDialogGroup() {
      this.dialogVisible = false
    },
    closeDialog() {
      this.isEditDialog = false
      this.isAddDialog = false
    },
    // 对话框确定按钮提交
    confirm() {
      if (this.isAddDialog) this.onGroupAdd()
      if (this.isEditDialog) this.onGroupEdit()
    },
    getDepartmentsByCompany2(id) {
      const params = {
        company_id: id
      }
      getDepartmentsByCompany(params).then(res => {
        this.departmentFilterOptions = [{ department_id: -1, name: '全部部门' }]
        this.departmentFilterOptions = this.departmentFilterOptions.concat(res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 获取权限列表
     * @Date: 2019/5/6
     **/
    getProjectGroups() {
      this.requestGetGroups.project_id = this.selected_project_id
      this.isGroupListLoadingShow = true
      getProjectGroups(this.requestGetGroups).then(response => {
        this.isGroupListLoadingShow = false
        this.groupList = response.data.items
        this.total = response.data.total
      }).catch(() => {
        this.isGroupListLoadingShow = false
      })
    },
    /**
     * @Description: 搜索事件
     * @Date: 2021/5/6
     **/
    onSearch() {
      this.getProjectGroups()
    },
    /**
     * @Description: 列表勾选回调
     * @Date: 2019/5/6
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 打开权限编辑对话框
     * @Date: 2019/5/6
     **/
    openDialogGroupInfoEdit(info) {
      this.isEditDialog = true
      if (this.$refs.formUserGroup !== undefined) this.$refs.formUserGroup.resetFields()
      const roles = info.rules.split(',')
      let roles_app
      let app_module
      if (info.rules_app !== '') {
        roles_app = info.rules_app.split(',')
      } else {
        roles_app = []
      }
      if (info.app_module !== '') {
        app_module = info.app_module.split(',')
      } else {
        app_module = []
      }
      this.requestGroup.project_id = this.selected_project_id
      this.requestGroup.group_id = info.group_id
      this.requestGroup.company_name = info.company_name
      this.requestGroup.department_name = info.department_name
      this.requestGroup.name = info.name
      this.requestGroup.rules = roles
      this.requestGroup.is_web_permit = info.is_web_permit
      this.requestGroup.rules_app = roles_app
      this.requestGroup.app_module = app_module
      this.dialogVisible = true
    },
    /**
     * @Description: 打开权限添加对话框
     * @Date: 2019/5/6
     **/
    openDialogGroupInfoAdd() {
      if (this.$refs.formUserGroup !== undefined) this.$refs.formUserGroup.resetFields()
      this.isAddDialog = true
      this.requestGroup.rules = []

      if ([1, 2, 10, 11].includes(this.Account_Type)) { this.requestGroup.company_id = undefined }
      if ([1, 2, 10, 11, 12].includes(this.Account_Type)) { this.requestGroup.department_id = undefined }
      this.requestGroup.name = undefined
      this.requestGroup.rules = []
      this.requestGroup.rules_app = []
      this.requestGroup.app_module = []
      this.dialogVisible = true
    },
    /**
     * @Description: 删除选中的角色
     * @Date: 2019/9/25
     **/
    deleteUserGroups() {
      this.$confirm('确认删除选中的角色吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const deleteParams = {
          group_id_list: this.multipleSelection.map(item => item.group_id),
          project_id: this.selected_project_id
        }
        deleteProjectGroups(deleteParams).then(() => {
          this.getProjectGroups()
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        }).catch(err => {
          console.log(err)
        })
      })
    },
    generateRules(val) {
      const rules = []
      val.forEach(item => {
        rules.push.apply(rules, item.checkedCB)
      })
      return rules
    },
    /**
     * @Description: 角色添加事件
     * @Date: 2019/9/24
     **/
    onGroupAdd() {
      this.$refs.formUserGroup.validate(valid => {
        if (valid) {
          // 生成权限数组
          const rules = this.generateRules(this.authority)
          const rules_app = this.generateRules(this.notification)
          const app_module = this.requestGroup.app_module
          this.isButtonLoadingShow = true
          const addParams = {
            project_id: this.selected_project_id,
            company_id: this.requestGroup.company_id,
            department_id: this.requestGroup.department_id,
            name: this.requestGroup.name,
            rules: rules.toString(),
            is_web_permit: this.requestGroup.is_web_permit,
            app_module: app_module.toString(),
            rules_app: rules_app.length === 0 ? '' : ',' + rules_app.toString() + ','
          }
          addProjectGroups(addParams).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功！'
            })
            this.getProjectGroups()
            this.isButtonLoadingShow = false
            this.dialogVisible = false
          }).catch(err => {
            console.log(err)
            this.isButtonLoadingShow = false
          })
        }
      })
    },
    /**
     * @Description: 角色编辑事件
     * @Date: 2019/9/24
     **/
    onGroupEdit() {
      this.$refs.formUserGroup.validate(valid => {
        // const rules = [...this.taskArr, ...this.projectMemberArr, ...this.projectRoleArr, ...this.buildingArr, ...this.deviceArr]
        if (valid) {
          // 生成权限数组
          const rules = this.generateRules(this.authority)
          const rules_app = this.generateRules(this.notification)
          this.isButtonLoadingShow = true
          const Params = {
            project_id: this.selected_project_id,
            group_id: this.requestGroup.group_id,
            rules: rules.toString(),
            is_web_permit: this.requestGroup.is_web_permit,
            app_module: this.requestGroup.app_module.toString(),
            rules_app: rules_app.length === 0 ? '' : ',' + rules_app.toString() + ',',
            name: this.requestGroup.name
          }
          editProjectGroups(Params).then(() => {
            this.$message({
              type: 'success',
              message: '编辑成功！'
            })
            this.getProjectGroups()
            this.isButtonLoadingShow = false
            this.dialogVisible = false
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    /**
     * @Description: 关闭角色信息编辑对话框
     * @Date: 2019/5/6
     **/
    closeDialogGroupEdit() {
      this.dialogEditVisible = false
    },
    /**
     * @Description: 时间格式转换
     * @Date: 2019/5/6
     **/
    getTime(time) {
      return Formattimestamp(time)
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/.el-dialog__body {
    height: 400px;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .pesmission-label{
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #DCDFE6;
    flex: 0 0 100px
  }
  .permission-detail{
    flex: 1;
    padding-left: 10px;
  }
  .checkbox-group-item {
    border-radius: 0px;
    border-color: #dddddd;
    border-width: 1px;
    border-top-width: 0;
    border-style: solid;
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border-color: #dddddd;
      border-width: 1px;
      border-top-width: 0;
      border-style: solid;
    }
    &:first-child{
      border-width: 1px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  .checkbox-item{
    margin: 0 15px 0 0;
  }
  /deep/.el-dialog {
    width: 700px;
  }
  /deep/.el-dialog__body {
    height: 620px;
  }
  .group-top-item{
  padding: 4px 16px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-color: #dddddd;
  border-width: 1px;
  border-style: solid;
}
</style>
