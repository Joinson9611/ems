<template >
  <div class="app-container">
    <div class="filter-container">
      <!--建筑名称筛选框-->
      <el-input v-model="tempFilterOptions.building" placeholder="建筑名称" style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch"/>
      <!--筛选按钮-->
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
      <el-button v-waves v-if="isButtonBuildingAddShow" class="filter-item" type="primary" icon="el-icon-plus" @click="toBuildingAddPage">新建</el-button>
      <!--删除按钮-->
      <el-button v-waves v-if="isButtonBuildingDeleteShow" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onDeleteBuildings">删除</el-button>
    </div>

    <el-table
      v-loading="isListLoadingShow"
      :data="buildingList"
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
        <template slot-scope="scope"><span>{{ scope.$index+(BuildingListInfo.page - 1) * BuildingListInfo.limit + 1 }} </span></template>
      </el-table-column>
      <el-table-column align="center" label="建筑名称">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="toBuildingInfoPage(scope.row)"><i>{{ scope.row.building }}</i></a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="BuildingListInfo.page" :limit.sync="BuildingListInfo.limit" @pagination="getBuildingList" />
  </div>
</template>

<script>
import { getBuildingListByPage, deleteBuildings } from '@/api/buildings'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { contains } from '@/utils/tools'
import { mapGetters } from 'vuex'

export default {
  name: 'Building',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      isButtonBuildingAddShow: false,
      isButtonBuildingDeleteShow: false,
      isListLoadingShow: false,

      multipleSelection: [],
      buildingList: [],
      total: 0,
      tempFilterOptions: {
        building: undefined
      },
      BuildingListInfo: {
        page: 1,
        limit: 20,
        building: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id',
      'roles'
    ])
  },
  watch: {
    'tempFilterOptions.building': {
      handler(curVal) {
        if (curVal === '') {
          this.tempFilterOptions.building = undefined
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getCurrentPermissions()
    this.getBuildingList()
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
     * @Description: 获取权限值
     * @Date: 2019/4/29
     **/
    getCurrentPermissions() {
      this.isButtonBuildingAddShow = contains('192', this.roles)
      this.isButtonBuildingDeleteShow = contains('192', this.roles)
    },
    requestBuildingList(params) {
      getBuildingListByPage(params).then(response => {
        this.buildingList = response.data.items
        this.total = response.data.total
        this.isListLoadingShow = false
      }).catch(err => {
        console.log(err)
        this.isListLoadingShow = false
      })
    },
    /**
     * @Description: 获取建筑物列表数据
     * @Date: 2019/4/29
     **/
    getBuildingList() {
      const params = {
        project_id: this.selected_project_id,
        page: this.BuildingListInfo.page,
        limit: this.BuildingListInfo.limit,
        building: this.BuildingListInfo.building
      }
      this.isListLoadingShow = true
      this.requestBuildingList(params)
    },
    /**
     * @Description: 搜索按钮确认
     * @Date: 2019/4/29
     **/
    onSearch() {
      this.BuildingListInfo.building = this.tempFilterOptions.building
      this.BuildingListInfo.page = 1
      this.getBuildingList()
    },
    /**
     * @Description: 删除列表选中的建筑物
     * @Date: 2019/4/29
     **/
    onDeleteBuildings() {
      this.$confirm('确认删除选中的建筑物吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const deleteParam = {
          building_id_list: this.multipleSelection.map(item => item.building_id),
          project_id: this.selected_project_id
        }
        deleteBuildings(deleteParam).then(() => {
          this.getBuildingList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    /**
     * @Description: 去往建筑物新建页面
     * @Date: 2019/4/29
     **/
    toBuildingAddPage() {
      this.$router.push({
        path: this.redirect || '/buildings/addbuilding'
      })
    },
    /**
     * @Description: 去往建筑物详情页面
     * @Date: 2019/4/29
     **/
    toBuildingInfoPage(info) {
      this.$router.push({
        path: this.redirect || '/buildings/buildinginfo',
        query: {
          bid: info.building_id,
          pid: this.selected_project_id
        }
      })
    }
  }
}
</script>
