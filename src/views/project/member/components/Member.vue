<template>
  <div style="margin-top: 10px">
    <div>
      <div class="filter-container">
        <el-button v-waves :size="size" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openDialogMemberAdd">添加人员</el-button>
        <!--删除按钮-->
        <el-button v-waves :size="size" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onDeleteMembers">删除人员</el-button>
      </div>
      <el-table
        v-loading="isMemberListLoadingShow"
        :data="memberList"
        element-loading-text="加载中"
        style="width:100%;"
        fit
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center"
          width="50"/>
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope"><span>{{ scope.$index+(resquestGetMember.page - 1) * resquestGetMember.limit + 1 }} </span></template>
        </el-table-column>
        <el-table-column label="用户姓名" width="120px" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="openDialogMemberEdit(scope.row.user_id)"><i>{{ scope.row.nickname }}</i></a>
          </template>
        </el-table-column>
        <el-table-column label="用户账号" width="120px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.group_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ getTime(scope.row.available_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="密码重置" align="center" >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="resetPassword(scope.row)">重置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--页码导航-->
      <pagination v-show="total>0" :total="total" :page.sync="resquestGetMember.page" :limit.sync="resquestGetMember.limit" @pagination="getMemberList" />
    </div>

    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogAddVisible" :append-to-body="true" :close-on-click-modal="false" title="新建成员">
      <el-form ref="formAddCompanyMember" :model="requestAddCompanyMember" :rules="CompanyMemberInfoRules" label-width="120px">
        <!--单位名称-->
        <el-form-item label="用户姓名" class="dialog-form-item" prop="u_nickname">
          <el-input v-model="requestAddCompanyMember.u_nickname" type="text"/>
        </el-form-item>
        <el-form-item label="用户账号" class="dialog-form-item" prop="u_name">
          <el-input v-model="requestAddCompanyMember.u_name" type="text"/>
        </el-form-item>
        <el-form-item label="用户手机" class="dialog-form-item" prop="u_phone">
          <el-input v-model="requestAddCompanyMember.u_phone" type="text"/>
        </el-form-item>
        <el-form-item label="用户备注" class="dialog-form-item" prop="u_note">
          <el-input v-model="requestAddCompanyMember.u_note" type="textarea"/>
        </el-form-item>
        <el-form-item label="角色权限" class="dialog-form-item" prop="group_id">
          <el-select v-model="requestAddCompanyMember.group_id" placeholder="请选择角色权限">
            <el-option v-for="item in userGroupOptions" :key="item.group_id" :label="item.title" :value="item.group_id"/>
          </el-select>
        </el-form-item>
        <!--有效时间-->
        <el-form-item label="有效期" class="dialog-form-item" prop="u_available_time">
          <el-date-picker v-model="requestAddCompanyMember.u_available_time" value-format="timestamp" type="date" placeholder="请选择有效期"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogMemberAdd">取消</el-button>
        <el-button v-waves :loading="isButtonAddLoading" type="primary" @click.native="onMemberAdd">确定</el-button>
      </div>
    </el-dialog>

    <!--弹出编辑窗口-->
    <el-dialog :visible.sync="dialogEditVisible" :append-to-body="true" :close-on-click-modal="false" title="编辑">
      <el-form ref="formEditCompanyMember" :model="requestEditCompanyMember" :rules="CompanyMemberInfoRules" label-width="120px">
        <!--单位名称-->
        <el-form-item label="用户姓名" class="dialog-form-item" prop="u_nickname">
          <el-input v-model="requestEditCompanyMember.u_nickname" :disabled="isTheSameLevel" type="text"/>
        </el-form-item>
        <el-form-item label="用户账号" class="dialog-form-item" prop="u_name">
          <el-input v-model="requestEditCompanyMember.u_name" disabled type="text"/>
        </el-form-item>
        <el-form-item label="用户手机" class="dialog-form-item" prop="u_phone">
          <el-input v-model="requestEditCompanyMember.u_phone" :disabled="isTheSameLevel" type="text"/>
        </el-form-item>
        <el-form-item label="用户备注" class="dialog-form-item" prop="u_note">
          <el-input v-model="requestEditCompanyMember.u_note" :disabled="isTheSameLevel" type="textarea"/>
        </el-form-item>
        <el-form-item label="角色权限" class="dialog-form-item" prop="group_id">
          <el-select v-model="requestEditCompanyMember.group_id" :disabled="isTheSameLevel" placeholder="请选择角色权限">
            <el-option v-for="item in userGroupOptions" :key="item.group_id" :label="item.title" :value="item.group_id"/>
          </el-select>
        </el-form-item>
        <!--有效时间-->
        <el-form-item label="有效期" class="dialog-form-item" prop="u_available_time">
          <el-date-picker v-model="requestEditCompanyMember.u_available_time" :disabled="isTheSameLevel" value-format="timestamp" type="date" placeholder="请选择有效期"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogMemberEdit">取消</el-button>
        <el-button v-waves :loading="isButtonEditLoading" type="primary" @click.native="onMemberEdit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Formattimestamp } from '@/utils/time'
import { getUserList, addUser, getUserDetail, deleteUser, updateUser } from '@/api/users'
import { check_other_char } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getProjectUserGroups } from '@/api/auth_groups'
import md5 from '@/utils/md5'
export default {
  name: 'Member',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      size: 'mini',
      AccountTypeStyle: [
        'danger',
        'danger',
        'warning',
        '',
        'info'
      ],
      AccountTypeText: [
        '后台管理员',
        '超级管理员',
        '单位管理员',
        '部门管理员',
        '普通账号'
      ],
      CompanyMemberInfoRules: {
        u_name: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          if (value === undefined || value === '') {
            callback(new Error('请输入用户账号'))
          } else {
            if (check_other_char(value)) {
              callback(new Error('用户名不能包含特殊符号'))
            } else {
              callback()
            }
          }
        } },
        { trigger: 'blur', validator: (rule, value, callback) => {
          if (value === undefined || value === '') {
            callback(new Error('请输入用户账号'))
          } else {
            if (value.length < 3 || value.length > 32) {
              callback(new Error('用户账号长度不能小于3或大于32'))
            } else {
              callback()
            }
          }
        } }
        ],
        u_nickname: [{ required: true, trigger: 'change', message: '请输入用户姓名' }],
        // u_level: [{ required: true, trigger: 'change', message: '请选择账号类型' }],
        // company_id: [{ required: true, trigger: 'change', message: '请选择所属单位' }],
        u_note: [{ required: true, trigger: 'change', message: '请输入用户备注' }],
        // department_id: [{ required: true, trigger: 'change', message: '请选择所属部门' }],
        u_phone: [{ required: true, trigger: 'change', message: '请输入用户手机' }],
        u_available_time: [{ required: true, trigger: 'change', message: '请选择有效期' }],
        group_id: [{ required: true, trigger: 'change', message: '请选择角色权限' }]
      },
      userGroupOptions: [],
      accountTypeEditOptions: [],
      isMemberListLoadingShow: false,
      multipleSelection: [],
      memberList: [],
      total: 0,
      resquestGetMember: {
        project_id: undefined,
        page: 1,
        limit: 20
      },

      dialogAddVisible: false,
      isButtonAddLoading: false,
      requestAddCompanyMember: {
        project_id: undefined,
        u_name: undefined,
        u_nickname: undefined,
        group_id: undefined,
        u_phone: undefined,
        u_note: undefined,
        u_available_time: undefined
      },

      dialogEditVisible: false,
      isButtonEditLoading: false,
      requestEditCompanyMember: {
        project_id: undefined,
        u_id: undefined,
        u_name: undefined,
        u_nickname: undefined,
        group_id: undefined,
        u_phone: undefined,
        u_note: undefined,
        u_available_time: undefined
      }
    }
  },
  computed: {
    isTheSameLevel() {
      return this.requestEditCompanyMember.u_level === this.Account_Type
    },
    ...mapGetters([
      'Account_Type',
      'user_id',
      'selected_project_id'
    ]),
    AccountTypeOptions: function() {
      const id = this.Account_Type
      if ([0, 1].includes(id)) {
        return this.AccountType_1_Options
      } else if (id === 2) {
        return this.AccountType_2_Options
      } else if (id === 3) {
        return this.AccountType_3_Options
      } else {
        return []
      }
    }

  },
  created() {
    this.getUserRolesGroups()
    this.getMemberList()
  },
  methods: {
    /**
     * @Description: 获取当前项目的权限角色
     * @Date: 2021/8/23
     **/
    getUserRolesGroups() {
      const params = {
        project_id: this.selected_project_id
      }
      getProjectUserGroups(params).then(respones => {
        this.userGroupOptions = respones.data.items
      }).catch(err => {
        console.log(err)
      })
    },
    companySelect(id) {
      this.resquestGetMember.company_id = id
      this.resquestGetMember.department_id = -1
      this.getDepartmentsByCompany2(id)
      this.getMemberList()
    },
    /**
     * @Description: 获取人员列表
     * @Date: 2021/8/23
     **/
    getMemberList() {
      this.resquestGetMember.project_id = this.selected_project_id
      this.isMemberListLoadingShow = true
      getUserList(this.resquestGetMember).then(response => {
        this.memberList = response.data.items
        this.total = response.data.total
        this.isMemberListLoadingShow = false
      }).catch(err => {
        console.log(err)
        this.isMemberListLoadingShow = false
      })
    },
    /**
     * @Description: 返回用户类型样式
     * @Date: 2021/8/23
     **/
    getAccountTypeStyle(type) {
      return this.AccountTypeStyle[type]
    },
    /**
     * @Description: 返回用户类型文本
     * @Date: 2021/8/23
     **/
    getAccountTypeText(type) {
      return this.AccountTypeText[type]
    },
    /**
     * @Description: 判断数组中是否保护xxitem
     * @Date: 2021/8/23
     **/
    contains(element, array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
          return true
        }
      }
      return false
    },
    /**
     * @Description: 列表勾选回调
     * @Date: 2021/8/23
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 打开成员编辑对话框
     * @Date: 2021/8/23
     **/
    openDialogMemberEdit(u_id) {
      getUserDetail({ u_id, project_id: this.selected_project_id }).then(res => {
        const info = res.data
        this.requestEditCompanyMember.u_id = info.user_id
        this.requestEditCompanyMember.group_id = info.group_id * 1
        this.requestEditCompanyMember.u_name = info.name
        this.requestEditCompanyMember.u_nickname = info.nickname
        this.requestEditCompanyMember.u_phone = info.phone
        this.requestEditCompanyMember.u_note = info.note
        this.requestEditCompanyMember.u_available_time = info.available_time * 1000
        this.dialogEditVisible = true
      })
    },
    /**
     * @Description: 关闭成员编辑对话框
     * @Date: 2021/8/23
     **/
    closeDialogMemberEdit() {
      this.dialogEditVisible = false
    },
    /**
     * @Description: 成员编辑事件
     * @Date: 2021/8/23
     **/
    onMemberEdit() {
      this.requestEditCompanyMember.project_id = this.selected_project_id
      this.$refs.formEditCompanyMember.validate(valid => {
        if (valid) {
          this.isButtonEditLoading = true
          this.requestEditCompanyMember.u_available_time = parseInt(this.requestEditCompanyMember.u_available_time / 1000)
          updateUser(this.requestEditCompanyMember).then(() => {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.isButtonEditLoading = false
            this.dialogEditVisible = false
            this.getMemberList()
          }).catch(err => {
            console.log(err)
            this.isButtonEditLoading = false
          })
        }
      })
    },
    /**
     * @Description: 删除指定成员
     * @Date: 2021/8/23
     **/
    onDeleteMembers() {
      this.$confirm('确认删除选中用户吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const requestDeleteParams = {
          project_id: this.selected_project_id,
          u_id_list: this.multipleSelection.map(item => item.user_id)
        }
        if (!this.contains(Number(this.user_id), requestDeleteParams.u_id_list)) {
          const levelList = this.multipleSelection.map(item => item.level)
          if (this.contains(1, levelList) && this.Account_Type !== 0) {
            this.$message({
              message: '不能删除超级管理员的账号',
              type: 'warning'
            })
          } else {
            deleteUser(requestDeleteParams).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getMemberList()
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          this.$message({
            message: '不能删除自己的账号',
            type: 'warning'
          })
        }
      })
    },
    /**
     * @Description: 打开成员添加对话框
     * @Date: 2021/8/23
     **/
    openDialogMemberAdd() {
      if (this.$refs.formAddCompanyMember !== undefined) this.$refs.formAddCompanyMember.resetFields()
      this.requestAddCompanyMember.u_name = undefined
      this.requestAddCompanyMember.u_nickname	 = undefined
      this.requestAddCompanyMember.group_id = undefined
      this.requestAddCompanyMember.u_phone = undefined
      this.requestAddCompanyMember.u_note = undefined
      this.requestAddCompanyMember.u_available_time = undefined
      this.dialogAddVisible = true
    },
    /**
     * @Description: 关闭成员添加对话框
     * @Date: 2021/8/23
     **/
    closeDialogMemberAdd() {
      this.dialogAddVisible = false
    },
    /**
     * @Description: 成员添加事件
     * @Date: 2021/8/23
     **/
    onMemberAdd() {
      this.requestAddCompanyMember.project_id = this.selected_project_id
      this.$refs.formAddCompanyMember.validate(valid => {
        if (valid) {
          this.isButtonAddLoading = true
          this.requestAddCompanyMember.u_available_time = parseInt(this.requestAddCompanyMember.u_available_time / 1000)
          addUser(this.requestAddCompanyMember).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功！'
            })
            this.isButtonAddLoading = false
            this.dialogAddVisible = false
            this.getMemberList()
          }).catch(err => {
            console.log(err)
            this.isButtonAddLoading = false
          })
        }
      })
    },
    /**
     * @Description: 事件格式转换
     * @Date: 2021/8/23
     **/
    getTime(time) {
      return Formattimestamp(time)
    },
    resetPassword(info) {
      if (this.requestEditCompanyMember.u_level === this.Account_Type) {
        this.$message({
          message: '不能重置与自己同一级别的账号',
          type: 'warning'
        })
      } else {
        this.$confirm('确认将该账号密码重置为“888888”？', '提示', {
          type: 'warning'
        }).then(() => {
          const params = {
            project_id: this.selected_project_id,
            company_id: info.company_id,
            department_id: info.department_id,
            u_level: info.level,
            u_id: info.user_id,
            u_new_password: md5.hexMD5('888888' + 'fiot_salt')
          }
          updateUser(params).then(() => {
            this.$message({
              message: '密码重置成功',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
          })
        })
      }
    }
  }
}
</script>

