<template>
  <div style="margin-top: 10px">
    <div>
      <div class="filter-container">
        <!-- <el-input v-model="tempFilterOptions.company_name" clearable placeholder="单位名称" style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch"/> -->
        <!-- <el-select v-model="tempFilterOptions.company_type_id" placeholder="单位类型" clearable style="width: 200px" class="filter-item">
          <el-option v-for="item in companyTypeOptions" :key="item.company_type_id" :label="item.company_type" :value="item.company_type_id"/>
        </el-select> -->
        <!--筛选按钮-->
        <!-- <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button> -->
        <!--新建按钮-->
        <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="openDialogAddCompany">添加单位</el-button>
        <!--删除按钮-->
        <el-button v-waves :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onDeleteCompanys">删除单位</el-button>
      </div>
      <el-table
        v-loading="isCompanyListLoadingShow"
        :data="companyTableList"
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
          <template slot-scope="scope"><span>{{ scope.$index+(resquestGetCompany.page - 1) * resquestGetCompany.limit + 1 }} </span></template>
        </el-table-column>
        <el-table-column label="单位名称" align="center">
          <template slot-scope="scope">
            <a style="color: #409EFF" @click="openDialogCompanyEdit(scope.row)"><i>{{ scope.row.name }}</i></a>
          </template>
        </el-table-column>
        <el-table-column label="单位电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.company_phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位负责人" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.leader }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.leader_phone }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!--页码导航-->
      <pagination v-show="total>0" :total="total" :page.sync="resquestGetCompany.page" :limit.sync="resquestGetCompany.limit" @pagination="getCompanyList" />
    </div>

    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogAddVisible" :append-to-body="true" :close-on-click-modal="false" title="新建单位">
      <el-form ref="formAddCompany" :model="requestAddCompany" :rules="CompanyInfoRules" label-width="120px">
        <!--单位名称-->
        <el-form-item label="单位名称" class="dialog-form-item" prop="company_name">
          <el-input v-model="requestAddCompany.company_name" type="text"/>
        </el-form-item>
        <el-form-item label="单位地址" class="dialog-form-item" prop="company_address">
          <el-input v-model="requestAddCompany.company_address" type="text"/>
        </el-form-item>
        <el-form-item label="单位电话" class="dialog-form-item" prop="company_phone">
          <el-input v-model="requestAddCompany.company_phone" type="text"/>
        </el-form-item>
        <el-form-item label="单位负责人" class="dialog-form-item" prop="company_leader">
          <el-input v-model="requestAddCompany.company_leader" type="text"/>
        </el-form-item>
        <el-form-item label="负责人电话" class="dialog-form-item" prop="company_leader_phone">
          <el-input v-model="requestAddCompany.company_leader_phone" type="text"/>
        </el-form-item>
        <!-- <el-form-item label="可用账号数量" class="dialog-form-item" prop="employee_count">
          <el-input v-model="requestAddCompany.employee_count" type="text"/>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogAddCompany">取消</el-button>
        <el-button v-waves :loading="isButtonAddLoadingShow" type="primary" @click.native="onCompanyAdd">确定</el-button>
      </div>
    </el-dialog>

    <!--弹出编辑窗口-->
    <el-dialog :visible.sync="dialogEditVisible" :append-to-body="true" :close-on-click-modal="false" title="编辑">
      <el-form ref="formEditCompany" :model="requestEditCompany" :rules="CompanyInfoRules" label-width="120px">
        <!--单位名称-->
        <el-form-item label="单位名称" class="dialog-form-item" prop="company_name">
          <el-input v-model="requestEditCompany.company_name" type="text"/>
        </el-form-item>
        <el-form-item label="单位地址" class="dialog-form-item" prop="company_address">
          <el-input v-model="requestEditCompany.company_address" type="text"/>
        </el-form-item>
        <el-form-item label="单位电话" class="dialog-form-item" prop="company_phone">
          <el-input v-model="requestEditCompany.company_phone" type="text"/>
        </el-form-item>
        <el-form-item label="单位负责人" class="dialog-form-item" prop="company_leader">
          <el-input v-model="requestEditCompany.company_leader" type="text"/>
        </el-form-item>
        <el-form-item label="负责人电话" class="dialog-form-item" prop="company_leader_phone">
          <el-input v-model="requestEditCompany.company_leader_phone" type="text"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogCompanyEdit">取消</el-button>
        <el-button v-waves :loading="isButtonEditLoadingShow" type="primary" @click.native="onCompanyEdit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { createCompany, getCompanyInfoList, deleteCompanys, editCompany } from '@/api/company'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
export default {
  name: 'Company',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      isCompanyListLoadingShow: false,
      multipleSelection: [],
      companyTableList: [],
      companyTypeOptions: [],
      total: 0,
      tempFilterOptions: {
        company_name: undefined
      },
      resquestGetCompany: {
        project_id: undefined,
        company_name: undefined,
        page: 1,
        limit: 20
      },

      CompanyInfoRules: {
        company_name: [{ required: true, trigger: 'change', message: '请输入单位名称' }],
        company_address: [{ required: true, trigger: 'change', message: '请输入单位地址' }],
        company_phone: [{ required: true, trigger: 'change', message: '请输入单位电话' }],
        company_leader: [{ required: true, trigger: 'change', message: '请输入单位负责人' }],
        company_leader_phone: [{ required: true, trigger: 'change', message: '请输入单位负责人电话' }]
      },

      dialogAddVisible: false,
      isButtonAddLoadingShow: false,
      requestAddCompany: {
        project_id: undefined,
        company_name: undefined,
        company_address: undefined,
        company_phone: undefined,
        company_leader: undefined,
        company_leader_phone: undefined
        // employee_count: undefined
      },

      dialogEditVisible: false,
      isButtonEditLoadingShow: false,
      requestEditCompany: {
        project_id: undefined,
        company_id: undefined,
        company_name: undefined,
        company_address: undefined,
        company_phone: undefined,
        company_leader: undefined,
        company_leader_phone: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id'
    ])
  },

  watch: {
    'tempFilterOptions.company_type_id': {
      handler(curVal) {
        if (curVal === '') {
          this.tempFilterOptions.company_type_id = undefined
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getCompanyList()
  },
  methods: {
    requestCompanyList(params) {
      getCompanyInfoList(params).then(response => {
        this.companyTableList = response.data.items
        this.total = response.data.total
        this.isCompanyListLoadingShow = false
      }).catch(err => {
        console.log(err)
        this.isCompanyListLoadingShow = false
      })
    },
    /**
     * @Description: 获取单位列表
     * @Date: 2019/8/14
     **/
    getCompanyList() {
      this.isCompanyListLoadingShow = true
      this.resquestGetCompany.project_id = this.selected_project_id
      this.requestCompanyList(this.resquestGetCompany)
    },
    /**
     * @Description: 搜索事件
     * @Date: 2019/5/6
     **/
    onSearch() {
      this.resquestGetCompany.company_name = this.tempFilterOptions.company_name
      this.resquestGetCompany.company_type_id = this.tempFilterOptions.company_type_id
      this.resquestGetCompany.page = 1
      this.getCompanyList()
    },
    /**
     * @Description: 列表项目勾选回调
     * @Date: 2019/5/6
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 打开单位详情编辑对话框
     * @Date: 2019/5/6
     **/
    openDialogCompanyEdit(info) {
      this.requestEditCompany.company_id = info.id
      this.requestEditCompany.company_name = info.name
      this.requestEditCompany.company_address = info.company_address
      this.requestEditCompany.company_type_id = info.company_type_id
      this.requestEditCompany.company_leader = info.leader
      this.requestEditCompany.company_leader_phone = info.leader_phone
      this.requestEditCompany.company_phone = info.company_phone
      this.dialogEditVisible = true
    },
    /**
     * @Description: 关闭单位详情编辑对话框
     * @Date: 2019/5/6
     **/
    closeDialogCompanyEdit() {
      this.dialogEditVisible = false
    },
    /**
     * @Description: 删除指定单位
     * @Date: 2019/5/6
     **/
    onDeleteCompanys() {
      this.$confirm('确认删除选中单位吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const requestDeleteParams = {
          project_id: this.selected_project_id,
          company_id_list: this.multipleSelection.map(item => item.id)
        }
        deleteCompanys(requestDeleteParams).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getCompanyList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    /**
     * @Description: 打开单位添加对话框
     * @Date: 2019/5/6
     **/
    openDialogAddCompany() {
      if (this.$refs.formAddCompany !== undefined) this.$refs.formAddCompany.resetFields()
      this.requestAddCompany.company_name = undefined
      this.requestAddCompany.company_type_id = undefined
      this.requestAddCompany.company_address = undefined
      this.requestAddCompany.company_phone = undefined
      this.requestAddCompany.company_leader = undefined
      this.requestAddCompany.company_leader_phone = undefined
      // this.requestAddCompany.employee_count = undefined
      this.dialogAddVisible = true
    },
    /**
     * @Description: 关闭单位添加对话框
     * @Date: 2019/5/6
     **/
    closeDialogAddCompany() {
      this.dialogAddVisible = false
    },
    /**
     * @Description: 单位添加事件
     * @Date: 2019/5/6
     **/
    onCompanyAdd() {
      this.$refs.formAddCompany.validate(valid => {
        this.requestAddCompany.project_id = this.selected_project_id
        if (valid) {
          this.isButtonAddLoadingShow = true
          createCompany(this.requestAddCompany).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.isButtonAddLoadingShow = false
            this.getCompanyList()
            this.dialogAddVisible = false
          }).catch(err => {
            this.isButtonAddLoadingShow = false
            console.log(err)
          })
        }
      })
    },
    /**
     * @Description: 单位信息编辑事件
     * @Date: 2019/5/6
     **/
    onCompanyEdit() {
      this.requestEditCompany.project_id = this.selected_project_id
      this.$refs.formEditCompany.validate(valid => {
        if (valid) {
          this.isButtonEditLoadingShow = true
          editCompany(this.requestEditCompany).then(() => {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.isButtonEditLoadingShow = false
            this.getCompanyList()
            this.dialogEditVisible = false
          }).catch(err => {
            this.isButtonEditLoadingShow = false
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

