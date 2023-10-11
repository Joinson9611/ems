<template>
  <div style="margin-top:10px">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="openDialog">添加</el-button>
      <!--删除按钮-->
      <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onDelete">删除</el-button>
    </div>
    <el-table
      v-loading="isStaffLoadingShow"
      :data="staffInfoList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="50"/>
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope"><span>{{ scope.$index+(paramsGetStaff.page - 1) * paramsGetStaff.limit + 1 }} </span></template>
      </el-table-column>
      <el-table-column label="姓名" width="150" align="center">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="onEdit(scope.row)"><i>{{ scope.row.name }}</i></a>
        </template>
      </el-table-column>
      <el-table-column label="职务" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.job }}
        </template>
      </el-table-column>
      <el-table-column label="证件编号" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetStaff.page" :limit.sync="paramsGetStaff.limit" @pagination="getStaffList" />
    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false" :title="isEdit ? '编辑人员备案' : '添加人员备案'" @closed="closeDialog">
      <el-form ref="formStaff" :model="paramsStaffInfo" :rules="staffInfoRules" label-width="120px">
        <el-form-item label="姓名" class="dialog-form-item" prop="name">
          <el-input v-model="paramsStaffInfo.name" placeholder="请填写员工姓名" type="text"/>
        </el-form-item>
        <el-form-item label="职务" class="dialog-form-item" prop="job">
          <el-input v-model="paramsStaffInfo.job" placeholder="请填写员工职务" type="text"/>
        </el-form-item>
        <el-form-item label="证件编码" class="dialog-form-item" prop="code">
          <el-input v-model="paramsStaffInfo.code " placeholder="请填写员工编码" type="text"/>
        </el-form-item>
        <el-form-item label="联系电话" class="dialog-form-item" prop="phone">
          <el-input v-model="paramsStaffInfo.phone" placeholder="请填写联系电话" type="text"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="dialogVisible = false">取消</el-button>
        <el-button v-waves :loading="isButtonLoadingShow" type="primary" @click.native="onSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getStaffList, addStaffList, deleteStaffList, updateStaffList } from '@/api/stafffs'
export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  props: {
    staff_type_id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isEdit: false,
      isButtonLoadingShow: false,
      dialogVisible: false,
      isStaffLoadingShow: false,
      paramsGetStaff: {
        project_id: undefined,
        page: 1,
        limit: 20
      },
      total: 0,
      paramsStaffInfo: {
        project_id: undefined,
        staff_id: undefined,
        name: undefined,		// 姓名
        job: undefined,	// 职务
        phone: undefined,	// 电话，
        code: undefined, // 证件编码
        staff_type_id: undefined
      },
      staffInfoList: [],
      multipleSelection: [],
      staffInfoRules: {
        name: { required: true, trigger: 'blur', message: '请输入员工姓名' },
        job: { required: true, trigger: 'blur', message: '请输入员工职务' },
        phone: { required: true, trigger: 'blur', message: '请输入员工联系电话' },
        code: { required: true, trigger: 'blur', message: '请输入员工证件编号' }
      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  // watch: {
  //   paramsStaffInfo: {
  //     handler(val) {
  //       console.log(val)
  //     },
  //     deep: true
  //   }
  // },
  created() {
    this.getStaffList()
  },
  methods: {
    openDialog() {
      this.isEdit = false
      this.dialogVisible = true
    },
    onEdit(info) {
      this.isEdit = true
      this.paramsStaffInfo.staff_id = info.staff_id
      this.paramsStaffInfo.name = info.name
      this.paramsStaffInfo.job = info.job
      this.paramsStaffInfo.phone = info.phone
      this.paramsStaffInfo.code = info.code
      this.dialogVisible = true
    },
    onDelete() {
      this.$confirm('确认删除选中的备案人员吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const deleteParam = {
          staff_type_id: this.staff_type_id,
          staff_id_list: this.multipleSelection.map(item => item.staff_id),
          project_id: this.selected_project_id
        }
        deleteStaffList(deleteParam).then(() => {
          this.getStaffList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    closeDialog() {
      if (this.isEdit) {
        this.init()
        this.paramsStaffInfo.staff_id = undefined
      }
      if (this.$refs.formStaff !== undefined) this.$refs.formStaff.resetFields()
      this.dialogVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    init() {
      this.paramsStaffInfo.staff_id = undefined
      this.paramsStaffInfo.name = undefined
      this.paramsStaffInfo.job = undefined
      this.paramsStaffInfo.phone = undefined
      this.paramsStaffInfo.code = undefined
    },
    onSubmit() {
      this.$refs.formStaff.validate(valid => {
        if (valid) {
          let param = {}
          if (this.isEdit) {
            param = {
              project_id: this.selected_project_id,
              staff_id: this.paramsStaffInfo.staff_id,
              staff_type_id: this.staff_type_id,
              name: this.paramsStaffInfo.name,
              job: this.paramsStaffInfo.job,
              phone: this.paramsStaffInfo.phone,
              code: this.paramsStaffInfo.code
            }
            updateStaffList(param).then(() => {
              this.$message({ type: 'success', message: '编辑成功' })
              this.init()
              this.dialogVisible = false
              this.getStaffList()
            })
          } else {
            param = {
              project_id: this.selected_project_id,
              name: this.paramsStaffInfo.name,
              staff_type_id: this.staff_type_id,
              job: this.paramsStaffInfo.job,
              phone: this.paramsStaffInfo.phone,
              code: this.paramsStaffInfo.code
            }
            addStaffList(param).then(() => {
              this.$message({ type: 'success', message: '新建成功' })
              this.dialogVisible = false
              this.getStaffList()
            })
          }
        }
      })
    },
    getStaffList() {
      this.paramsGetStaff.staff_type_id = this.staff_type_id
      this.paramsGetStaff.project_id = this.selected_project_id
      this.isStaffLoadingShow = true
      getStaffList(this.paramsGetStaff).then(res => {
        this.total = res.data.total
        this.staffInfoList = res.data.items
        this.isStaffLoadingShow = false
      }).catch(() => {
        this.isStaffLoadingShow = false
      })
    }
  }
}
</script>

<style>
</style>
