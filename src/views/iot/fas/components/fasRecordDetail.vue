<template>
  <div class="app-container">
    <el-form ref="formfas" :model="paramsUpdateFasDetail" :rules="fasRules" label-width="120px">
      <el-form-item label="设备ID：" class="item-container">
        <span class="item-text">{{ fasRecordInfo.device_id }}</span>
      </el-form-item>
      <el-form-item label="设备类型：" class="item-container">
        <span class="item-text">{{ fasRecordInfo.device_type || '/' }}</span>
      </el-form-item>
      <el-form-item label="设备地点：" class="item-container">
        <span class="item-text">{{ fasRecordInfo.device_label || '/' }}</span>
      </el-form-item>
      <el-form-item label="报警类型：" class="item-container">
        <span class="item-text">{{ alarmMap[fasRecordInfo.alarm_type_id] }}</span>
      </el-form-item>
      <el-form-item label="报警时间：" class="item-container">
        <span class="item-text">{{ getTime(fasRecordInfo.alarm_time) }}</span>
      </el-form-item>
      <el-form-item label="现场照片：" class="item-container">
        <viewer v-if="result_pic.length !== 0" :images="result_pic">
          <img v-for="(pic,index) in result_pic" :src="pic" :key="index" class="item-image">
        </viewer>
        <div v-else class="item-text">无</div>
      </el-form-item>
      <el-form-item label="关联设备：" class="item-container">
        <el-table
          v-loading="isDeviceLoading"
          ref="multipleTable"
          :data="relDeviceList"
          element-loading-text="Loading"
          style="width: 100%;"
          border
          fit
          highlight-current-row>
          <el-table-column label="序号" align="center" width="70">
            <template slot-scope="scope"><span>{{ scope.$index + 1 }} </span></template>
          </el-table-column>
          <el-table-column label="关联设备ID" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.device_id2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联设备类型" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.device_type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联设备建筑" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.building2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联设备楼层" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.floor2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联设备地址" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.label2 }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <br>
      <el-form-item label="核查结果：" class="item-container">
        <span :style="{color:colorMap[fasRecordInfo.handle_type_id]}" class="item-text">{{ handleStatus[fasRecordInfo.handle_type_id] }}</span>
      </el-form-item>
      <el-form-item label="核查时间：" class="item-container">
        <span class="item-text">{{ fasRecordInfo.handle_time ? getTime(fasRecordInfo.handle_time) : '/' }}</span>
      </el-form-item>
      <el-form-item label="现场核查人员：" class="item-container">
        <span class="item-text">{{ fasRecordInfo.handle_user_name ? fasRecordInfo.handle_user_name : '/' }}</span>
      </el-form-item>
      <el-form-item label="报警原因：" class="item-container" prop="handle_suggestion">
        <el-input :disabled="!isButtonSubmitShow" v-model="paramsUpdateFasDetail.handle_suggestion" type="textarea"/>
      </el-form-item>
      <el-form-item v-if="isButtonSubmitShow" style="margin-top:20px" class="item-container" prop="handle_type_id">
        <el-radio-group :disabled="!isButtonSubmitShow" v-model="paramsUpdateFasDetail.handle_type_id" border>
          <!-- <el-radio v-if="isUntreated" :label="0" border >未处理</el-radio> -->
          <el-radio v-if="isUntreated" :label="1" border>确认</el-radio>
          <el-radio v-if="isUntreated" :label="2" border >误报</el-radio>
          <el-radio v-if="isReconfirm" :label="3" border >再确认</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isButtonSubmitShow">
        <el-button v-waves style="margin-top: 10px" type="primary" @click.native="onSubmitFas">提交</el-button>
      </el-form-item>
      <el-form-item>
        <div style="text-align:right">
          <el-button v-waves style="margin-top: 10px" @click.native="onToRecord">返回前页</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDevicerelationsList2 } from '@/api/devicerelations'
import { Formattimestamp } from '@/utils/time'
import { detailFas, updateFasDetail } from '@/api/historyfas'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
export default {
  name: 'Checkedinfo',
  directives: { waves },
  data() {
    return {
      isDeviceLoading: false,
      fasRecordInfo: {
        device_id: undefined,
        history_id: undefined,
        project_id: undefined,
        device_type_id: undefined,
        device_label: undefined,
        alarm_type_id: undefined,
        alarm_time: 0,
        handle_type_id: 0,
        handle_time: 0,
        handle_user_name: undefined,
        handle_suggestion: '',
        handle_image: '',
        actionable: 0
      },
      relDeviceList: [],
      colorMap: ['#F56C6C', '#67C23A', '#E6A23C', '#67C23A'],
      handleStatus: ['未处理', '已确认', '误报', '已再确认'],
      alarmMap: ['正常', '火警', '预警', '联动', '反馈', '屏蔽', '故障', '其他'],
      paramsGetRecordDetail: {
        project_id: undefined,
        history_id: undefined
      },
      fasRules: {
        // handle_suggestion: [{ required: true, trigger: 'blur', message: '请输入报警原因' }],
        handle_type_id: [{ required: true, trigger: 'change', message: '请选择类型' }]
      },
      paramsUpdateFasDetail: {
        project_id: undefined,
        history_id: undefined,
        handle_type_id: undefined,		// 0=未处理、1=已确认、2=误报、3=已再确认
        handle_suggestion: undefined, // 报警原因
        handle_user_name: undefined	// 现场核查人员（签名）。有该参数，现场核查人为该人员；无该参数，现场核查人为user_id的nikename。
      }
    }
  },
  computed: {
    isFasAlarm() {
      return this.fasRecordInfo.alarm_type_id === 1
    },
    isButtonSubmitShow() {
      // 报火警时
      if (this.fasRecordInfo.alarm_type_id === 1) {
        return this.fasRecordInfo.actionable && [0, 1].includes(this.fasRecordInfo.handle_type_id)
      } else {
        return this.fasRecordInfo.actionable && [0].includes(this.fasRecordInfo.handle_type_id)
      }
    },
    isUntreated() {
      return this.fasRecordInfo.handle_type_id === 0
    },
    isConfirmed() {
      return [0, 1].includes(this.fasRecordInfo.handle_type_id)
    },
    isReconfirm() {
      return this.fasRecordInfo.handle_type_id === 1 && this.fasRecordInfo.alarm_type_id === 1
    },
    ...mapGetters(['selected_project_id']),
    result_pic() {
      let picArr = []
      picArr = this.fasRecordInfo.handle_image ? this.fasRecordInfo.handle_image.split(',') : []
      if (picArr.length !== 0) {
        for (let i = 0; i < picArr.length; i++) {
          picArr[i] = process.env.FILE_URL + picArr[i]
        }
      }
      return picArr
    }
  },
  created() {
    this.getParams()
    this.getFasRecord()
  },
  methods: {
    onSubmitFas() {
      this.$refs.formfas.validate(valid => {
        if (valid) {
          this.paramsUpdateFasDetail.project_id = this.selected_project_id
          this.$prompt('请填写核查人', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator(val) {
              if (!val) {
                return false
              }
            },
            inputErrorMessage: '请填写审核人'
          }).then(({ value }) => {
            this.paramsUpdateFasDetail.handle_user_name = value
            updateFasDetail(this.paramsUpdateFasDetail).then(() => {
              this.$message.success('提交成功')
              this.getFasRecord()
            }).catch(() => {

            })
          }).catch(() => {

          })
        }
      })
    },
    getFasRecord() {
      this.paramsGetRecordDetail.project_id = this.selected_project_id
      detailFas(this.paramsGetRecordDetail).then(res => {
        this.paramsUpdateFasDetail.handle_suggestion = res.data.handle_suggestion
        this.paramsUpdateFasDetail.handle_user_name = res.data.handle_user_name
        this.fasRecordInfo = res.data
        this.isDeviceLoading = true
        getDevicerelationsList2({ project_id: this.selected_project_id, device_id: res.data.device_id }).then(({ data }) => {
          this.relDeviceList = data.items
          this.isDeviceLoading = false
        }).catch(() => {
          this.isDeviceLoading = false
        })
      }).catch(() => {})
    },
    getParams() {
      this.paramsGetRecordDetail.history_id = this.$route.query.hid
      this.paramsUpdateFasDetail.history_id = this.$route.query.hid
    },
    getTime(timeStamp) {
      return Formattimestamp(timeStamp)
    },
    /**
     * @Description: 返回上一页
     * @Date: 2020/5/12
     **/
    onToRecord() {
      this.$router.push({ path: '/iot/fas', query: { alarm_type_id: this.fasRecordInfo.alarm_type_id }})
    }
  }
}
</script>

<style scoped>
.item-container{
  margin-bottom: 0;
}
.item-text{
   color: #909399;
  margin-left: 10px;
}
.item-image{
  margin-top: 16px;
  margin-right: 10px;
  width: 140px;
  height: 140px;
}
.item-container {
  margin-bottom: 10px;
}
</style>
