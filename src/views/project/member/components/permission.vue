<template>
  <div style="margin-top: 10px">
    <div>
      <div class="filter-container">
        <el-input :size="size" v-model="requestGetGroups.title" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch"/>
        <!--筛选按钮-->
        <el-button v-waves :size="size" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
        <!--新建按钮-->
        <el-button v-waves :size="size" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openDialogGroupInfoAdd">新建</el-button>
        <!--删除按钮-->
        <el-button v-waves :size="size" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteUserGroups">删除</el-button>
      </div>

      <el-table
        v-loading="isGroupListLoadingShow"
        :data="groupList"
        element-loading-text="加载中"
        style="width:100%;"
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
            <a style="color: #409EFF" @click="openDialogGroupInfoEdit(scope.row)"><i>{{ scope.row.title }}</i></a>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.note }}</span>
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
          <el-form-item label="角色名称" class="dialog-form-item" prop="title" >
            <el-input v-model="requestGroup.title" type="text"/>
          </el-form-item>
          <el-form-item label="备注" class="dialog-form-item" >
            <el-input v-model="requestGroup.note" type="text"/>
          </el-form-item>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="权限选择" >
            <!-- 权限选择 -->
            <el-form-item prop="rules">
              <div v-for="(item,index) in authority" :key="index" class="checkbox-group-item">
                <checkboxItem :checkbox-data="item" :disabled-roles="disabledRoles" :checked-item="requestGroup.rules" :checked.sync="item.checkedCB"/>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="消息通知" >
            <!-- 权限选择 -->
            <el-form-item prop="rules">
              <div v-for="(item,index) in notification" :key="index" class="checkbox-group-item">
                <checkboxItem :checkbox-data="item" :is-need-disable="false" :disabled-roles="disabledRoles" :checked-item="requestGroup.rules_app" :checked.sync="item.checkedCB"/>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="登录权限" >
            <el-checkbox v-model="requestGroup.is_web_permit" :true-label="1" :false-label="0">允许登录后台管理系统</el-checkbox>
          </el-tab-pane>
          <!-- <el-tab-pane label="APP功能模块" >
            <el-form-item class="dialog-form-item" prop="app_module">
              <el-checkbox-group v-model="requestGroup.app_module">
                <div class="group-top-item">
                  <el-checkbox :disabled="appDisabled('1')" :label="'1'" :key="'1'" class="checkbox-item">设备巡查</el-checkbox>
                  <el-checkbox :disabled="appDisabled('2')" :label="'2'" :key="'2'" class="checkbox-item">消防巡查</el-checkbox>
                  <el-checkbox :disabled="appDisabled('3')" :label="'3'" :key="'3'" class="checkbox-item">保养</el-checkbox>
                  <el-checkbox :disabled="appDisabled('4')" :label="'4'" :key="'4'" class="checkbox-item">设备保修</el-checkbox>
                  <el-checkbox :disabled="appDisabled('5')" :label="'5'" :key="'5'" class="checkbox-item">FAS系统</el-checkbox>
                  <el-checkbox :disabled="appDisabled('6')" :label="'6'" :key="'6'" class="checkbox-item">FAS系统（仅火警）</el-checkbox>
                  <el-checkbox :disabled="appDisabled('7')" :label="'7'" :key="'7'" class="checkbox-item">水浸监测</el-checkbox>
                  <el-checkbox :disabled="appDisabled('9')" :label="'9'" :key="'9'" class="checkbox-item">水位监测</el-checkbox>
                  <el-checkbox :disabled="appDisabled('10')" :label="'10'" :key="'10'" class="checkbox-item">水压监测</el-checkbox>
                  <el-checkbox :disabled="appDisabled('12')" :label="'12'" :key="'12'" class="checkbox-item">施工管理</el-checkbox>
                  <el-checkbox :disabled="appDisabled('13')" :label="'13'" :key="'13'" class="checkbox-item">NFC巡查</el-checkbox>
                  <el-checkbox :disabled="appDisabled('14')" :label="'14'" :key="'14'" class="checkbox-item">二维码</el-checkbox>
                  <el-checkbox :disabled="appDisabled('16')" :label="'16'" :key="'16'" class="checkbox-item">任务完成审核</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane> -->
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
import { getProjectGroups, addProjectGroups, deleteProjectGroups, editProjectGroups } from '@/api/auth_groups'
import { mapGetters } from 'vuex'
import checkboxItem from './components/checkbox'
export default {
  components: {
    checkboxItem
  },
  directives: { waves },
  data() {
    return {
      size: 'mini',
      // checkedCB接收组件回传的已选中的checkbox数组,属于必填项，属性值设为空即可
      authority: [
        {
          label: '操作日志',
          list: [
            { pid: '10101', label: '查看' }
          ],
          checkedCB: []
        },
        {
          label: '设备管理',
          list: [
            { pid: '10061', label: '查看/导出' },
            { pid: '10062', label: '编辑/导入' }
          ],
          checkedCB: []
        }
      ],
      notification: [
        {
          label: '无线烟感',
          list: [
            { pid: '5111', label: '火灾报警' },
            { pid: '5110', label: '火警恢复' },
            { pid: '5121', label: '防拆报警' },
            { pid: '5120', label: '防拆恢复' },
            { pid: '5131', label: '电量过低' },
            { pid: '5130', label: '电量恢复' }
          ],
          checkedCB: []
        },
        {
          label: '水位监测模块',
          list: [
            { pid: '10111', label: '水位过低' },
            { pid: '10112', label: '水位过高' },
            { pid: '10110', label: '水位恢复' },
            { pid: '10121', label: '电量过低' },
            { pid: '10120', label: '电量恢复' }
          ],
          checkedCB: []
        },
        {
          label: '水压监测模块',
          list: [
            { pid: '10212', label: '水压过低' },
            { pid: '10211', label: '水压过高' },
            { pid: '10210', label: '水压恢复' },
            { pid: '10221', label: '电量过低' },
            { pid: '10220', label: '电量恢复' }
          ],
          checkedCB: []
        },
        {
          label: '水浸监测模块',
          list: [
            { pid: '10311', label: '火灾报警' },
            { pid: '10310', label: '火警恢复' },
            { pid: '10321', label: '电量过低' },
            { pid: '10320', label: '电量恢复' }
          ],
          checkedCB: []
        },
        {
          label: 'AI火灾识别',
          list: [
            { pid: '20111', label: '报警' },
            { pid: '20110', label: '恢复正常' }
          ],
          checkedCB: []
        },
        {
          label: 'AI消防通道',
          list: [
            { pid: '20211', label: '报警' },
            { pid: '20210', label: '恢复正常' }
          ],
          checkedCB: []
        },
        {
          label: 'AI电梯监视',
          list: [
            { pid: '20311', label: '报警' },
            { pid: '20310', label: '恢复正常' }
          ],
          checkedCB: []
        },
        {
          label: 'AI监护',
          list: [
            { pid: '20411', label: '报警' },
            { pid: '20410', label: '恢复正常' }
          ],
          checkedCB: []
        },
        {
          label: 'WIFI烟感',
          list: [
            { pid: '30111', label: '火灾报警' },
            { pid: '30110', label: '火警恢复' }
          ],
          checkedCB: []
        },
        {
          label: '可燃气体探测器',
          list: [
            { pid: '30211', label: '报警' },
            { pid: '30210', label: '恢复正常' }
          ],
          checkedCB: []
        },
        {
          label: '红外双鉴探测器',
          list: [
            { pid: '30311', label: '入侵报警' },
            { pid: '30310', label: '入侵恢复' },
            { pid: '30321', label: '防拆报警' },
            { pid: '30320', label: '防拆恢复' }
          ],
          checkedCB: []
        }
      ],
      companyOptions: [],
      userGroupOptions: [],
      departmentOptions: [],
      allRoles: [],
      disabledRoles: [],
      isEditDialog: false,
      isAddDialog: false,
      isGroupListLoadingShow: false,
      groupList: [],
      multipleSelection: [],
      groupInfoRules: {
        title: [{ required: true, trigger: 'change', message: '请输入新的角色名' }],
        rules: [{ required: false, trigger: 'change', message: '请选择角色赋予的权限' }],
        rules_app: [{ required: false, trigger: 'change', message: '请选择角色赋予的权限' }]
      },
      requestGetGroups: {
        project_id: undefined,
        title: undefined
      },
      isButtonLoadingShow: false,
      dialogVisible: false,
      requestGroup: {
        project_id: undefined,
        company_id: -1,
        department_id: -1,
        group_id: undefined,
        title: undefined,
        rules: [],
        // app_module: [],
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
      return [0, 1].includes(this.Account_Type)
    },
    isDepartmentShow() {
      return [0, 1, 2].includes(this.Account_Type)
    }
  },

  created() {
    this.getAllRoles()
    this.requestGetGroups.company_id = this.company_id
    this.requestGroup.company_id = this.company_id
    if (this.Account_Type === 3) {
      this.requestGetGroups.department_id = this.department_id
      this.requestGroup.department_id = this.department_id
    }
    this.getProjectGroups()
  },
  methods: {
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
      // var arr = this.allRoles
      // var brr = this.roles
      // var temp = []
      // var temparray = []
      // for (let i = 0; i < brr.length; i++) {
      //   temp[brr[i]] = typeof brr[i]
      // }
      // for (let i = 0; i < arr.length; i++) {
      //   var type = typeof arr[i]
      //   if (!temp[arr[i]]) {
      //     temparray.push(arr[i])
      //   } else if (temp[arr[i]].indexOf(type) < 0) {
      //     temparray.push(arr[i])
      //   }
      // }
      // this.disabledRoles = temparray
      this.disabledRoles = []
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
    /**
     * @Description: 关闭角色添加对话框
     * @Date: 2021/8/23
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
      }).catch(err => {
        console.log(err)
        this.isGroupListLoadingShow = false
      })
    },
    /**
     * @Description: 搜索事件
     * @Date: 2019/5/6
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
      // let app_module
      if (info.rules_app !== '') {
        roles_app = info.rules_app.split(',')
      } else {
        roles_app = []
      }
      // if (info.app_module !== '') {
      //   app_module = info.app_module.split(',')
      // } else {
      //   app_module = []
      // }
      this.requestGroup.project_id = this.selected_project_id
      this.requestGroup.group_id = info.group_id
      this.requestGroup.title = info.title
      this.requestGroup.rules = roles
      this.requestGroup.is_web_permit = info.is_web_permit
      this.requestGroup.rules_app = roles_app
      // this.requestGroup.app_module = app_module
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
      this.requestGroup.title = undefined
      this.requestGroup.rules_app = []
      // this.requestGroup.app_module = []
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
     * @Date: 2021/8/23
     **/
    onGroupAdd() {
      this.$refs.formUserGroup.validate(valid => {
        if (valid) {
          // 生成权限数组
          const rules = this.generateRules(this.authority)
          const rules_app = this.generateRules(this.notification)
          // const app_module = this.requestGroup.app_module
          this.isButtonLoadingShow = true
          const addParams = {
            project_id: this.selected_project_id,
            title: this.requestGroup.title,
            note: this.requestGroup.note,
            rules: rules.toString(),
            is_web_permit: this.requestGroup.is_web_permit,
            // app_module: app_module.toString(),
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
     * @Date: 2021/8/23
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
            // company_id: this.requestGroup.company_id,
            // department_id: this.requestGroup.department_id,
            rules: rules.toString(),
            is_web_permit: this.requestGroup.is_web_permit,
            // app_module: this.requestGroup.app_module.toString(),
            rules_app: rules_app.length === 0 ? '' : ',' + rules_app.toString() + ',',
            title: this.requestGroup.title,
            note: this.requestGroup.note
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
