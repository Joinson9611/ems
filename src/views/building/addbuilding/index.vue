<template>
  <div class="app-container">
    <div>
      <el-form ref="formNewBuilding" :model="BuildingInfo" :rules="BuildingAddRules" label-width="110px">
        <el-form-item label="建筑名称" prop="building">
          <el-input v-model="BuildingInfo.building" type="text"/>
        </el-form-item>
        <el-form-item label="建筑物描述">
          <el-input v-model="BuildingInfo.label" type="textarea"/>
        </el-form-item>
        <el-form-item label="楼层数据" style="margin-bottom: 10px">
          <div style="float: right">
            <!--筛选按钮-->
            <el-button v-waves class="createtask-toolbar-item" type="primary" icon="el-icon-plus" @click="openDialogAddFloor">添加楼层</el-button>
            <!--删除按钮-->
            <el-button v-waves :disabled="multipleSelection.length===0" class="createtask-toolbar-item" type="danger" icon="el-icon-delete" @click="onDeleteFloors">删除楼层</el-button>
          </div>
        </el-form-item>
        <el-table
          v-loading=""
          :data="floor_list"
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
            width="60"
            label="序号"/>
          <el-table-column label="楼层名称" align="center" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.floor }}</span>
            </template>
          </el-table-column>
          <el-table-column label="楼层编号" align="center" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.floor_id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="楼层描述" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item style="margin-top: 40px">
          <el-button v-waves :loading="buttonAddBulidingLoading" type="primary" @click.native="onBuildingAdd">提交</el-button>
          <el-button v-waves @click.native="onCancel">返回列表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogAddFloorVisible" :append-to-body="true" :close-on-click-modal="false" title="新建楼层">
      <el-form ref="formAddFloor" :model="FloorInfo" :rules="FloorAddRules" label-width="120px">
        <el-form-item label="楼层名称" class="dialog-form-item" prop="floor">
          <el-input v-model="FloorInfo.floor" type="text"/>
        </el-form-item>
        <el-form-item label="楼层编号" class="dialog-form-item" prop="floor_id">
          <el-input v-model="FloorInfo.floor_id" type="text" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
        <el-form-item label="楼层描述" class="dialog-form-item">
          <el-input v-model="FloorInfo.label" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="closeDialogAddFloor">取消</el-button>
        <el-button v-waves type="primary" @click.native="onFloorAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addNewBuilding } from '@/api/buildings'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  directives: { waves },
  data() {
    return {
      multipleSelection: [],
      BuildingAddRules: {
        building: { required: true, message: '请输入建筑物的名称', trigger: 'change' }
      },
      FloorAddRules: {
        floor: { required: true, message: '请输入楼层的名称', trigger: 'change' },
        floor_id: { required: true, message: '请输入楼层编号', trigger: 'blur' }
      },

      dialogAddFloorVisible: false,
      buttonAddBulidingLoading: false,

      floor_list: [],
      BuildingInfo: {
        building: undefined,
        label: undefined,
        floor_list: undefined
      },
      FloorInfo: {
        floor: undefined,
        floor_id: undefined,
        label: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id'
    ])
  },
  methods: {
    /**
     * @Description: 列表选中回调
     * @Date: 2019/4/29
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 删除数组中指定值的item
     * @Date: 2019/4/29
     **/
    removeByValue(val, array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === val) {
          array.splice(i, 1)
          break
        }
      }
    },
    /**
     * @Description: 返回楼层ID是否重复
     * @Date: 2019/4/29
     **/
    isFloorIDRepeat(val) {
      for (let i = 0; i < this.floor_list.length; i++) {
        if (val === this.floor_list[i].floor_id) {
          return true
        }
      }
      return false
    },
    /**
     * @Description: 弹出楼层新建对话框，并重置初始值
     * @Date: 2019/4/29
     **/
    openDialogAddFloor() {
      if (this.$refs.formAddFloor !== undefined) this.$refs.formAddFloor.resetFields()
      this.FloorInfo.floor = undefined
      this.FloorInfo.floor_id = undefined
      this.FloorInfo.label = ''
      this.dialogAddFloorVisible = true
    },
    /**
     * @Description: 关闭新建楼层对话框
     * @Date: 2019/4/29
     **/
    closeDialogAddFloor() {
      this.dialogAddFloorVisible = false
    },
    /**
     * @Description: 删除列表选中的楼层
     * @Date: 2019/4/29
     **/
    onDeleteFloors() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.removeByValue(this.multipleSelection[i], this.floor_list)
      }
    },
    /**
     * @Description: 添加新的楼层
     * @Date: 2019/4/29
     **/
    onFloorAdd() {
      this.$refs.formAddFloor.validate(valid => {
        if (valid) {
          if (this.isFloorIDRepeat(this.FloorInfo.floor_id)) {
            this.$message({
              message: '楼层编号不能重复',
              type: 'warning'
            })
          } else {
            const floorInfo = {
              floor: this.FloorInfo.floor,
              label: this.FloorInfo.label,
              floor_id: this.FloorInfo.floor_id
            }
            this.floor_list.push(floorInfo)
            this.dialogAddFloorVisible = false
          }
        }
      })
    },
    /**
     * @Description: 添加新的建筑物
     * @Date: 2019/4/29
     **/
    onBuildingAdd() {
      this.$refs.formNewBuilding.validate(valid => {
        if (valid) {
          if (this.floor_list.length !== 0) {
            this.buttonAddBulidingLoading = true
            const params = {
              project_id: this.selected_project_id,
              building: this.BuildingInfo.building,
              label: this.BuildingInfo.label,
              floor_list: this.floor_list.slice()
            }
            addNewBuilding(params).then(() => {
              this.buttonAddBulidingLoading = false
              this.$router.push({ path: this.redirect || '/buildings/building' })
            }).catch(err => {
              console.log(err)
              this.buttonAddBulidingLoading = false
            })
          } else {
            this.$message({
              message: '楼层列表不能为空',
              type: 'warning'
            })
          }
        }
      })
    },
    /**
     * @Description: 返回上一页
     * @Date: 2019/4/29
     **/
    onCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
