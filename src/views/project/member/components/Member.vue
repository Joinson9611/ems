<template>
  <div style="margin-top: 10px">
    <div>
      <div class="filter-container">
        <!-- <el-input v-model="tempFilterOptions.company_name" placeholder="单位名称" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch"/>
        <el-input v-model="tempFilterOptions.department_name" placeholder="部门名称" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch"/>
        <el-input v-model="tempFilterOptions.u_nickname	" placeholder="用户姓名" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch"/>
        <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button> -->
        <!--新建按钮-->
        <el-select v-if="isCompanyShow" v-model="resquestGetMember.company_id" placeholder="单位" style="width: 200px" class="filter-item" @change="companySelect">
          <el-option v-for="item in companyFilterOptions" :key="item.company_id" :label="item.name" :value="item.company_id"/>
        </el-select>
        <el-select v-if="isDepartmentShow" v-model="resquestGetMember.department_id" placeholder="部门" style="width: 200px" class="filter-item" @change="departmentSelect">
          <el-option v-for="item in departmentFilterOptions" :key="item.department_id" :label="item.name" :value="item.department_id"/>
        </el-select>
        <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openDialogMemberAdd">添加人员</el-button>
        <!--删除按钮-->
        <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onDeleteMembers">删除人员</el-button>
      </div>
      <el-table
        v-loading="isMemberListLoadingShow"
        :data="memberList"
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
            <span>{{ scope.row.name }}</span>
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
        <el-table-column label="用户电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="账号类型" align="center" width="120px">
          <template slot-scope="scope">
            <el-tag :type="getAccountTypeStyle(scope.row.level)">{{ getAccountTypeText(scope.row.level) }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="角色" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.group_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="120" align="center">
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
        <!--单位-->
        <el-form-item v-if="isCompanyShow" label="所属单位" class="dialog-form-item" prop="company_id">
          <el-select v-model="requestAddCompanyMember.company_id" filterable placeholder="请选择单位">
            <el-option v-for="item in companyOptions" :key="item.company_id" :label="item.name" :value="item.company_id"/>
          </el-select>
        </el-form-item>
        <!--单位-->
        <el-form-item v-if="isDepartmentShow" label="所属部门" class="dialog-form-item" prop="department_id">
          <el-select v-model="requestAddCompanyMember.department_id" filterable placeholder="请选择部门" @change="departmentChange">
            <el-option v-for="item in departmentOptions" :key="item.department_id" :label="item.name" :value="item.department_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户手机" class="dialog-form-item" prop="u_phone">
          <el-input v-model="requestAddCompanyMember.u_phone" type="text"/>
        </el-form-item>
        <el-form-item label="用户备注" class="dialog-form-item" prop="u_note">
          <el-input v-model="requestAddCompanyMember.u_note" type="textarea"/>
        </el-form-item>
        <el-form-item label="账号类型" class="dialog-form-item" prop="u_level">
          <el-select v-model="requestAddCompanyMember.u_level" placeholder="请选择账号类型">
            <el-option v-for="item in AccountTypeOptions" :key="item.u_level" :label="item.name" :value="item.u_level"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色权限" class="dialog-form-item" prop="group_id">
          <el-select v-model="requestAddCompanyMember.group_id" placeholder="请选择角色权限">
            <el-option v-for="item in userGroupOptions" :key="item.group_id" :label="item.name" :value="item.group_id"/>
          </el-select>
        </el-form-item>
        <!--有效时间-->
        <el-form-item label="有效期" class="dialog-form-item" prop="u_available_time">
          <el-date-picker
            v-model="requestAddCompanyMember.u_available_time"
            type="datetime"
            value-format="timestamp"
            placeholder="请选择有效期"/>
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
        <!--单位-->
        <el-form-item label="所属单位" class="dialog-form-item" prop="company_id">
          <el-select v-model="requestEditCompanyMember.company_id" :disabled="!isCompanyShow || isTheSameLevel" filterable placeholder="请选择单位">
            <el-option v-for="item in companyOptions" :key="item.company_id" :label="item.name" :value="item.company_id"/>
          </el-select>
        </el-form-item>
        <!--单位-->
        <el-form-item label="所属部门" class="dialog-form-item" prop="department_id">
          <el-select v-model="requestEditCompanyMember.department_id" :disabled="!isDepartmentShow || isTheSameLevel" filterable placeholder="请选择部门">
            <el-option v-for="item in departmentOptions" :key="item.department_id" :label="item.name" :value="item.department_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户手机" class="dialog-form-item" prop="u_phone">
          <el-input v-model="requestEditCompanyMember.u_phone" :disabled="isTheSameLevel" type="text"/>
        </el-form-item>
        <el-form-item label="用户备注" class="dialog-form-item" prop="u_note">
          <el-input v-model="requestEditCompanyMember.u_note" :disabled="isTheSameLevel" type="textarea"/>
        </el-form-item>
        <el-form-item label="账号类型" class="dialog-form-item" prop="u_level">
          <el-select v-model="requestEditCompanyMember.u_level" :disabled="isTheSameLevel" placeholder="请选择账号类型" @change="departmentChange">
            <el-option v-for="item in accountTypeEditOptions" :disabled="item.disabled" :key="item.u_level" :label="item.name" :value="item.u_level"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色权限" class="dialog-form-item" prop="group_id">
          <el-select v-model="requestEditCompanyMember.group_id" :disabled="isTheSameLevel" placeholder="请选择角色权限">
            <el-option v-for="item in userGroupOptions" :key="item.group_id" :label="item.name" :value="item.group_id"/>
          </el-select>
        </el-form-item>
        <!--有效时间-->
        <el-form-item label="有效期" class="dialog-form-item" prop="u_available_time">
          <el-date-picker
            v-model="requestEditCompanyMember.u_available_time"
            :disabled="isTheSameLevel"
            value-format="timestamp"
            type="datetime"
            placeholder="请选择有效期"/>
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
import { getProjectCompany } from '@/api/company'
import { getDepartmentsByCompany } from '@/api/departments'
import { getCompanyMembers, addCompanyMember, getUsersInfo, deleteCompanyMember, editCompanyMember } from '@/api/users'
import { check_other_char } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getProjectUserGroups } from '@/api/authgroups'
import md5 from '@/utils/md5'
export default {
  name: 'Member',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      AccountType_1_Options: [
        { u_level: 12, name: '单位管理员' },
        { u_level: 13, name: '部门管理员' },
        { u_level: 14, name: '普通账号' }
      ],
      AccountType_2_Options: [
        { u_level: 13, name: '部门管理员' },
        { u_level: 14, name: '普通账号' }
      ],
      AccountType_3_Options: [
        { u_level: 14, name: '普通账号' }
      ],
      AccountTypeEditOption: [
        { u_level: 12, name: '单位管理员', disabled: false },
        { u_level: 13, name: '部门管理员', disabled: false },
        { u_level: 14, name: '普通账号', disabled: false }
      ],
      AccountTypeEditOption1: [
        { u_level: 12, name: '单位管理员', disabled: false },
        { u_level: 13, name: '部门管理员', disabled: false },
        { u_level: 14, name: '普通账号', disabled: false }
      ],
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
        u_level: [{ required: true, trigger: 'change', message: '请选择账号类型' }],
        company_id: [{ required: true, trigger: 'change', message: '请选择所属单位' }],
        u_note: [{ required: true, trigger: 'change', message: '请输入用户备注' }],
        department_id: [{ required: true, trigger: 'change', message: '请选择所属部门' }],
        u_phone: [{ required: true, trigger: 'change', message: '请输入用户手机' }],
        u_available_time: [{ required: true, trigger: 'change', message: '请选择有效期' }],
        group_id: [{ required: true, trigger: 'change', message: '请选择角色权限' }]
      },
      companyFilterOptions: [{ company_id: -1, name: '全部单位' }],
      companyOptions: [],
      userGroupOptions: [],
      departmentFilterOptions: [{ department_id: -1, name: '全部部门' }],
      departmentOptions: [],
      accountTypeEditOptions: [],
      isMemberListLoadingShow: false,
      multipleSelection: [],
      memberList: [],
      total: 0,
      resquestGetMember: {
        project_id: undefined,
        company_id: -1,
        department_id: -1,
        company_name: undefined,
        department_name: undefined,
        page: 1,
        limit: 20
      },

      dialogAddVisible: false,
      isButtonAddLoading: false,
      requestAddCompanyMember: {
        project_id: undefined,
        u_name: undefined,
        u_nickname: undefined,
        u_level: undefined,
        group_id: undefined,
        company_id: undefined,
        department_id: undefined,
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
        u_level: undefined,
        company_id: undefined,
        group_id: undefined,
        department_id: undefined,
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
      'selected_project_id',
      'company_id',
      'department_id'
    ]),
    isCompanyShow() {
      return [1, 2, 10, 11].includes(this.Account_Type)
    },
    isDepartmentShow() {
      return [1, 2, 10, 11, 12].includes(this.Account_Type)
    },
    AccountTypeOptions: function() {
      const id = this.Account_Type
      if ([1, 2, 10, 11].includes(id)) {
        return this.AccountType_1_Options
      } else if (id === 12) {
        return this.AccountType_2_Options
      } else if (id === 13) {
        return this.AccountType_3_Options
      } else {
        return []
      }
    }

  },
  watch: {
    'requestEditCompanyMember.company_id': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal && curVal !== '' && curVal !== undefined) {
          this.departmentOptions = undefined
          this.getDepartmentsByCompany(curVal)
        }
      },
      deep: true,
      immediate: true
    },
    'requestAddCompanyMember.company_id': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal && curVal !== '' && curVal !== undefined) {
          this.departmentOptions = undefined
          this.getDepartmentsByCompany(curVal)
        }
      },
      deep: true,
      immediate: true
    },
    'requestAddCompanyMember.group_id': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal && curVal !== '' && curVal !== undefined) {
          this.userGroupOptions = []
          this.getUserRolesGroups(curVal)
        }
      },
      deep: true,
      immediate: true
    },
    'requestEditCompanyMember.group_id': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal && curVal !== '' && curVal !== undefined) {
          this.userGroupOptions = []
          this.getUserRolesGroups(curVal)
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.selectDisable()
    this.resquestGetMember.company_id = this.company_id
    if ([13].includes(this.Account_Type)) {
      this.resquestGetMember.department_id = this.department_id
      this.requestAddCompanyMember.department_id = this.department_id
      this.requestEditCompanyMember.department_id = this.department_id
    }
    this.requestAddCompanyMember.company_id = this.company_id
    this.requestEditCompanyMember.company_id = this.company_id
    this.getMemberList()
    this.getCompanyList()
    this.getDepartmentList()
  },
  methods: {
    departmentChange(id) {
      console.log(123)
      this.getUserRolesGroups(id)
    },
    selectDisable() {
      const id = this.Account_Type
      if (id === 12) {
        this.AccountTypeEditOption1[0].disabled = true
        this.accountTypeEditOptions = this.AccountTypeEditOption1
      } else if (id === 13) {
        this.AccountTypeEditOption1[0].disabled = true
        this.AccountTypeEditOption1[1].disabled = true
        this.accountTypeEditOptions = this.AccountTypeEditOption1
      } else {
        this.accountTypeEditOptions = this.AccountTypeEditOption
      }
    },
    /**
     * @Description: 获取所属部门的权限角色
     * @Date: 2019/5/6
     **/
    getUserRolesGroups(id) {
      const params = {
        project_id: this.selected_project_id,
        department_id: id
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
    departmentSelect(id) {
      this.resquestGetMember.department_id = id
      this.getMemberList()
    },
    getCompanyList() {
      getProjectCompany({ project_id: this.selected_project_id }).then(res => {
        this.companyFilterOptions = this.companyFilterOptions.concat(res.data.items)
        this.companyOptions = res.data.items
      }).catch(() => {

      })
    },
    getDepartmentList() {
      getDepartmentsByCompany({ company_id: this.resquestGetMember.company_id }).then(res => {
        this.departmentFilterOptions = this.departmentFilterOptions.concat(res.data)
        this.departmentOptions = res.data
      }).catch(() => {

      })
    },
    /**
     * @Description: 获取人员列表
     * @Date: 2019/5/6
     **/
    getMemberList() {
      this.resquestGetMember.project_id = this.selected_project_id
      this.isMemberListLoadingShow = true
      getCompanyMembers(this.resquestGetMember).then(response => {
        this.memberList = response.data.items
        this.total = response.data.total
        this.isMemberListLoadingShow = false
      }).catch(err => {
        console.log(err)
        this.isMemberListLoadingShow = false
      })
    },
    /**
     * @Description: 根据单位获取部门列表
     * @Date: 2019/5/6
     **/
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
     * @Description: 返回用户类型样式
     * @Date: 2019/5/6
     **/
    getAccountTypeStyle(type) {
      return this.AccountTypeStyle[type]
    },
    /**
     * @Description: 返回用户类型文本
     * @Date: 2019/5/6
     **/
    getAccountTypeText(type) {
      return this.AccountTypeText[type]
    },
    /**
     * @Description: 判断数组中是否保护xxitem
     * @Date: 2019/5/6
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
     * @Date: 2019/5/6
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 打开成员编辑对话框
     * @Date: 2019/5/6
     **/
    openDialogMemberEdit(u_id) {
      getUsersInfo({ u_id, project_id: this.selected_project_id }).then(res => {
        const info = res.data
        this.requestEditCompanyMember.u_id = info.user_id
        this.requestEditCompanyMember.group_id = info.group_id * 1
        this.requestEditCompanyMember.u_name = info.name
        this.requestEditCompanyMember.u_nickname = info.nickname
        this.requestEditCompanyMember.u_level = info.level
        this.requestEditCompanyMember.company_id = info.company_id
        this.requestEditCompanyMember.department_id = info.department_id
        this.requestEditCompanyMember.u_phone = info.phone
        this.requestEditCompanyMember.u_note = info.note
        this.requestEditCompanyMember.u_available_time = info.available_time * 1000
        this.dialogEditVisible = true
      })
    },
    /**
     * @Description: 关闭成员编辑对话框
     * @Date: 2019/5/6
     **/
    closeDialogMemberEdit() {
      this.dialogEditVisible = false
    },
    /**
     * @Description: 成员编辑事件
     * @Date: 2019/5/6
     **/
    onMemberEdit() {
      this.requestEditCompanyMember.project_id = this.selected_project_id
      this.$refs.formEditCompanyMember.validate(valid => {
        if (valid) {
          this.isButtonEditLoading = true
          const params = Object.assign({}, this.requestEditCompanyMember)
          params.u_available_time = params.u_available_time / 1000
          editCompanyMember(params).then(() => {
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
     * @Date: 2019/5/6
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
            deleteCompanyMember(requestDeleteParams).then(() => {
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
     * @Date: 2019/5/6
     **/
    openDialogMemberAdd() {
      if (this.$refs.formAddCompanyMember !== undefined) this.$refs.formAddCompanyMember.resetFields()
      this.requestAddCompanyMember.u_name = undefined
      this.requestAddCompanyMember.u_nickname	 = undefined
      this.requestAddCompanyMember.group_id = undefined
      this.requestAddCompanyMember.u_level = undefined
      if ([0, 1].includes(this.Account_Type)) { this.requestAddCompanyMember.company_id = undefined }
      if ([0, 1, 2].includes(this.Account_Type)) { this.requestAddCompanyMember.department_id = undefined }
      this.requestAddCompanyMember.u_phone = undefined
      this.requestAddCompanyMember.u_note = undefined
      this.requestAddCompanyMember.u_available_time = undefined
      this.dialogAddVisible = true
    },
    /**
     * @Description: 关闭成员添加对话框
     * @Date: 2019/5/6
     **/
    closeDialogMemberAdd() {
      this.dialogAddVisible = false
    },
    /**
     * @Description: 成员添加事件
     * @Date: 2019/5/6
     **/
    onMemberAdd() {
      this.requestAddCompanyMember.project_id = this.selected_project_id
      this.$refs.formAddCompanyMember.validate(valid => {
        if (valid) {
          this.isButtonAddLoading = true
          const params = Object.assign({}, this.requestAddCompanyMember)
          params.u_available_time = params.u_available_time / 1000
          addCompanyMember(params).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功'
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
     * @Date: 2019/5/6
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
            u_new_password: md5.hexMD5('888888' + 'alarm_salt')
          }
          editCompanyMember(params).then(() => {
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

