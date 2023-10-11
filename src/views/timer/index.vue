<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="paramGetTimerInfoList.timer" placeholder="定时器名称" style="width: 300px;" class="filter-item" @keyup.enter.native="onSearch" />
      <!-- <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button> -->
      <el-button v-waves v-if="isUpdateShow" class="filter-item" type="primary" icon="el-icon-plus" @click="openDialogTimerAdd">新建</el-button>
      <el-button v-waves v-if="isUpdateShow" :disabled="multipleSelection.length===0" class="filter-item" type="danger" icon="el-icon-delete" @click="onTimerSubmitsDelete">删除</el-button>
    </div>

    <el-table
      v-loading="isTimerInfoListLoadingShow"
      :data="timerInfoList"
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
          {{ scope.$index + 1 + (paramGetTimerInfoList.page - 1) * paramGetTimerInfoList.limit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="定时器名称">
        <template slot-scope="scope">
          <a style="color: #409EFF" @click="openDialogTimerEdit(scope.row)"><i>{{ scope.row.timer }}</i></a>
        </template>
      </el-table-column>

      <el-table-column align="center" label="触发时间">
        <template slot-scope="scope">
          <span>{{ FormatDate(scope.row.trigger_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="isUpdateShow" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleTimerscenes(scope.row)">绑定</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="paramGetTimerInfoList.page" :limit.sync="paramGetTimerInfoList.limit" @pagination="getTimersInfoList" />
    <el-dialog :visible.sync="isDialogTimerShow" :append-to-body="true" :close-on-click-modal="false" :title="isEdit? '编辑定时器' : '新建定时器'" @close="closeTimer">
      <el-form ref="formTimer" :model="paramTimerInfo" :rules="TimerInfoRules" label-width="100px">
        <el-form-item label="定时器名称" class="dialog-form-item" prop="timer">
          <el-input v-model="paramTimerInfo.timer" type="text" />
        </el-form-item>
        <el-form-item label="触发时间" class="dialog-form-item" prop="trigger_time">
          <el-time-picker
            v-model="paramTimerInfo.trigger_time"
            format="HH:mm"
            value-format="2010-01-01 HH:mm:00"
            placeholder="任意时间点"
          />
        </el-form-item>
        <el-form-item label="描述" class="dialog-form-item">
          <el-input v-model="paramTimerInfo.label" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="closeDialogTimerAdd">取消</el-button>
        <el-button v-waves v-if="isUpdateShow" :loading="isDialogTimerLoadingShow" type="primary" @click.native="onTimerSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :visible.sync="issceneDialogShow"
      title="场景绑定"
      direction="ltr"
      size="50%"
    >
      <div class="body-wrapper">
        <el-form label-width="100px">
          <el-form-item label="定时器名称" class="dialog-form-item" prop="timer">
            <span>{{ timerInfo.timer }}</span>
          </el-form-item>
          <el-form-item label="触发时间" class="dialog-form-item">
            <span>{{ timerInfo.trigger_time }}</span>
          </el-form-item>
          <el-form-item label="描述" class="dialog-form-item">
            <span>{{ timerInfo.label }}</span>
          </el-form-item>
          <el-card shadow="never" class="project-list" body-style="padding: 0;">
            <div slot="header" class="clearfix">
              <span style="line-height: 29px">已绑定场景列表</span>
              <div class="button" style="float: right">
                <!--新建-->
                <el-button v-waves class="filter-item" style="margin-left: 10px" size="mini" type="primary" icon="el-icon-plus" @click="isDialogHandleTimerscenesShow = true">新建</el-button>
                <!--删除-->
                <el-button v-waves v-loading="isTimerscenesDeleteLoading" :disabled="sceneselection.length===0" size="mini" class="filter-item" type="danger" icon="el-icon-delete" @click="deleteTimerscenes">删除</el-button>
              </div>
            </div>

            <el-table
              v-loading="isTimerscenesLoadingShow"
              :data="sceneList"
              element-loading-text="Loading"
              style="width: 100%;"
              fit
              max-height="400px"
              highlight-current-row
              @selection-change="handleTimerscenesSelectionChange"
            >
              <el-table-column
                type="selection"
                align="center"
                width="50"
              />
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
              </el-table-column>
              <el-table-column label="场景名称" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.scene_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="描述" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.label || '/' }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="sceneTotal>0" :total="sceneTotal" :page.sync="paramsGetTimerscenesList.page" :limit.sync="paramsGetTimerscenesList.limit" @pagination="getTimerscenesInfoList" />
          </el-card>
        </el-form>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="isDialogHandleTimerscenesShow" :append-to-body="true" :close-on-click-modal="false" title="场景" >
      <el-form ref="formTimerscenes" :model="formTimerscenes" :rules="TimerscenesInfoRules" label-width="100px">
        <el-form-item label="场景" class="dialog-form-item" prop="scene_id">
          <el-select v-model="formTimerscenes.scene_id" filterable placeholder="请选择场景" >
            <el-option v-for="item in sceneOptions" :key="item.scene_id" :label="item.scene" :value="item.scene_id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 20px;margin-top: 0;">
        <el-button v-waves @click.native="isDialogHandleTimerscenesShow = false">取消</el-button>
        <el-button v-waves :loading="isDialogTimerscenesLoadingShow" type="primary" @click.native="onTimerscenesSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { contains } from '@/utils/tools'
import { getScenesList } from '@/api/scenes'
import { Formattimestamp, FormatDate } from '@/utils/time'
import { getTimersInfoList, deleteTimers, addTimers, updateTimers } from '@/api/timers'
import { getTimerscenesInfoList, addTimerscenes, deleteTimerscenes } from '@/api/timerscenes'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'Timer',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      multipleSelection: [],
      sceneselection: [],
      timerInfoList: [],
      sceneList: [],
      isTimerscenesDeleteLoading: false,
      isTimerInfoListLoadingShow: false,
      isDialogTimerShow: false,
      isDialogTimerLoadingShow: false,
      isDialogEditTimerLoadingShow: false,
      isDialogTimerscenesLoadingShow: false,
      issceneDialogShow: false,
      isDialogHandleTimerscenesShow: false,
      isTimerscenesEdit: false,
      isEdit: false,

      isUpdateShow: false,

      total: 0,

      sceneTotal: 0,

      paramsGetTimerscenesList: {
        page: 1,
        project_id: undefined,
        timer_id: undefined
      },

      timerInfo: {
        timer: undefined,
        label: undefined
      },

      sceneInfo: {
        project_id: undefined,
        timerscenes: undefined,
        label: undefined,
        scene_id: undefined
      },

      tempFilterOptions: {
        timer: undefined
      },

      sceneOptions: [],

      paramGetTimerInfoList: {
        project_id: undefined,
        timer: undefined,
        page: 1,
        limit: 20
      },

      formTimerscenes: {
        scene_id: undefined,
        timer_id: undefined
      },

      paramTimerInfo: {
        timer_id: undefined,
        timer: undefined,
        label: undefined,
        trigger_time: undefined
      },

      TimerscenesInfoRules: {
        scene_id: [{ required: true, trigger: 'blur', message: '请选择场景' }]
      },
      TimerInfoRules: {
        timer: [{ required: true, trigger: 'blur', message: '请输入定时器名称' }],
        trigger_time: [{ required: true, trigger: 'change', message: '请选择触发时间' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id', 'roles'
    ])
  },
  created() {
    this.isUpdateShow = contains('352', this.roles)
    this.getTimersInfoList()
    this.getScenesList()
  },

  methods: {
    getScenesList() {
      getScenesList({ project_id: this.selected_project_id }).then(res => {
        this.sceneOptions = res.data.items
      }).catch(() => {})
    },

    closeTimer() {
      this.paramTimerInfo.timer = undefined
      this.paramTimerInfo.label = undefined
      this.paramTimerInfo.trigger_time = undefined
      this.isEdit = false
    },

    getTime(time) {
      return Formattimestamp(time)
    },

    closeTimerscenesDialog() {
      this.isDialogHandleTimerscenesShow = false
      this.sceneInit()
      if (this.$refs.formTimerscenes !== undefined) this.$refs.formTimerscenes.resetFields()
      this.isTimerscenesEdit = false
    },
    openEditTimerscenes(info) {
      this.isDialogHandleTimerscenesShow = true
      this.sceneInfo.scene_id = info.scene_id
    },
    FormatDate(timestamp) {
      return FormatDate(timestamp)
    },
    handleTimerscenesSelectionChange(val) {
      this.sceneselection = val
    },
    deleteTimerscenes() {
      this.$confirm('确认删除选中场景吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const requestDeleteParams = {
          project_id: this.selected_project_id,
          scene_id_list: this.sceneselection.map(item => item.scene_id),
          timer_id: this.paramsGetTimerscenesList.timer_id
        }
        deleteTimerscenes(requestDeleteParams).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getTimerscenesInfoList()
        }).catch(err => {
          console.log(err)
        })
      })
    },

    onTimerscenesSubmit() {
      this.$refs.formTimerscenes.validate(valid => {
        if (valid) {
          const param = {
            project_id: this.selected_project_id,
            scene_id: this.formTimerscenes.scene_id,
            timer_id: this.paramsGetTimerscenesList.timer_id
          }
          addTimerscenes(param).then(() => {
            this.$message({ type: 'success', message: '新建成功' })
            this.isDialogHandleTimerscenesShow = false
            this.getTimerscenesInfoList()
          }).catch(() => {
            this.isDialogHandleTimerscenesShow = false
          })
        }
      })
    },

    handleTimerscenes({ timer, label, timer_id, trigger_time }) {
      this.timerInfo.timer = timer
      this.timerInfo.label = label
      this.timerInfo.trigger_time = this.FormatDate(trigger_time, 'day')
      this.paramsGetTimerscenesList.timer_id = timer_id
      this.paramsGetTimerscenesList.project_id = this.selected_project_id
      this.getTimerscenesInfoList()
      this.issceneDialogShow = true
    },

    sceneInit() {
      this.sceneInfo.scene_id = undefined
    },
    getTimerscenesInfoList() {
      getTimerscenesInfoList(this.paramsGetTimerscenesList).then(res => {
        this.sceneList = res.data.items
        this.sceneTotal = res.data.total
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
     * @Description: 获取定时器信息列表
     * @Date: 2019/6/27
     **/
    getTimersInfoList() {
      const Params = {
        project_id: this.selected_project_id,
        page: this.paramGetTimerInfoList.page,
        limit: this.paramGetTimerInfoList.limit,
        timer: this.paramGetTimerInfoList.timer
      }
      this.isTimerInfoListLoadingShow = true
      getTimersInfoList(Params).then(res => {
        this.timerInfoList = res.data.items
        this.total = res.data.total
        this.isTimerInfoListLoadingShow = false
      }).catch(err => {
        this.isTimerInfoListLoadingShow = false
        console.error(err)
      })
    },
    onSearch() {
      this.paramGetTimerInfoList.page = 1
      this.getTimersInfoList()
    },
    /**
     * @Description: 删除指定ID的定时器
     * @Date: 2019/6/27
     **/
    onTimerSubmitsDelete() {
      this.$confirm('确认删除已选中的定时器？', '提示', {
        type: 'warning'
      }).then(() => {
        const Params = {
          project_id: this.selected_project_id,
          timer_id_list: this.multipleSelection.map(item => item.timer_id)
        }
        deleteTimers(Params).then(() => {
          this.getTimersInfoList()
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
     * @Description: 打开定时器添加对话框
     * @Date: 2019/6/28
     **/
    openDialogTimerAdd() {
      this.paramTimerInfo.timer = undefined
      this.paramTimerInfo.label = undefined
      this.paramTimerInfo.trigger_time = undefined
      this.isDialogTimerShow = true
      // if (this.$refs.formTimer !== undefined) {
      //   this.$refs.formTimer.resetFields()
      // }
    },
    /**
     * @Description: 关闭定时器添加对话框
     * @Date: 2019/6/28
     **/
    closeDialogTimerAdd() {
      this.isDialogTimerShow = false
    },

    /**
     * @Description: 确认添加新定时器
     * @Date: 2019/6/28
     **/
    onTimerSubmit() {
      this.$refs.formTimer.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.isDialogTimerLoadingShow = true
            const Params = {
              project_id: this.selected_project_id,
              timer: this.paramTimerInfo.timer,
              timer_id: this.paramTimerInfo.timer_id,
              label: this.paramTimerInfo.label,
              trigger_time: new Date(this.paramTimerInfo.trigger_time).getTime() / 1000
            }
            updateTimers(Params).then(() => {
              this.isDialogTimerLoadingShow = false
              this.getTimersInfoList()
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.isDialogTimerShow = false
            }).catch(err => {
              this.isDialogTimerLoadingShow = false
              console.error(err)
            })
          } else {
            this.isDialogTimerLoadingShow = true
            const Params = {
              project_id: this.selected_project_id,
              timer: this.paramTimerInfo.timer,
              label: this.paramTimerInfo.label,
              trigger_time: new Date(this.paramTimerInfo.trigger_time).getTime() / 1000
            }
            addTimers(Params).then(() => {
              this.isDialogTimerLoadingShow = false
              this.getTimersInfoList()
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.isDialogTimerShow = false
            }).catch(err => {
              this.isDialogTimerLoadingShow = false
              console.error(err)
            })
          }
        }
      })
    },
    /**
     * @Description: 打开定时器编辑对话框
     * @Date: 2019/6/28
     **/
    openDialogTimerEdit(info) {
      this.paramTimerInfo.timer_id = info.timer_id
      this.paramTimerInfo.timer = info.timer
      this.paramTimerInfo.label = info.label
      this.paramTimerInfo.trigger_time = this.getTime(info.trigger_time)
      this.isEdit = true
      this.isDialogTimerShow = true
    },
    /**
     * @Description: 关闭定时器编辑对话框
     * @Date: 2019/6/28
     **/
    closeDialogTimerEdit() {
      this.isDialogEditTimerShow = false
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
