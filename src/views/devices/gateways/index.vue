<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="paramsGetGateway.gateway" style="width:200px" placeholder="网关名称" class="filter-item" @keyup.enter.native="onSearch" />
      <el-input v-model="paramsGetGateway.mac" style="width:200px" placeholder="Mac地址" class="filter-item" @keyup.enter.native="onSearch" />
      <el-button v-waves v-if="isUpdateShow" class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="newGateway">新建</el-button>
      <el-button v-waves v-if="isUpdateShow" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteGateways">删除</el-button>
    </div>
    <!--任务列表-->
    <el-table
      v-loading="isListLoadingShow"
      :data="list"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="50"/>
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column label="网关名称" align="center" width="180">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="editGateway(scope.row)">{{ scope.row.gateway }}</a>
        </template>
      </el-table-column>
      <el-table-column label="Mac地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mac }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.label || '/' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="paramsGetGateway.page" :limit.sync="paramsGetGateway.limit" @pagination="getGatewayList" />
    <el-dialog :visible.sync="isDialogGatewaysShow" :append-to-body="true" :close-on-click-modal="false" :title="isEdit ? '编辑网关' : '新建网关' " @closed="closeDialogGateway">
      <el-form ref="formdata" :model="formdataGateway" :rules="groupRules" label-width="120px">
        <el-form-item label="网关名称：" class="dialog-form-item" prop="gateway">
          <el-input v-model="formdataGateway.gateway"/>
        </el-form-item>
        <el-form-item label="mac地址：" class="dialog-form-item" prop="mac">
          <el-input :disabled="isEdit" v-model="formdataGateway.mac" :maxlength="12" />
        </el-form-item>
        <el-form-item label="描述：" class="dialog-form-item" >
          <el-input v-model="formdataGateway.label" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="isDialogGatewaysShow = false">取消</el-button>
        <el-button v-waves v-if="isUpdateShow" :loading="isButtonLoadingShow" type="primary" @click.native="onSumbit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contains } from '@/utils/tools'
import { Formattimestamp } from '@/utils/time'
import Pagination from '@/components/Pagination'
import { getGatewaysInfoList, addGateways, deleteGateways, updateGateways } from '@/api/gateways'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  components: {
    Pagination
  },
  directives: {
    waves
  },
  data() {
    return {
      groupRules: {
        gateway: { required: true, message: '请填写网关名称', trigger: 'blur' },
        mac: [{ required: true, message: '请填写mac地址', trigger: 'blur' }],
        label: { required: true, message: '请填写描述', trigger: 'blur' }
      },
      isEdit: false,
      isButtonLoadingShow: false,
      list: [],
      isUpdateShow: false,
      isDialogGatewaysShow: false,
      isListLoadingShow: false,
      multipleSelection: [],
      questionbankOptions: [],
      tempFilterOptions: {
        question_bank_type: undefined
      },
      // 网关总数
      total: 0,
      // 请求网关列表信息参数
      paramsGetGateway: {
        page: 1,
        project_id: undefined,
        limit: 20,
        gateway: undefined,
        mac: undefined
      },
      formdataGateway: {
        gateway_id: undefined,
        gateway: undefined,
        project_id: undefined,
        label: undefined,
        mac: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'selected_project_id'
    ])
  },
  created() {
    this.isUpdateShow = contains('302', this.roles)
    this.getGatewayList()
  },
  methods: {
    onSearch() {
      this.getGatewayList()
    },
    questionBankChange(val) {
      if (val === '') {
        this.paramsGetGateway.question_bank_type_id = undefined
      } else {
        this.paramsGetGateway.question_bank_type_id = val
      }
      this.getGatewayList()
    },
    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },
    // 提交表单
    onSumbit() {
      this.$refs.formdata.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            const params = {
              gateway_id: this.formdataGateway.gateway_id,
              gateway: this.formdataGateway.gateway,
              project_id: this.selected_project_id,
              label: this.formdataGateway.label,
              mac: this.formdataGateway.mac
            }
            updateGateways(params).then(() => {
              this.isDialogGatewaysShow = false
              this.getGatewayList()
              this.$message({
                type: 'success',
                message: '编辑成功！'
              })
              this.init()
            }).catch(err => {
              console.error(err)
            })
          } else {
            const params = {
              gateway: this.formdataGateway.gateway,
              project_id: this.selected_project_id,
              label: this.formdataGateway.label,
              mac: this.formdataGateway.mac
            }
            this.formdataGateway.group_id = undefined
            addGateways(params).then(() => {
              this.isDialogGatewaysShow = false
              this.getGatewayList()
              this.$message({
                type: 'success',
                message: '新建成功！'
              })
              this.init()
            }).catch(err => {
              console.error(err)
            })
          }
        }
      })
    },
    newGateway() {
      this.isDialogGatewaysShow = true
    },
    editGateway(info) {
      this.isDialogGatewaysShow = true
      this.isEdit = true
      this.formdataGateway.label = info.label
      this.formdataGateway.gateway_id = info.gateway_id
      this.formdataGateway.gateway = info.gateway
      this.formdataGateway.mac = info.mac
    },
    closeDialogGateway() {
      if (this.isEdit) {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.resetFields()
        this.init()
      } else {
        if (this.$refs.formdata !== undefined) this.$refs.formdata.clearValidate()
      }
      this.isEdit = false
    },
    init() {
      this.formdataGateway.label = undefined
      this.formdataGateway.gateway = undefined
      this.formdataGateway.mac = undefined
    },
    deleteGateways() {
      this.$confirm('确认删除选中的网关吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.isListLoadingShow = true
        const deleteParam = {
          gateway_id_list: this.multipleSelection.map(item => item.gateway_id).toString(),
          project_id: this.selected_project_id
        }
        deleteGateways(deleteParam).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.isListLoadingShow = false
          this.getGatewayList()
        }).catch(err => {
          console.error(err)
          this.isListLoadingShow = false
        })
      })
    },
    getGatewayList() {
      this.paramsGetGateway.project_id = this.selected_project_id
      this.isListLoadingShow = true
      getGatewaysInfoList(this.paramsGetGateway).then(res => {
        this.isListLoadingShow = false
        this.total = res.data.total
        this.list = res.data.items
      }).catch(err => {
        console.error(err)
        this.isListLoadingShow = false
      })
    },
    formateTime(timpstamp) {
      return Formattimestamp(timpstamp)
    }
  }
}
</script>

<style>

</style>
