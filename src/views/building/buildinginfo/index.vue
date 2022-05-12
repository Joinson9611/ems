<template>
  <div class="app-container">
    <div>
      <el-form ref="formEditBuilding" :model="BuildingInfo" :rules="BuildInfoingRules" label-width="110px">
        <el-form-item label="建筑名称" prop="building">
          <el-input v-model="BuildingInfo.building" :disabled="isEditDisable" type="text"/>
        </el-form-item>
        <el-form-item label="建筑物描述">
          <el-input v-model="BuildingInfo.label" :disabled="isEditDisable" type="textarea"/>
        </el-form-item>
        <el-form-item label="楼层数据" style="margin-bottom: 10px">
          <div style="float: right">
            <!--筛选按钮-->
            <el-button v-waves :disabled="isEditDisable" class="createtask-toolbar-item" type="primary" icon="el-icon-plus" @click="openDialogAddFloor">添加楼层</el-button>
            <!--删除按钮-->
            <el-button v-waves :disabled="(multipleSelection.length===0) || isEditDisable" class="createtask-toolbar-item" type="danger" icon="el-icon-delete" @click="onDeleteFloors">删除楼层</el-button>
          </div>
        </el-form-item>
        <el-table
          v-loading=""
          :data="floor_list"
          element-loading-text="加载中"
          style="width:100%;"
          max-height="400"
          border
          fit
          highlight-current-row
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            width="50"/>
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="楼层名称" align="center" width="160">
            <template slot-scope="scope">
              <a style="color: #409EFF" @click="openDialogEditFloor(scope.row)"><i>{{ scope.row.floor }}</i></a>
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
          <el-button v-waves v-if="!isEditDisable" :loading="isButtonAddLoadingShow" type="primary" @click.native="onEditSubmit">提交</el-button>
          <el-button v-waves v-if="isEditDisable && isButtonBuildingEditShow" type="primary" @click.native="onEditEnabel">编辑信息</el-button>
          <el-button v-waves v-if="!isEditDisable" type="danger" @click.native="onEditDisabel">取消编辑</el-button>
          <el-button v-waves @click.native="onReturnList">返回列表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--弹出新建窗口-->
    <el-dialog :visible.sync="dialogAddFloorVisible" :append-to-body="true" :close-on-click-modal="false" title="楼层新建">
      <el-form ref="formAddFloor" :model="FloorAdd" :rules="FloorInfoRules" label-width="120px">
        <el-form-item label="楼层名称" class="dialog-form-item" prop="floor">
          <el-input v-model="FloorAdd.floor" type="text"/>
        </el-form-item>
        <el-form-item label="楼层编号" class="dialog-form-item" prop="floor_id">
          <el-input v-model="FloorAdd.floor_id" type="text" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
        <el-form-item label="楼层描述" class="dialog-form-item">
          <el-input v-model="FloorAdd.label" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="closeDialogAddFloor">取消</el-button>
        <el-button v-waves type="primary" @click.native="onFloorAddSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!--弹出编辑窗口-->
    <el-dialog :visible.sync="dialogEditFloorVisible" :append-to-body="true" :close-on-click-modal="false" title="楼层编辑">
      <el-form ref="formEditFloor" :model="FloorEdit" :rules="FloorInfoRules" label-width="120px">
        <el-form-item :disabled="isEditDisable" label="楼层名称" class="dialog-form-item" prop="floor">
          <el-input :disabled="isEditDisable" v-model="FloorEdit.floor" type="text"/>
        </el-form-item>
        <el-form-item label="楼层编号" class="dialog-form-item" prop="floor_id">
          <el-input v-model="FloorEdit.floor_id" disabled type="text" />
        </el-form-item>
        <el-form-item label="楼层描述" class="dialog-form-item">
          <el-input :disabled="isEditDisable" v-model="FloorEdit.label" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px">
        <el-button v-waves @click.native="closeDialogEditFloor">取消</el-button>
        <el-button v-waves v-if="isButtonBuildingEditShow" :disabled="isEditDisable" type="primary" @click.native="onFloorEditSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBuildingInfo, updateBuildingInfo } from '@/api/buildings'
import waves from '@/directive/waves'
import { contains } from '@/utils/tools'
import { mapGetters } from 'vuex'

export default {
  directives: { waves },
  data() {
    return {
      building_id: undefined,
      project_id: undefined,

      isButtonBuildingEditShow: false,
      isEditDisable: true,
      isButtonAddLoadingShow: false,

      multipleSelection: [],

      BuildInfoingRules: {
        building: { required: true, message: '请输入建筑物的名称', trigger: 'change' }
      },
      FloorInfoRules: {
        floor: { required: true, message: '请输入楼层的名称', trigger: 'change' },
        floor_id: { required: true, message: '请输入楼层编号', trigger: 'change' }
      },

      dialogAddFloorVisible: false,
      dialogEditFloorVisible: false,

      BuildingInfo: {
        project_id: undefined,
        building_id: undefined,
        building: undefined,
        label: undefined
      },
      floor_list: [],
      FloorAdd: {
        floor: undefined,
        floor_id: undefined,
        label: ''
      },
      FloorEdit: {
        floor: undefined,
        floor_id: undefined,
        label: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getCurrentPermissions()
    this.getParams()
    this.getBuildingInfo()
  },
  methods: {
    /**
     * @Description: 获取页面权限组
     * @Date: 2019/4/29
     **/
    getCurrentPermissions() {
      this.isButtonBuildingEditShow = contains('192', this.roles)
    },
    /**
     * @Description: 获取上个页面传递过来的参数
     * @Date: 2019/4/29
     **/
    getParams() {
      const building_id = this.$route.query.bid
      const project_id = this.$route.query.pid
      this.building_id = building_id.toString()
      this.project_id = project_id.toString()
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
     * @Description: 判断楼层ID是否重复
     * @Date: 2019/4/29
     **/
    isFloorIDRepeat(val) {
      for (let i = 0; i < this.floor_list.length; i++) {
        if (val.toString() === this.floor_list[i].floor_id.toString()) {
          return true
        }
      }
      return false
    },
    /**
     * @Description: 获取对应Item在数组中的index
     * @Date: 2019/4/29
     **/
    getFloorIndex(val) {
      for (let i = 0; i < this.floor_list.length; i++) {
        if (val === this.floor_list[i].floor_id) {
          return i
        }
      }
      return -1
    },
    /**
     * @Description: 获取指定id的建筑物信息
     * @Date: 2019/4/29
     **/
    getBuildingInfo() {
      const params = {
        building_id: this.building_id,
        project_id: this.project_id
      }
      getBuildingInfo(params).then(respones => {
        this.BuildingInfo = respones.data
        this.floor_list = respones.data.floor_list
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 列表选中回调
     * @Date: 2019/4/29
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 删除指定楼层
     * @Date: 2019/4/29
     **/
    onDeleteFloors() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.removeByValue(this.multipleSelection[i], this.floor_list)
      }
    },
    /**
     * @Description: 打开添加楼层对话框并重置信息
     * @Date: 2019/4/29
     **/
    openDialogAddFloor() {
      this.FloorAdd.floor_id = undefined
      this.FloorAdd.floor = undefined
      this.FloorAdd.label = ''
      this.dialogAddFloorVisible = true
    },
    /**
     * @Description: 关闭楼层添加对话框
     * @Date: 2019/4/29
     **/
    closeDialogAddFloor() {
      this.dialogAddFloorVisible = false
    },
    /**
     * @Description: 楼层添加提交
     * @Date: 2019/4/29
     **/
    onFloorAddSubmit() {
      this.$refs.formAddFloor.validate(valid => {
        if (valid) {
          if (this.isFloorIDRepeat(this.FloorAdd.floor_id)) {
            this.$message({
              message: '楼层编号不能重复',
              type: 'warning'
            })
          } else {
            const floorInfo = {
              floor: this.FloorAdd.floor,
              label: this.FloorAdd.label,
              floor_id: this.FloorAdd.floor_id
            }
            this.floor_list.push(floorInfo)
            this.dialogAddFloorVisible = false
          }
        }
      })
    },
    /**
     * @Description: 打开楼层编辑对话框
     * @Date: 2019/4/29
     **/
    openDialogEditFloor(info) {
      this.dialogEditFloorVisible = true
      this.FloorEdit = info
    },
    /**
     * @Description: 关闭楼层编辑对话框
     * @Date: 2019/4/29
     **/
    closeDialogEditFloor() {
      this.dialogEditFloorVisible = false
    },
    /**
     * @Description: 提交楼层编辑信息
     * @Date: 2019/4/29
     **/
    onFloorEditSubmit() {
      this.$refs.formEditFloor.validate(valid => {
        if (valid) {
          const floorInfo = {
            floor: this.FloorEdit.floor,
            label: this.FloorEdit.label,
            floor_id: this.FloorEdit.floor_id
          }
          const index = this.getFloorIndex(this.FloorEdit.floor_id)
          if (index !== -1) {
            this.floor_list[index] = floorInfo
          } else {
            this.$message({
              message: '出现错误，请刷新页面后重新编辑',
              type: 'warning'
            })
          }
          this.dialogEditFloorVisible = false
        }
      })
    },
    /**
     * @Description: 开启编辑
     * @Date: 2019/4/29
     **/
    onEditEnabel() {
      this.isEditDisable = false
    },
    /**
     * @Description: 关闭编辑
     * @Date: 2019/4/29
     **/
    onEditDisabel() {
      this.getBuildingInfo()
      this.isEditDisable = true
    },
    /**
     * @Description: 提交修改信息
     * @Date: 2019/4/29
     **/
    onEditSubmit() {
      this.$refs.formEditBuilding.validate(valid => {
        if (valid) {
          // 建筑物楼层列表不能为空
          if (this.floor_list.length !== 0) {
            this.isButtonAddLoadingShow = true
            const params = {
              project_id: this.project_id,
              building_id: this.building_id,
              building: this.BuildingInfo.building,
              label: this.BuildingInfo.label,
              floor_list: this.floor_list
            }
            updateBuildingInfo(params).then(() => {
              this.isButtonAddLoadingShow = false
              this.$router.push({ path: '/buildings/building' })
            }).catch(err => {
              console.log(err)
              this.isButtonAddLoadingShow = false
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
     * @Description: 返回上个页面
     * @Date: 2019/4/29
     **/
    onReturnList() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
