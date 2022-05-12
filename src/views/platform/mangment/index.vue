<template>
  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input :size="size" v-model="tempFilterOptions.nickname" placeholder="请输入用户姓名" clearable style="width: 190px;" class="filter-item" @keyup.enter.native="onSearch"/>
        <el-select :size="size" v-model="tempFilterOptions.level" placeholder="用户等级" style="width: 120px" class="filter-item" clearable >
          <el-option v-for="item in levelOptions" :key="item.level" :label="item.type" :value="item.level"/>
        </el-select>
        <el-button :size="size" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
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
        <el-table-column label="用户备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.note }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户等级" align="center">
          <template slot-scope="scope">
            <span>{{ getLevelType(scope.row.level) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ getTime(scope.row.available_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isBindProject"
          align="center"
          label="操作"
          width="130"
          fixed="right"
        >
          <template slot-scope="scope" class="tab-btn">
            <el-button
              :disabled="isDisabled(scope.row.level)"
              class="btn"
              type="primary"
              size="mini"
              @click="userProjectOpen(scope.row)"
            >
              项目绑定
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--页码导航-->
      <pagination v-show="total>0" :total="total" :page.sync="resquestGetMember.page" :limit.sync="resquestGetMember.limit" @pagination="getMemberList" />
    </div>
    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogAddVisible" :append-to-body="true" :close-on-click-modal="false" title="新建成员">
      <el-form ref="formAddCompanyMember" :model="requestAddMember" :rules="MemberInfoRules" label-width="120px">
        <!--单位名称-->
        <el-form-item label="用户姓名" class="dialog-form-item" prop="u_nickname">
          <el-input v-model="requestAddMember.u_nickname" type="text"/>
        </el-form-item>
        <el-form-item label="用户账号" class="dialog-form-item" prop="u_name">
          <el-input v-model="requestAddMember.u_name" type="text"/>
        </el-form-item>
        <el-form-item label="用户手机" class="dialog-form-item" prop="u_phone">
          <el-input v-model="requestAddMember.u_phone" type="text"/>
        </el-form-item>
        <el-form-item label="用户备注" class="dialog-form-item" prop="u_note">
          <el-input v-model="requestAddMember.u_note" type="textarea"/>
        </el-form-item>
        <el-form-item label="用户等级" class="dialog-form-item" prop="u_level">
          <el-select v-model="requestAddMember.u_level" placeholder="请选择用户等级">
            <el-option v-for="item in levelOptions" :key="item.level" :label="item.type" :value="item.level"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="isSelectModule(requestAddMember.u_level)" :size="size" label="功能模块" class="dialog-form-item" prop="u_module_list">
          <div class="checkbox">
            <el-checkbox-group v-model="requestAddMember.u_module_list">
              <el-checkbox v-for="item in deviceTypeOptions" :key="item.device_type_id" :label="item.device_type_id">{{ item.device_type }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item> -->
        <!--有效时间-->
        <el-form-item label="有效期" class="dialog-form-item" prop="u_available_time">
          <el-date-picker v-model="requestAddMember.u_available_time" value-format="timestamp" type="date" placeholder="请选择有效期"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogMemberAdd">取消</el-button>
        <el-button v-waves :loading="isButtonAddLoading" type="primary" @click.native="onMemberAdd">确定</el-button>
      </div>
    </el-dialog>

    <!--弹出编辑窗口-->
    <el-dialog :visible.sync="dialogEditVisible" :append-to-body="true" :close-on-click-modal="false" title="编辑">
      <el-form ref="formEditCompanyMember" :model="requestEditMember" :rules="MemberInfoRules" label-width="120px">
        <!--单位名称-->
        <el-form-item label="用户姓名" class="dialog-form-item" prop="u_nickname">
          <el-input v-model="requestEditMember.u_nickname" type="text"/>
        </el-form-item>
        <el-form-item label="用户账号" class="dialog-form-item" prop="u_name">
          <el-input v-model="requestEditMember.u_name" type="text"/>
        </el-form-item>
        <el-form-item label="用户手机" class="dialog-form-item" prop="u_phone">
          <el-input v-model="requestEditMember.u_phone" type="text"/>
        </el-form-item>
        <el-form-item label="用户备注" class="dialog-form-item" prop="u_note">
          <el-input v-model="requestEditMember.u_note" type="textarea"/>
        </el-form-item>
        <el-form-item label="用户等级" class="dialog-form-item" prop="u_level">
          <el-select v-model="requestEditMember.u_level" placeholder="请选择用户等级">
            <el-option v-for="item in levelOptions" :key="item.level" :label="item.type" :value="item.level"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="isSelectModule(requestEditMember.u_level)" :size="size" label="功能模块" class="dialog-form-item" prop="u_module_list">
          <div class="checkbox">
            <el-checkbox-group v-model="requestEditMember.u_module_list">
              <el-checkbox v-for="item in deviceTypeOptions" :key="item.device_type_id" :label="item.device_type_id">{{ item.device_type }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item> -->
        <!--有效时间-->
        <el-form-item label="有效期" class="dialog-form-item" prop="u_available_time">
          <el-date-picker v-model="requestEditMember.u_available_time" value-format="timestamp" type="date" placeholder="请选择有效期"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogMemberEdit">取消</el-button>
        <el-button v-waves :loading="isButtonEditLoading" type="primary" @click.native="onMemberEdit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 用户绑定项目对话框 -->
    <el-dialog :visible.sync="isUserProShow" :append-to-body="true" :close-on-click-modal="false" title="绑定项目" @close="closeDialigProject">
      <el-dialog :visible.sync="isProjectShow" :append-to-body="true" :close-on-click-modal="false" title="项目列表">
        <div class="filter-container">
          <el-input :size="size" v-model="projectname" placeholder="请输入项目名称" clearable style="width: 190px;" class="filter-item" />
        </div>
        <el-table
          v-loading="isProjectLoadingShow"
          ref="multipleTable"
          :data="projectList.filter(data => !projectname || data.name.toLowerCase().includes(projectname.toLowerCase()))"
          element-loading-text="Loading"
          style="width: 100%;"
          max-height="300"
          fit
          highlight-current-row
          @selection-change="selectprojectchange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="50"
          />
          <el-table-column label="序号" align="center" width="70">
            <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
          </el-table-column>
          <el-table-column label="项目名称" align="center">
            <template slot-scope="scope">
              <span @click="openEditProject(scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目地址" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目描述" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination v-show="userProjectTotal>0" :total="userProjectTotal" :page-sizes="[5]" :page.sync="paramsGetUserProject.page" :limit.sync="paramsGetUserProject.limit" @pagination="getUserProjectList" /> -->
        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click.native="isProjectShow = false">取消</el-button>
          <el-button v-waves :loading="isBindLoading" type="primary" @click.native="onBindProjectSubmit">确定</el-button>
        </div>
      </el-dialog>
      <div class="filter-container">
        <el-button v-waves :size="size" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="onBindProject">绑定</el-button>
        <!--删除按钮-->
        <el-button v-waves :size="size" :disabled="userprojectselection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="unbindProject">解绑</el-button>
      </div>
      <el-table
        v-loading="isUserProLoadingShow"
        :data="useerProjectList"
        element-loading-text="Loading"
        style="width: 100%;"
        max-height="400"
        fit
        highlight-current-row
        @selection-change="selectuserprojectchange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        />
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
        </el-table-column>
        <el-table-column label="项目名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目描述" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination v-show="userProjectTotal>0" :total="userProjectTotal" :page-sizes="[5]" :page.sync="paramsGetUserProject.page" :limit.sync="paramsGetUserProject.limit" @pagination="getUserProjectList" /> -->
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click.native="isUserProShow = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { bindProject, unbindProject, getUserProjectList } from '@/api/userprojects'
// import { getDeviceTypes } from '@/api/devices'
import { Formattimestamp } from '@/utils/time'
import { getProjects } from '@/api/project'
import { getAdminList, addAdmin, getAdminDetail, deleteAdmin, updateAdmin, getLevelTypeList } from '@/api/users'
import { check_other_char } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import md5 from '@/utils/md5'
export default {
  name: 'Member',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      size: 'mini',
      projectname: '',
      userprojectselection: [],
      projectselection: [],
      MemberInfoRules: {
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
        u_level: [{ required: true, trigger: 'change', message: '请选择用户等级' }],
        u_available_time: [{ required: true, trigger: 'change', message: '请选择有效期' }],
        u_module_list: [{ required: true, trigger: 'change', message: '请选择项目模块' }]
      },
      isBindLoading: false,
      isProjectShow: false,
      isProjectLoadingShow: false,
      isUserProLoadingShow: false,
      levelOptions: [
        { level: 1, type: '后台超级管理员' },
        { level: 2, type: '后台运营管理员' },
        { level: 8, type: '后台支持人员' },
        { level: 9, type: '后台市场人员' },
        { level: 10, type: '后台渠道管理员' },
        { level: 11, type: '项目管理员' }
      ],
      deviceTypeOptions: [],
      accountTypeEditOptions: [],
      // 用户已绑定的项目列表
      useerProjectList: [],
      // 已有项目列表
      projectList: [],
      isMemberListLoadingShow: false,
      multipleSelection: [],
      memberList: [],
      total: 0,
      userProjectTotal: 0,
      resquestGetMember: {
        nickname: undefined,
        level: undefined,
        page: 1,
        limit: 20
      },

      tempFilterOptions: {
        nickname: undefined,
        level: undefined
      },
      dialogAddVisible: false,
      isButtonAddLoading: false,
      requestAddMember: {
        project_id: undefined,
        u_name: undefined,
        u_nickname: undefined,
        u_level: undefined,
        u_phone: undefined,
        u_note: undefined,
        u_available_time: undefined,
        u_module_list: []
      },
      isUserProShow: false,
      dialogEditVisible: false,
      isButtonEditLoading: false,
      requestEditMember: {
        project_id: undefined,
        u_id: undefined,
        u_name: undefined,
        u_nickname: undefined,
        u_phone: undefined,
        u_level: undefined,
        u_note: undefined,
        u_available_time: undefined,
        u_module_list: []
      },
      paramsGetUserProject: {
        user_id: undefined
        // page: 1,
        // limit: 5
      }
    }
  },
  computed: {
    ...mapGetters([
      'Account_Type',
      'user_id',
      'selected_project_id'
    ]),
    isBindProject() {
      return [1, 2].includes(this.Account_Type)
    }
  },
  created() {
    // this.getDeviceTypes()
    this.getMemberList()
    this.getLevelList()
  },
  methods: {
    isSelectModule(val) {
      return [10].includes(val)
    },
    isDisabled(val) {
      return [1, 2, 10].includes(val)
    },
    // 项目绑定提交
    onBindProjectSubmit() {
      this.isBindLoading = true
      bindProject({
        user_id: this.paramsGetUserProject.user_id,
        project_id_list: this.projectselection.map(item => item.project_id)
      }).then(() => {
        this.$message({
          type: 'success',
          message: '绑定成功'
        })
        this.isProjectShow = false
        this.isBindLoading = false
        this.getUserProjectList()
      }).catch(() => {
        this.isBindLoading = false
      })
    },
    selectuserprojectchange(val) {
      this.userprojectselection = val
    },
    selectprojectchange(val) {
      this.projectselection = val
    },
    // 绑定项目
    onBindProject() {
      this.getProjectList()
    },
    init() {
      this.projectList = []
      this.useerProjectList = []
    },
    closeDialigProject() {
      this.init()
    },
    // 解绑项目
    unbindProject() {
      this.userprojectselection
      unbindProject({
        user_id: this.paramsGetUserProject.user_id,
        project_id_list: this.userprojectselection.map(item => item.project_id)
      }).then(() => {
        this.$message({
          type: 'success',
          message: '解绑成功'
        })
        this.getUserProjectList()
      }).catch(() => {

      })
    },
    // 获取项目列表
    getProjectList() {
      this.isProjectLoadingShow = true
      getProjects().then(res => {
        this.isProjectLoadingShow = false
        this.projectList = res.data.items
        this.isProjectShow = true
        this.projectList.forEach(item => {
          if (this.useerProjectList.map(item => item.project_id).includes(item.project_id)) {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(item, true)
            })
          }
        })
      }).catch(() => {
        this.isProjectLoadingShow = false
      })
    },
    getUserProjectList() {
      this.useerProjectList = []
      this.isUserProLoadingShow = true
      getUserProjectList(this.paramsGetUserProject).then(res => {
        this.isUserProLoadingShow = false
        this.useerProjectList = res.data.items
      }).catch(() => {
        this.isUserProLoadingShow = false
      })
    },
    userProjectOpen(info) {
      this.isUserProShow = true
      this.paramsGetUserProject.user_id = info.user_id
      this.getUserProjectList()
    },
    // getDeviceTypes() {
    //   getDeviceTypes().then(res => {
    //     this.deviceTypeOptions = res.data.items
    //   }).catch(() => {})
    // },
    onSearch() {
      this.resquestGetMember.page = 1
      this.resquestGetMember.nickname = this.tempFilterOptions.nickname || undefined
      this.resquestGetMember.level = (this.tempFilterOptions.level || this.tempFilterOptions.level === 0) ? this.tempFilterOptions.level : undefined
      this.getMemberList()
    },
    getLevelList() {
      getLevelTypeList().then(res => {
        this.levelOptions = res.data.items
      }).catch(() => {})
    },
    /**
     * @Description: 获取人员列表
     * @Date: 2021/8/23
     **/
    getMemberList() {
      this.isMemberListLoadingShow = true
      getAdminList(this.resquestGetMember).then(response => {
        this.memberList = response.data.items
        this.total = response.data.total
        this.isMemberListLoadingShow = false
      }).catch(err => {
        console.log(err)
        this.isMemberListLoadingShow = false
      })
    },
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
      getAdminDetail({ u_id, project_id: this.selected_project_id }).then(res => {
        const info = res.data
        this.requestEditMember.u_id = info.user_id
        this.requestEditMember.u_name = info.name
        this.requestEditMember.u_nickname = info.nickname
        this.requestEditMember.u_phone = info.phone
        this.requestEditMember.u_note = info.note
        this.requestEditMember.u_level = info.level
        this.requestEditMember.u_module_list = info.module_list.split(',').map(item => item * 1)
        this.requestEditMember.u_available_time = info.available_time * 1000
        this.dialogEditVisible = true
      }).catch(() => {

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
      this.requestEditMember.project_id = this.selected_project_id
      this.$refs.formEditCompanyMember.validate(valid => {
        if (valid) {
          this.isButtonEditLoading = true
          this.requestEditMember.u_available_time = parseInt(this.requestEditMember.u_available_time / 1000)
          const params = {
            u_id: this.requestEditMember.u_id,
            u_name: this.requestEditMember.u_name,
            u_nickname: this.requestEditMember.u_nickname,
            u_phone: this.requestEditMember.u_phone,
            u_note: this.requestEditMember.u_note,
            u_available_time: this.requestEditMember.u_available_time,
            u_level: this.requestEditMember.u_level,
            // u_module_list: this.requestEditMember.u_module_list.join(','),
            u_module_list: ''
          }
          updateAdmin(params).then(() => {
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
    getLevelType(val) {
      let type
      this.levelOptions.forEach(item => {
        if (item.level === val) {
          type = item.type
        }
      })
      return type
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
            deleteAdmin(requestDeleteParams).then(() => {
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
      this.requestAddMember.u_name = undefined
      this.requestAddMember.u_nickname	 = undefined
      this.requestAddMember.u_phone = undefined
      this.requestAddMember.u_note = undefined
      this.requestAddMember.u_level = undefined
      this.requestAddMember.u_available_time = undefined
      this.requestAddMember.u_module_list = []
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
      this.requestAddMember.project_id = this.selected_project_id
      this.$refs.formAddCompanyMember.validate(valid => {
        if (valid) {
          this.isButtonAddLoading = true
          this.requestAddMember.u_available_time = parseInt(this.requestAddMember.u_available_time / 1000)
          console.log(this.requestAddMember)

          const params = {
            u_name: this.requestAddMember.u_name,
            u_nickname: this.requestAddMember.u_nickname,
            u_phone: this.requestAddMember.u_phone,
            u_note: this.requestAddMember.u_note,
            u_available_time: this.requestAddMember.u_available_time,
            u_level: this.requestAddMember.u_level,
            u_module_list: this.requestAddMember.u_module_list.join(',')
          }
          addAdmin(params).then(() => {
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
      if (this.requestEditMember.u_level === this.Account_Type) {
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
          updateAdmin(params).then(() => {
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

<style scoped lang="scss">
  // /deep/.el-dialog {
  //   max-height: 400px;
  // }
   .checkbox {
    padding: 5px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
  }
</style>
