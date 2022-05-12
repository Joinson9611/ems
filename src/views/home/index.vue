<template>
  <div class="content-container">
    <div class="content-left">
      <div class="content-top">
        <div class="alarm-wrapper content-item">
          <div class="title">
            设备报警/正常
          </div>
          <div class="chart">
            <alarmChart :chart-data="alarm_state" />
          </div>
          <div class="alarm-count">
            <div v-for="(item,key) in alarm_state" :style="{color:item.color}" :key="key" class="count-item" >
              <div class="label" >
                {{ item.name }}
              </div>
              <div class="number">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
        <div class="count-wrapper">
          <div class="count-item content-item">
            <div class="icon-device">
              <img src="../../assets/home_images/device.png" alt="">
            </div>
            <div class="title" style="margin-left: 90px">
              设备总数
            </div>
            <div class="number">
              {{ device_count }}
            </div>
          </div>
          <div class="count-item content-item">
            <div class="icon-member">
              <img src="../../assets/home_images/member.png" alt="">
            </div>
            <div class="title" style="margin-left: 90px">
              人员总数
            </div>
            <div class="number">
              {{ user_count }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-bottom content-item">
        <div class="bg-mask"/>
        <el-form label-width="80px">
          <el-form-item label="项目详情" class="dialog-form-item" />
          <el-form-item label="项目名称:" class="dialog-form-item" >
            <span>{{ projectInfo.name }}</span>
          </el-form-item>
          <el-form-item label="项目地址:" class="dialog-form-item" >
            <span>{{ projectInfo.address }}</span>
          </el-form-item>
          <el-form-item label="项目描述:" class="dialog-form-item" >
            <span>{{ projectInfo.label }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content-right">
      <div v-for="(item,key) in alarmDeviceList" :key="key" class="alarm-item">
        <div class="inner-content">
          <div class="header">
            <div class="img-wrapper">
              <img :src="require(`../../assets/home_images/${item.device_type_id}.png`)" >
            </div>
          </div>
          <div class="title-name">
            {{ getTypeName(item.device_type_id) }}
          </div>
          <div class="normal">
            正常<span>
              <count-to v-if="item.device_type_id !== 104" :start-val="0" :end-val="item.count.total - item.count.alarm_count" :duration="3600" />
              <count-to v-else :start-val="0" :end-val="item.count.total - item.count.c_count - item.count.t_count" :duration="3600" />
            </span>
          </div>
          <div class="bottom">
            <div class="alarm">
              报警<span>
                <count-to v-if="item.device_type_id !== 104" :start-val="0" :end-val="item.count.alarm_count" :duration="3600" />
                <count-to v-else :start-val="0" :end-val="item.count.c_count + item.count.t_count" :duration="3600" />
              </span>
            </div>
            <div class="offline">
              离线<span><count-to :start-val="0" :end-val="item.count.offline_count" :duration="3600" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { homepage } from '@/api/homepage.js'
import { getProjectInfo } from '@/api/project.js'
import { mapGetters } from 'vuex'
import alarmChart from './components/alarmChart'
import CountTo from 'vue-count-to'
export default {
  components: {
    alarmChart,
    CountTo
  },
  data() {
    return {
      alarm_state: [
        { name: '设备报警', value: 0, per: 0, color: '#ea263d' },
        { name: '设备正常', value: 0, per: 0, color: '#28ce9f' }
      ],
      user_count: 0,
      device_count: 0,
      alarmDeviceList: [],
      projectInfo: {
        name: '',
        label: '',
        address: ''

      }
    }
  },
  computed: {
    ...mapGetters(['selected_project_id'])
  },
  created() {
    this.getHomepage()
    this.getProjectInfo()
  },
  methods: {
    getTypeName(typeId) {
      switch (typeId + '') {
        case '51':
          return '无线烟感'
        case '101':
          return '水位监测模块'
        case '102':
          return '水压监测模块'
        case '103':
          return '水浸监测模块'
        case '104':
          return '电气火灾模块'
        case '201':
          return 'AI火灾识别'
        case '202':
          return 'AI消防通道'
        case '203':
          return 'AI电梯'
        case '204':
          return 'AI监护'
        case '301':
          return 'WIFI烟感'
        case '302':
          return '可燃气体探测器'
        case '303':
          return '红外双鉴探测器'
      }
    },
    getPercentage(num, total) {
      if (total === 0) {
        return 0
      } else {
        const per = num / total
        if ([0, 1].includes(per)) {
          return per * 100
        } else {
          return (per * 100).toFixed(2)
        }
      }
    },
    getProjectInfo() {
      getProjectInfo({ project_id: this.selected_project_id }).then(res => {
        this.projectInfo = res.data
      })
    },
    getHomepage() {
      homepage({ project_id: this.selected_project_id }).then(res => {
        const { total, alarm_count, user_count } = res.data.header
        const normal_count = total - alarm_count
        this.alarm_state[0].per = this.getPercentage(alarm_count, total)
        this.alarm_state[1].per = this.getPercentage(normal_count, total)
        this.alarm_state[0].value = alarm_count
        this.alarm_state[1].value = normal_count
        this.user_count = user_count
        this.device_count = total
        this.alarmDeviceList = res.data.items
        console.log(this.alarmDeviceList)
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
  $margin: 10px;
  .content-container {
    background-color: #f0f2f5;
    height: calc(100vh - 50px);
    padding: 10px;
    padding-right: 0;
    display: flex;
    /deep/.el-form-item__label {
      color: #fff;
    }
    /deep/.el-form-item__content {
      color: #fff;
    }
    /deep/.el-form {
      position: absolute;
      z-index: 9999;
    }
    .content-item {
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      border-radius: 4px;
      padding: 10px;
      background-color: #fff;
      flex: 1;
      .title {
        font-size: 14px;
        color: #3d44c0;
      }
    }
    .content-left {
      display: flex;
      flex-direction: column;
      flex: 0 0 500px;
      margin-right: $margin;
      .content-top {
        display: flex;
        flex: 0 0 300px;
        margin-bottom: $margin;
        .alarm-wrapper {
          flex: 1;
          margin-right: $margin;
          .chart {
            display: flex;
            justify-content: center;
            margin-top: 10px;
            width: 100%;
            height: 200px;
          }
          .alarm-count {
            display: flex;
            .count-item {
              flex: 1;
              text-align: center;
              .label {
                margin-bottom: 5px;
              }
              .number {
                font-size: 22px;
              }
            }
          }
        }
        .count-wrapper {
          display: flex;
          flex-direction: column;
          flex: 1;
          .count-item {
            position: relative;
            flex: 1;
            margin-bottom: $margin;
            .icon-device,.icon-member {
              position: absolute;
              height: 100%;
              top: 0;
              left: 0;
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
              width: 90px;
              background: #3d44c0;
              img {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate(0,-50%);
                width: 50px;
                height: 80px;
              }
            }
            .number {
              color: #3d44c0;
              font-size: 30px;
              position: absolute;
              top: 43%;
              // transform:translateY(-50%);
              left: 100px;
            }
            &:last-child {
              margin: 0;
            }
          }
        }
      }
      .content-bottom {
        position: relative;
        background-size: 100% 100%;
        background-image: url('~@/assets/home_images/building.png');
        .bg-mask {
          border-radius: 4px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(61,68,192,.8);
        }
      }
    }
    .content-right {
      overflow: auto;
      display: flex;
      flex: 1;
      align-content: flex-start;
      flex-wrap: wrap;
      .alarm-item {
        position: relative;
        height: 230px;
        flex:0 0 33.3%;
        .inner-content {
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          padding: 15px;
          position: absolute;
          top: 0px;
          bottom: 10px;
          left: 0px;
          right: 10px;
          .header {
            .img-wrapper {
              width: 60px;
              height: 60px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .title-name {
            font-size: 18px;
            margin-top: 5px;
          }
          .normal {
            margin-top: 8px;
            color: #28ce9f;
            span {
              display: inline-block;
              float: right;
            }
          }
          .bottom {
            margin-top: 40px;
            .alarm {
              margin-bottom: 10px;
              color: #ea263d;
              span {
                display: inline-block;
                float: right;
              }
            }
            .offline {
              color: black;
              span {
                display: inline-block;
                float: right;
              }
            }
          }
        }
        // &:nth-child(3n) {
        //   margin-right: 0;
        // }
      }
    }
  }
</style>
