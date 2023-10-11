<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tempFilterOptions.building" placeholder="建筑名称" style="width: 300px;" class="filter-item" @keyup.enter.native="onSearch" />
      <!-- <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button> -->
      <el-button v-waves v-if="isUpdateShow" class="filter-item" type="primary" icon="el-icon-plus" @click="openDialogBuildingAdd">新建建筑</el-button>
      <el-button v-waves v-if="isUpdateShow" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onBuildingsDelete">删除建筑</el-button>
    </div>

    <el-table
      v-loading="isBuildingInfoListLoadingShow"
      :data="buildingInfoList"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"
      />
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (requestParam_getBuildingInfoList.page - 1) * requestParam_getBuildingInfoList.limit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="建筑名称">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openDialogBuildingEdit(scope.row)"><i>{{ scope.row.building }}</i></a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isUpdateShow" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleFloor(scope.row)">楼层管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="requestParam_getBuildingInfoList.page" :limit.sync="requestParam_getBuildingInfoList.limit" @pagination="getBuildingInfoList" />

    <el-dialog :visible.sync="isDialogAddBuildingShow" :append-to-body="true" :close-on-click-modal="false" title="新建建筑">
      <el-form ref="formAddBuilding" :model="requestParam_addBuilding" :rules="BuidlingInfoRules" label-width="100px">
        <el-form-item label="建筑名称" class="dialog-form-item" prop="building">
          <el-input v-model="requestParam_addBuilding.building" type="text" />
        </el-form-item>
        <el-form-item label="建筑描述" class="dialog-form-item">
          <el-input v-model="requestParam_addBuilding.label" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogBuildingAdd">取消</el-button>
        <el-button v-waves :loading="isDialogAddBuildingLoadingShow" type="primary" @click.native="onBuildingAdd">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isDialogEditBuildingShow" :append-to-body="true" :close-on-click-modal="false" title="编辑建筑">
      <el-form ref="formEditBuilding" :model="requestParam_editBuilding" :rules="BuidlingInfoRules" label-width="100px">
        <el-form-item label="建筑名称" class="dialog-form-item" prop="building">
          <el-input v-model="requestParam_editBuilding.building" type="text" />
        </el-form-item>
        <el-form-item label="详细描述" class="dialog-form-item">
          <el-input v-model="requestParam_editBuilding.label" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogBuildingEdit">取消</el-button>
        <el-button v-waves v-if="isUpdateShow" :loading="isDialogEditBuildingLoadingShow" type="primary" @click.native="onBuildingEdit">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :visible.sync="isfloorDialogShow"
      title="楼层管理"
      direction="ltr"
      size="50%"
    >
      <div class="body-wrapper">
        <el-form label-width="100px">
          <el-form-item label="建筑名称" class="dialog-form-item" prop="building">
            <span>{{ buildingInfo.building }}</span>
          </el-form-item>
          <el-form-item label="建筑描述" class="dialog-form-item">
            <span>{{ buildingInfo.label }}</span>
          </el-form-item>
          <el-card shadow="never" class="project-list" body-style="padding: 0;">
            <div slot="header" class="clearfix">
              <span style="line-height: 29px">楼层列表</span>
              <div class="button" style="float: right">
                <!--新建-->
                <el-button v-waves class="filter-item" style="margin-left: 10px" size="mini" type="primary" icon="el-icon-plus" @click="isDialogHandleFloorShow = true">新建楼层</el-button>
                <!--删除-->
                <el-button v-waves v-loading="isFloorDeleteLoading" :disabled="floorselection.length===0" size="mini" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteFloor">删除楼层</el-button>
              </div>
            </div>
            <el-table
              v-loading="isFloorLoadingShow"
              :data="floorList"
              element-loading-text="Loading"
              style="width: 100%;"
              fit
              highlight-current-row
              @selection-change="handleFloorSelectionChange"
            >
              <el-table-column
                type="selection"
                align="center"
                width="50"
              />
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
              </el-table-column>
              <el-table-column label="楼层名称" align="center">
                <template slot-scope="scope">
                  <a style="color: #409EFF" @click="openEditFloor(scope.row)">{{ scope.row.floor }}</a>
                </template>
              </el-table-column>
              <el-table-column label="楼层描述" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.label || '/' }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="floorTotal>0" :total="floorTotal" :page.sync="paramsGetFloorList.page" :limit.sync="paramsGetFloorList.limit" @pagination="getFloorInfoList" />
          </el-card>
        </el-form>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="isDialogHandleFloorShow" :append-to-body="true" :close-on-click-modal="false" :title="isFloorEdit? '编辑楼层' : '新建楼层'" @close="closeFloorDialog">
      <el-form ref="formFloor" :model="floorInfo" :rules="FloorInfoRules" label-width="100px">
        <el-form-item label="楼层名称" class="dialog-form-item" prop="floor">
          <el-input v-model="floorInfo.floor" type="text" />
        </el-form-item>
        <el-form-item label="详细描述" class="dialog-form-item">
          <el-input v-model="floorInfo.label" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="isDialogHandleFloorShow = false">取消</el-button>
        <el-button v-waves :loading="isDialogFloorLoadingShow" type="primary" @click.native="onFloorSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contains } from '@/utils/tools'
import { getBuildingInfoList, deleteBuildings, addBuilding, updateBuildingInfo } from '@/api/buildings'
import { getFloorInfoList, addFloor, updateFloor, deleteFloor } from '@/api/floors'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'Building',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      multipleSelection: [],
      floorselection: [],
      buildingInfoList: [],
      floorList: [],
      isFloorDeleteLoading: false,
      isBuildingInfoListLoadingShow: false,
      isDialogAddBuildingShow: false,
      isDialogAddBuildingLoadingShow: false,
      isDialogEditBuildingShow: false,
      isDialogEditBuildingLoadingShow: false,
      isDialogFloorLoadingShow: false,
      isfloorDialogShow: false,
      isUpdateShow: false,
      isDialogHandleFloorShow: false,
      isFloorEdit: false,
      total: 0,
      floorTotal: 0,
      paramsGetFloorList: {
        page: 1,
        limit: 20,
        project_id: undefined,
        building_id: undefined
      },
      buildingInfo: {
        building: undefined,
        label: undefined
      },
      floorInfo: {
        project_id: undefined,
        floor: undefined,
        label: undefined,
        floor_id: undefined
      },
      tempFilterOptions: {
        building: undefined
      },

      requestParam_getBuildingInfoList: {
        project_id: undefined,
        building: undefined,
        page: 1,
        limit: 20
      },
      requestParam_addBuilding: {
        building: undefined,
        label: undefined
      },
      requestParam_editBuilding: {
        building_id: undefined,
        building: undefined,
        label: undefined
      },
      FloorInfoRules: {
        floor: [{ required: true, trigger: 'blur', message: '请输入楼层名称' }]
      },
      BuidlingInfoRules: {
        building: [{ required: true, trigger: 'blur', message: '请输入建筑物名称' }]
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
    this.isUpdateShow = contains('192', this.roles)
    this.getBuildingInfoList()
  },
  methods: {
    closeFloorDialog() {
      this.isDialogHandleFloorShow = false
      this.floorInit()
      if (this.$refs.formFloor !== undefined) this.$refs.formFloor.resetFields()
      this.isFloorEdit = false
    },
    openEditFloor(info) {
      this.isDialogHandleFloorShow = true
      this.floorInfo.floor = info.floor
      this.floorInfo.floor_id = info.floor_id
      this.floorInfo.label = info.label
      this.isFloorEdit = true
    },
    handleFloorSelectionChange(val) {
      this.floorselection = val
    },
    deleteFloor() {
      this.$confirm('确认删除选中楼层吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const requestDeleteParams = {
          project_id: this.selected_project_id,
          floor_id_list: this.floorselection.map(item => item.floor_id)
        }
        deleteFloor(requestDeleteParams).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getFloorInfoList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    onFloorSubmit() {
      this.$refs.formFloor.validate(valid => {
        if (valid) {
          let param = {}
          if (this.isFloorEdit) {
            param = {
              project_id: this.selected_project_id,
              floor_id: this.floorInfo.floor_id,
              floor: this.floorInfo.floor,
              label: this.floorInfo.label
            }
            updateFloor(param).then(() => {
              this.$message({ type: 'success', message: '编辑成功' })
              this.isDialogHandleFloorShow = false
              this.getFloorInfoList()
            }).catch(() => {
              this.isDialogHandleFloorShow = false
            })
          } else {
            param = {
              project_id: this.selected_project_id,
              building_id: this.paramsGetFloorList.building_id,
              floor: this.floorInfo.floor,
              label: this.floorInfo.label
            }
            addFloor(param).then(() => {
              this.$message({ type: 'success', message: '新建成功' })
              this.isDialogHandleFloorShow = false
              this.getFloorInfoList()
            })
          }
        }
      })
    },
    handleFloor({ building, label, building_id }) {
      this.buildingInfo.building = building
      this.buildingInfo.label = label
      this.paramsGetFloorList.building_id = building_id
      this.paramsGetFloorList.project_id = this.selected_project_id
      this.getFloorInfoList()
      this.isfloorDialogShow = true
    },
    floorInit() {
      this.floorInfo.label = undefined
      this.floorInfo.floor = undefined
    },
    getFloorInfoList() {
      getFloorInfoList(this.paramsGetFloorList).then(res => {
        this.floorList = res.data.items
        this.floorTotal = res.data.total
      }).catch(() => {

      })
    },
    /**
     * @Description: 列表选中回调
     * @Date: 2019/6/27
     **/
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @Description: 获取建筑物信息列表
     * @Date: 2019/6/27
     **/
    getBuildingInfoList() {
      const Params = {
        project_id: this.selected_project_id,
        page: this.requestParam_getBuildingInfoList.page,
        limit: this.requestParam_getBuildingInfoList.limit,
        building: this.requestParam_getBuildingInfoList.building
      }
      this.isBuildingInfoListLoadingShow = true
      getBuildingInfoList(Params).then(res => {
        this.buildingInfoList = res.data.items
        this.total = res.data.total
        this.isBuildingInfoListLoadingShow = false
      }).catch(err => {
        this.isBuildingInfoListLoadingShow = false
        console.error(err)
      })
    },
    onSearch() {
      this.requestParam_getBuildingInfoList.building = this.tempFilterOptions.building
      this.requestParam_getBuildingInfoList.page = 1
      this.getBuildingInfoList()
    },
    /**
     * @Description: 删除指定ID的建筑物
     * @Date: 2019/6/27
     **/
    onBuildingsDelete() {
      this.$confirm('确认删除已选中的建筑物？', '提示', {
        type: 'warning'
      }).then(() => {
        const Params = {
          project_id: this.selected_project_id,
          building_id_list: this.multipleSelection.map(item => item.building_id)
        }
        deleteBuildings(Params).then(() => {
          this.getBuildingInfoList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          console.error(err)
        })
      })
    },
    /**
     * @Description: 打开建筑添加对话框
     * @Date: 2019/6/28
     **/
    openDialogBuildingAdd() {
      this.requestParam_addBuilding.building = undefined
      this.requestParam_addBuilding.label = undefined
      if (this.$refs.formAddBuilding !== undefined) {
        this.$refs.formAddBuilding.resetFields()
      }
      this.isDialogAddBuildingShow = true
    },
    /**
     * @Description: 关闭建筑添加对话框
     * @Date: 2019/6/28
     **/
    closeDialogBuildingAdd() {
      this.isDialogAddBuildingShow = false
    },
    /**
     * @Description: 确认添加新建筑
     * @Date: 2019/6/28
     **/
    onBuildingAdd() {
      this.$refs.formAddBuilding.validate(valid => {
        if (valid) {
          this.isDialogAddBuildingLoadingShow = true
          const Params = {
            project_id: this.selected_project_id,
            building: this.requestParam_addBuilding.building,
            label: this.requestParam_addBuilding.label
          }
          addBuilding(Params).then(() => {
            this.isDialogAddBuildingLoadingShow = false
            this.getBuildingInfoList()
            this.$message({
              message: '新建成功',
              type: 'success'
            })
            this.isDialogAddBuildingShow = false
          }).catch(err => {
            this.isDialogAddBuildingLoadingShow = false
            console.error(err)
          })
        }
      })
    },
    /**
     * @Description: 打开建筑编辑对话框
     * @Date: 2019/6/28
     **/
    openDialogBuildingEdit(info) {
      this.requestParam_editBuilding.building_id = info.building_id
      this.requestParam_editBuilding.building = info.building
      this.requestParam_editBuilding.label = info.label
      this.isDialogEditBuildingShow = true
    },
    /**
     * @Description: 关闭建筑编辑对话框
     * @Date: 2019/6/28
     **/
    closeDialogBuildingEdit() {
      this.isDialogEditBuildingShow = false
    },
    /**
     * @Description: 确认建筑编辑
     * @Date: 2019/6/28
     **/
    onBuildingEdit() {
      this.$refs.formEditBuilding.validate(valid => {
        if (valid) {
          this.isDialogEditBuildingLoadingShow = true
          const Params = {
            project_id: this.selected_project_id,
            building_id: this.requestParam_editBuilding.building_id,
            building: this.requestParam_editBuilding.building,
            label: this.requestParam_editBuilding.label
          }
          updateBuildingInfo(Params).then(() => {
            this.isDialogEditBuildingLoadingShow = false
            this.getBuildingInfoList()
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.isDialogEditBuildingShow = false
          }).catch(err => {
            this.isDialogEditBuildingLoadingShow = false
            console.error(err)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/.el-drawer__body{
    display: flex;
    flex-direction: column;
    padding: 0;
    height: 0
  }
  .body-wrapper {
    flex: 1;
    overflow: auto;
    .device-item {
      /deep/.el-divider--horizontal {
        margin: 0;
      }
      .item {
        .list{
          font-size: 14px;
          .title {
            height: 30px;
            line-height: 30px;
            color:#303133;
          }
          .content {
            height: 30px;
            line-height: 30px;
            color:#909399;
          }
        }
      }
    }
    /deep/.el-form-item__content {
      span {
        color: #99a9bf;
      }
    }
    /deep/.el-form-item {
      margin-bottom: 0;
    }
  }
</style>
