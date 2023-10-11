<template >
  <div class="app-main">
    <el-form ref="formProjectInfo" :model="projectInfo" :rules="projectInfoRules" label-width="125px">
      <div>
        <el-form-item label="项目名称：" prop="name">
          <el-input v-model="projectInfo.name" :disabled="isEditDisable" placeholder="请输入项目名称" type="text"/>
        </el-form-item>
        <el-form-item label="项目描述：">
          <el-input v-model="projectInfo.label" :disabled="isEditDisable" placeholder="请输入项目描述" type="textarea"/>
        </el-form-item>
        <el-form-item label="项目地址：" prop="address">
          <el-select :disabled="isEditDisable" v-model="projectInfo.province_id" placeholder="省" @change="provinceChange">
            <el-option v-for="item in provinceOptions" :key="item.province_id" :label="item.province_name" :value="item.province_id"/>
          </el-select>
          <el-select :disabled="isEditDisable" v-model="projectInfo.city_id" placeholder="市" @change="cityChange">
            <el-option v-for="item in cityOptions" :key="item.city_id" :label="item.city_name" :value="item.city_id"/>
          </el-select>
          <el-select :disabled="isEditDisable" v-model="projectInfo.district_id" placeholder="区" @change="districtChange">
            <el-option v-for="item in districtOptions" :key="item.district_id" :label="item.district_name" :value="item.district_id"/>
          </el-select>
          <el-select :disabled="isEditDisable" v-model="projectInfo.street_id" placeholder="街道">
            <el-option v-for="item in streetOptions" :key="item.street_id" :label="item.street_name" :value="item.street_id"/>
          </el-select>
          <el-input :disabled="isEditDisable" v-model="projectInfo.address" style="margin-top: 20px" placeholder="请输入项目地址" type="text"/>
        </el-form-item>
        <el-form-item label="立项时间：">
          <el-date-picker v-model="projectInfo.create_time" disabled type="datetime" placeholder="请选择立项时间" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="项目负责人：" prop="leader">
          <el-input v-model="projectInfo.leader" :disabled="isEditDisable" placeholder="请输入项目负责人" type="text"/>
        </el-form-item>
        <el-form-item label="负责人电话：" prop="leader_phone">
          <el-input v-model="projectInfo.leader_phone" :disabled="isEditDisable" placeholder="请输入负责人电话" type="text"/>
        </el-form-item>
      </div>
      <div style="margin-top: 24px;">
        <el-row :gutter="32">
          <el-col :span="12" :xs="24">
            <el-form-item label="维保单位：" prop="m_company_name">
              <el-input v-model="projectInfo.m_company_name" :disabled="isEditDisable" placeholder="请输入维保单位名称" type="text"/>
            </el-form-item>
            <el-form-item label="维保单位电话：" prop="m_company_phone">
              <el-input v-model="projectInfo.m_company_phone" :disabled="isEditDisable" placeholder="请输入维保单位电话" type="text"/>
            </el-form-item>
            <el-form-item label="维保负责人：" prop="m_company_leader">
              <el-input v-model="projectInfo.m_company_leader" :disabled="isEditDisable" placeholder="请输入维保负责人" type="text"/>
            </el-form-item>
            <el-form-item label="负责人电话：" prop="m_leader_phone">
              <el-input v-model="projectInfo.m_leader_phone" :disabled="isEditDisable" placeholder="请选择维保负责人电话" type="text"/>
            </el-form-item>
            <el-form-item label="单位性质：" prop="extension.project_type">
              <el-input v-model="projectInfo.extension.project_type" :disabled="isEditDisable" placeholder="请填写单位性质" type="text"/>
            </el-form-item>
            <el-form-item label="组织机构代码：" prop="extension.org_code">
              <el-input v-model="projectInfo.extension.org_code" :disabled="isEditDisable" placeholder="请填写组织机构代码" type="text"/>
            </el-form-item>
            <el-form-item label="单位电话：" prop="extension.phone">
              <el-input v-model="projectInfo.extension.phone" :disabled="isEditDisable" placeholder="请填写单位电话" type="text"/>
            </el-form-item>
            <el-form-item label="消防管辖单位：" prop="extension.fire_authority">
              <el-input v-model="projectInfo.extension.fire_authority" :disabled="isEditDisable" placeholder="请填写消防管辖单位" type="text"/>
            </el-form-item>
            <el-form-item label="火灾等级：" prop="extension.fire_level">
              <el-input v-model="projectInfo.extension.fire_level" :disabled="isEditDisable" placeholder="请填写火灾等级" type="text"/>
            </el-form-item>
            <el-form-item label="消防安全负责人姓名：" prop="extension.spic_name">
              <el-input v-model="projectInfo.extension.spic_name" :disabled="isEditDisable" placeholder="请填写消防安全负责人姓名" type="text"/>
            </el-form-item>
            <el-form-item label="消防安全负责人电话：" prop="extension.spic_phone">
              <el-input v-model="projectInfo.extension.spic_phone" :disabled="isEditDisable" placeholder="请填写消防安全管理人电话" type="text"/>
            </el-form-item>
            <el-form-item label="消防安全责任人身份证号：" prop="extension.spic_id">
              <el-input v-model="projectInfo.extension.spic_id" :disabled="isEditDisable" placeholder="请填写消防安全责任人身份证号" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="物业单位：" prop="pm_company_name">
              <el-input v-model="projectInfo.pm_company_name" :disabled="isEditDisable" placeholder="请输入物业单位名称" type="text"/>
            </el-form-item>
            <el-form-item label="物业单位电话：" prop="pm_company_phone">
              <el-input v-model="projectInfo.pm_company_phone" :disabled="isEditDisable" placeholder="请输入物业单位电话" type="text"/>
            </el-form-item>
            <el-form-item label="物业负责人：" prop="pm_company_leader">
              <el-input v-model="projectInfo.pm_company_leader" :disabled="isEditDisable" placeholder="请输入物业负责人" type="text"/>
            </el-form-item>
            <el-form-item label="负责人电话：" prop="pm_leader_phone">
              <el-input v-model="projectInfo.pm_leader_phone" :disabled="isEditDisable" placeholder="请输入物业负责人电话" type="text"/>
            </el-form-item>
            <el-form-item label="消防安全管理人姓名：" prop="extension.sm_name">
              <el-input v-model="projectInfo.extension.sm_name" :disabled="isEditDisable" placeholder="请填写消防安全管理人姓名" type="text"/>
            </el-form-item>
            <el-form-item label="消防安全管理人电话：" prop="extension.sm_phone">
              <el-input v-model="projectInfo.extension.sm_phone" :disabled="isEditDisable" placeholder="请填写消防安全管理人姓名" type="text"/>
            </el-form-item>
            <el-form-item label="消防安全管理人身份证号：" prop="extension.sm_id">
              <el-input v-model="projectInfo.extension.sm_id" :disabled="isEditDisable" placeholder="请填写消防安全管理人身份证号" type="text"/>
            </el-form-item>
            <el-form-item label="企业法人姓名：" prop="extension.lr_name">
              <el-input v-model="projectInfo.extension.lr_name" :disabled="isEditDisable" placeholder="请填写企业法人姓名" type="text"/>
            </el-form-item>
            <el-form-item label="企业法人电话：" prop="extension.lr_phone">
              <el-input v-model="projectInfo.extension.lr_phone" :disabled="isEditDisable" placeholder="请填写企业法人电话" type="text"/>
            </el-form-item>
            <el-form-item label="企业法人身份证号：" prop="extension.lr_id">
              <el-input v-model="projectInfo.extension.lr_id" :disabled="isEditDisable" placeholder="请填写企业法人身份证号" type="text"/>
            </el-form-item>
            <el-form-item label="行政区域：" prop="extension.region">
              <el-input v-model="projectInfo.extension.region" :disabled="isEditDisable" placeholder="请填写行政区域" type="text"/>
            </el-form-item>
            <el-form-item label="单位成立时间：" prop="extension.e_time">
              <el-date-picker
                :disabled="isEditDisable"
                v-model="projectInfo.extension.e_time"
                type="date"
                placeholder="请选择单位成立时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd HH:mm:ss"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item style="margin-top: 40px">
        <el-button v-waves v-if="!isEditDisable" :loading="isButtonUpdateLoadingShow" type="primary" @click.native="onProjectModify">提交信息</el-button>
        <el-button v-waves v-if="isEditDisable && isProjectInfoEditShow" type="primary" @click.native="onEditInfoEnable">编辑信息</el-button>
        <el-button v-waves v-if="!isEditDisable" type="danger" @click.native="onEditInfoDisable">取消编辑</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getProvinces, getCities, getDistricts, getStreets } from '@/api/address'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import { getProjectInfo, editProjectInfo } from '@/api/project'
export default {
  directives: { waves },
  data() {
    return {
      isProjectInfoEditShow: false,
      isEditDisable: true,
      isButtonUpdateLoadingShow: false,
      CompanyOptions: [],
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],
      streetOptions: [],
      projectInfoRules: {
        name: { required: true, message: '请输项目名称', trigger: 'change' },
        address: [{ required: true, message: '项目地址不能为空', trigger: 'change' }],
        leader: [{ required: true, message: '请输入项目负责人', trigger: 'change' }],
        leader_phone: [{ required: true, message: '请输入项目负责人电话', trigger: 'change' }],
        m_company_name: [{ required: true, message: '请输入维保单位名称', trigger: 'change' }],
        m_company_id: [{ required: true, message: '请选择维保单位', trigger: 'change' }],
        m_company_phone: [{ required: true, message: '请输入维保单位电话', trigger: 'change' }],
        m_company_leader: [{ required: true, message: '请输入维保负责人', trigger: 'change' }],
        m_leader_phone: [{ required: true, message: '请输入维保负责人电话', trigger: 'change' }],
        pm_company_name: [{ required: true, message: '请输入物业单位名称', trigger: 'change' }],
        pm_company_id: [{ required: true, message: '请选择物业单位', trigger: 'change' }],
        pm_company_phone: [{ required: true, message: '请输入物业单位电话', trigger: 'change' }],
        pm_company_leader: [{ required: true, message: '请输入物业负责人', trigger: 'change' }],
        pm_leader_phone: [{ required: true, message: '请输入物业负责人电话', trigger: 'change' }],
        'extension.org_code': [{ required: true, message: '请输入组织机构代码', trigger: 'change' }],
        'extension.phone': [{ required: true, message: '请输入单位电话', trigger: 'change' }],
        'extension.fire_authority': [{ required: true, message: '请输入消防管辖单位', trigger: 'change' }],
        'extension.fire_level': [{ required: true, message: '请输入火灾等级', trigger: 'change' }],
        'extension.spic_name': [{ required: true, message: '请输入消防安全责任人姓名', trigger: 'change' }],
        'extension.spic_phone': [{ required: true, message: '请输入消防安全责任人电话', trigger: 'change' }],
        'extension.spic_id': [{ required: true, message: '请输入消防安全责任人身份证号', trigger: 'change' }],
        'extension.sm_name': [{ required: true, message: '请输入消防安全管理人姓名', trigger: 'change' }],
        'extension.sm_phone': [{ required: true, message: '请输入消防安全管理人电话', trigger: 'change' }],
        'extension.sm_id': [{ required: true, message: '请输入消防安全管理人身份证号', trigger: 'change' }],
        'extension.lr_name': [{ required: true, message: '请输入企业法人姓名', trigger: 'change' }],
        'extension.lr_phone': [{ required: true, message: '请输入企业法人电话', trigger: 'change' }],
        'extension.lr_id': [{ required: true, message: '请输入企业法人身份证号', trigger: 'change' }],
        'extension.region': [{ required: true, message: '请输入行政区域', trigger: 'change' }],
        'extension.e_time': [{ required: true, message: '请选择单位成立时间', trigger: 'change' }],
        'extension.project_type': [{ required: true, message: '请填写单位性质', trigger: 'change' }]
      },
      projectInfo: {
        province_id: undefined,
        city_id: undefined,
        district_id: undefined,
        street_id: undefined,
        project_id: undefined,
        name: undefined,
        address: undefined,
        label: undefined,
        leader: undefined,
        leader_phone: undefined,
        create_time: undefined,
        m_company_id: undefined,
        m_company_phone: undefined,
        m_company_leader: undefined,
        m_leader_phone: undefined,
        m_company_name: undefined,
        pm_company_name: undefined,
        pm_company_id: undefined,
        pm_company_phone: undefined,
        pm_company_leader: undefined,
        pm_leader_phone: undefined,
        project_type: undefined,
        extension: {
          org_code: undefined,
          phone:	undefined,
          fire_authority:	undefined,
          fire_level:	undefined,
          spic_name:	undefined,
          spic_phone:	undefined,
          spic_id:	undefined,
          sm_name:	undefined,
          sm_phone:	undefined,
          sm_id:	undefined,
          lr_name:	undefined,
          lr_phone:	undefined,
          lr_id:	undefined,
          region:	undefined,
          e_time:	undefined,
          project_type: undefined
        }
      },
      requestEditProjectInfo: {
        project_id: undefined,
        province_id: undefined,
        city_id: undefined,
        district_id: undefined,
        street_id: undefined,
        name: undefined,
        label: undefined,
        leader: undefined,
        leader_phone: undefined,
        m_company_id: undefined,
        m_company_phone: undefined,
        m_company_leader: undefined,
        m_leader_phone: undefined,
        m_company_name: undefined,
        pm_company_name: undefined,
        pm_company_id: undefined,
        pm_company_phone: undefined,
        pm_company_leader: undefined,
        pm_leader_phone: undefined,

        extension: {
          org_code: undefined,
          phone:	undefined,
          fire_authority:	undefined,
          fire_level:	undefined,
          spic_name:	undefined,
          spic_phone:	undefined,
          spic_id:	undefined,
          sm_name:	undefined,
          sm_phone:	undefined,
          sm_id:	undefined,
          lr_name:	undefined,
          lr_phone:	undefined,
          lr_id:	undefined,
          region:	undefined,
          e_time:	undefined,
          project_type: undefined
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id',
      'Account_Type'
    ])
  },
  watch: {
    'projectInfo.province_id': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal && curVal !== undefined) {
          this.cityOptions = undefined
          this.districtOptions = undefined
          this.streetOptions = undefined
          this.getCities()
        }
      },
      deep: true,
      immediate: true
    },
    'projectInfo.city_id': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal && curVal !== undefined) {
          this.districtOptions = undefined
          this.streetOptions = undefined
          this.getDistricts()
        }
      },
      deep: true,
      immediate: true
    },
    'projectInfo.district_id': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal && curVal !== undefined) {
          this.streetOptions = undefined
          this.getStreets()
        }
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    this.getAccountType()
    this.getProjectInfo()
    this.getProvinces()
  },
  methods: {
    provinceChange() {
      this.projectInfo.city_id = undefined
      this.projectInfo.district_id = undefined
      this.projectInfo.street_id = undefined
    },
    cityChange() {
      this.projectInfo.district_id = undefined
      this.projectInfo.street_id = undefined
    },
    districtChange() {
      this.projectInfo.street_id = undefined
    },
    /**
     * @Description: 获取省份列表
     * @Date: 2021/7/29
     **/
    getProvinces() {
      getProvinces().then(response => {
        this.provinceOptions = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 获取城市列表
     * @Date: 2021/7/29
     **/
    getCities() {
      const params = {
        province_id: this.projectInfo.province_id
      }
      getCities(params).then(response => {
        this.cityOptions = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 获取区列表
     * @Date: 2021/7/29
     **/
    getDistricts() {
      const params = {
        city_id: this.projectInfo.city_id
      }
      getDistricts(params).then(response => {
        this.districtOptions = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 获取街道列表
     * @Date: 2021/7/29
     **/
    getStreets() {
      const params = {
        district_id: this.projectInfo.district_id
      }
      getStreets(params).then(response => {
        this.streetOptions = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 获取账号类型
     * @Date: 2021/7/29
     **/
    getAccountType() {
      this.isProjectInfoEditShow = [1, 2, 10].includes(this.Account_Type)
    },
    /**
     * @Description: 获取项目信息
     * @Date: 2021/7/29
     **/
    getProjectInfo() {
      const params = {
        project_id: this.selected_project_id
      }
      getProjectInfo(params).then(response => {
        if (response.data.extension === '') {
          response.data.extension = {
            org_code:	'',
            phone: '',
            fire_authority:	'',
            fire_level:	'',
            spic_name:	'',
            spic_phone:	'',
            spic_id:	'',
            sm_name:	'',
            sm_phone:	'',
            sm_id:	'',
            lr_name:	'',
            lr_phone:	'',
            lr_id:	'',
            region:	'',
            e_time: '',
            project_type: ''
          }
        } else {
          response.data.extension = JSON.parse(response.data.extension)
        }
        // response.data.extension.e_time = Formattimestamp(response.data.extension.e_time).
        this.projectInfo = response.data
        this.projectInfo.create_time = this.projectInfo.create_time * 1000

        this.$nextTick(() => {
          if (this.$refs.formProjectInfo !== undefined) this.$refs.formProjectInfo.clearValidate()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @Description: 开启编辑
     * @Date: 2021/7/29
     **/
    onEditInfoEnable() {
      this.isEditDisable = false
    },
    /**
     * @Description: 关闭编辑
     * @Date: 2021/7/29
     **/
    onEditInfoDisable() {
      if (this.$refs.formProjectInfo !== undefined) this.$refs.formProjectInfo.clearValidate()
      this.getProjectInfo()
      this.isEditDisable = true
    },
    /**
     * @Description: 提交项目信息修改
     * @Date: 2021/7/29
     **/
    onProjectModify() {
      this.$refs.formProjectInfo.validate(valid => {
        if (valid) {
          this.isButtonUpdateLoadingShow = true
          for (const key in this.projectInfo) {
            if (this.projectInfo.hasOwnProperty(key)) {
              if (key === 'extension') {
                this.requestEditProjectInfo[key] = JSON.stringify(this.projectInfo[key])
              } else {
                if (!['province_id', 'city_id', 'district_id'].includes(key)) {
                  this.requestEditProjectInfo[key] = this.projectInfo[key]
                }
              }
            }
          }
          editProjectInfo(this.requestEditProjectInfo).then(() => {
            this.isButtonUpdateLoadingShow = false
            this.isEditDisable = true
            this.$message({
              message: '项目信息更新成功',
              type: 'success'
            })
          }).catch(err => {
            this.isButtonUpdateLoadingShow = false
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-main{
    padding: 24px 20px 32px 0;
    /deep/.el-form-item__label {
      width: 200px !important;
    }
    /deep/.el-form-item__content {
      margin-left: 200px !important;
    }
  }
</style>

