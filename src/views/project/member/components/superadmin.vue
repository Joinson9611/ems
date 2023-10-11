
<template>
  <div style="margin-top: 10px">
    <div>
      <div class="filter-container">
        <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openDialogMemberAdd">添加人员</el-button>
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
          <template slot-scope="scope"><span>{{ scope.$index+ + 1 }} </span></template>
        </el-table-column>
        <el-table-column label="用户姓名" width="120px" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="openDialogMemberEdit(scope.row)"><i>{{ scope.row.nickname }}</i></a>
          </template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ getTime(scope.row.available_time) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="resquestGetMember.page" :limit.sync="resquestGetMember.limit" @pagination="getMemberList" />
    </div>
    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogAddVisible" :append-to-body="true" :close-on-click-modal="false" title="新建成员">
      <el-form ref="formAddCompanyMember" :model="requestAddCompanyMember" :rules="CompanyMemberInfoRules" label-width="120px">
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
        <!--有效时间-->
        <el-form-item label="有效期" class="dialog-form-item" prop="u_available_time">
          <el-date-picker v-model="requestAddCompanyMember.u_available_time" type="datetime" placeholder="请选择有效期"/>
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
        <el-form-item label="有效期" class="dialog-form-item" prop="u_available_time">
          <el-date-picker
            v-model="requestEditCompanyMember.u_available_time"
            :disabled="isTheSameLevel"
            type="datetime"
            value-format="timestamp"
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
import { getAdministrator, addAdministrator, deleteAdministrator, updateAdministrator } from '@/api/users'
import { check_other_char } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  name: 'Member',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
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
        u_note: [{ required: true, trigger: 'change', message: '请输入用户备注' }],
        u_phone: [{ required: true, trigger: 'change', message: '请输入用户手机' }],
        u_available_time: [{ required: true, trigger: 'change', message: '请选择有效期' }]
      },
      accountTypeEditOptions: [],
      isMemberListLoadingShow: false,
      multipleSelection: [],
      memberList: [],
      total: 0,
      resquestGetMember: {
        project_id: undefined
      },

      dialogAddVisible: false,
      isButtonAddLoading: false,
      requestAddCompanyMember: {
        project_id: undefined,
        u_name: undefined,
        u_nickname: undefined,
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
        u_phone: undefined,
        u_note: undefined,
        u_available_time: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'Account_Type',
      'user_id',
      'selected_project_id'
    ])
  },
  created() {
    this.getMemberList()
  },
  methods: {
    /**
     * @Description: 获取人员列表
     * @Date: 2019/5/6
     **/
    getMemberList() {
      this.resquestGetMember.project_id = this.selected_project_id
      this.isMemberListLoadingShow = true
      getAdministrator(this.resquestGetMember).then(response => {
        this.memberList = response.data.items
        this.total = response.data.total
        this.isMemberListLoadingShow = false
      }).catch(err => {
        console.log(err)
        this.isMemberListLoadingShow = false
      })
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
    openDialogMemberEdit(info) {
      this.dialogEditVisible = true
      this.requestEditCompanyMember.u_id = info.user_id
      this.requestEditCompanyMember.u_name = info.name
      this.requestEditCompanyMember.u_nickname = info.nickname
      this.requestEditCompanyMember.u_note = info.note
      this.requestEditCompanyMember.u_phone = info.phone
      this.requestEditCompanyMember.u_available_time = info.available_time * 1000
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
          updateAdministrator(params).then(() => {
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
        const params = {
          project_id: this.selected_project_id,
          u_id_list: this.multipleSelection.map(item => item.user_id)
        }
        deleteAdministrator(params).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getMemberList()
        })
      })
    },
    /**
     * @Description: 打开成员添加对话框
     * @Date: 2019/5/6
     **/
    openDialogMemberAdd() {
      if (this.$refs.formAddCompanyMember !== undefined) this.$refs.formAddCompanyMember.resetFields()
      this.requestAddCompanyMember.name = undefined
      this.requestAddCompanyMember.nickname	 = undefined

      this.requestAddCompanyMember.phone = undefined
      this.requestAddCompanyMember.note = undefined
      this.requestAddCompanyMember.available_time = undefined
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
          addAdministrator(params).then(() => {
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
    }
  }
}
</script>

