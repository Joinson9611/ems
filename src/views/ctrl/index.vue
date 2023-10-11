<template>
  <div class="ctrl-wrapper">
    <div class="left-wrapper">
      <div class="top-item">
        <div class="content-wrapper">
          <div class="top-part">
            <div :style="{backgroundImage:`url(${require('@/assets/ctrl_images/bgcar.png')})`}" class="right-top-icon"/>
            <div class="title">
              <div :style="{backgroundImage:`url(${require('@/assets/ctrl_images/car.png')})`}" class="title-icon"/> <span>车流量</span>
            </div>
            <div class="value" >{{ carInfo.value || 0 }}pcu/d</div>
            <div class="label">
              {{ carInfo.address + '-' + carInfo.type }}
            </div>
          </div>
          <div class="bottom-part">
            <carTable @getsenorInfo="getCarInfo"/>
          </div>
        </div>
      </div>
      <div class="bottom-item">
        <div class="content-wrapper">
          <div class="top-part">
            <div :style="{backgroundImage:`url(${require('@/assets/ctrl_images/bglight.png')})`}" class="right-top-icon"/>
            <div class="title">
              <div :style="{backgroundImage:`url(${require('@/assets/ctrl_images/sun.png')})`}" class="title-icon"/> <span>光照度</span>
            </div>
            <div class="value" style="color:#ffed00">{{ lightInfo.value || 0 }}Lx</div>
            <div class="label">
              {{ lightInfo.address + '-' + lightInfo.type }}
            </div>
          </div>
          <div class="bottom-part">
            <lightTable @getsenorInfo="getLightInfo"/>
          </div>
        </div>
      </div>
    </div>
    <div class="right-wrapper">
      <div class="header">
        <div v-for="(item,key) in nav_list" :key="key" class="nav-item">
          <div :style="{backgroundImage:`url(${require('@/assets/ctrl_images/bg.png')})`}" class="content-wrapper">
            <div class="nav-wrapper">
              <div class="nav-title">
                {{ item.title }}
              </div>
              <div :style="{color:item.color}" class="nav-label">
                {{ item.value }}{{ item.unit }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="left-item">
          <div class="content-wrapper">
            <div class="ctrl-container">
              <div class="title">场景控制</div>
              <div class="main">
                <div v-if="sceneCtrlList.length !== 0" class="scene-ctrl">
                  <div v-for="(item,key) in sceneCtrlList" :key="key" class="ctrl-item">
                    <div :style="{background:item.color}" class="inner-content" @click="onSceneCtrl(item.scene_id)">
                      <div class="scene-name">{{ item.name }}</div>
                      <div :style="{backgroundImage:`url(${require(`@/assets/ctrl_images/${item.type}.png`)})`}" class="scene-icon"/>
                      <div class="scene-label">
                        {{ item.label }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="noData">
                  <div class="icon"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-item">
          <div class="content-wrapper">
            <div class="ctrl-container">
              <div class="title">{{ isChannelDialogShow === true ? '单灯控制通道' : '单灯控制' }} </div>
              <div class="main">
                <div class="fliter-wrapper">
                  <el-input
                    v-model="device_num"
                    clearable
                    placeholder="控制器编号筛选"
                    @input="devNumChange"
                  >
                    <i slot="prefix" class="el-input__icon el-icon-search"/>
                  </el-input>
                </div>
                <div v-if="ctrlFilterList.length !== 0" class="single-ctrl">
                  <div class="device-title">
                    控制器列表
                  </div>
                  <div class="device-list">
                    <div v-for="(item,key) in ctrlFilterList" :key="key" class="device-wrapper" @click="toPageChannel(item)">
                      <div class="device-num">
                        控制器编号<span>{{ item.device_num }}</span>
                      </div>
                      <div class="device-item">
                        <div class="item">网关名称：<span>{{ item.gateway }}</span></div>
                        <div class="item">设备名称：<span>{{ item.device }}</span></div>
                        <div class="item">设备类型：<span>{{ item.device_type }}</span></div>
                        <div class="item">设备位置：<span>{{ item.building + item.floor }}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="noData">
                  <div class="icon"/>
                </div>
                <transition name="fade" mode="out-in">
                  <div v-if="isChannelDialogShow" class="channel-wrapper">
                    <div class="back">
                      <el-button type="primary" style="width:100%" plain round @click="onReturn">返回控制器列表</el-button>
                    </div>
                    <div class="device-info">
                      <div class="device-num">
                        控制器编号<span>{{ deviceInfo.device_num }}</span>
                      </div>
                      <div class="item">网关名称：<span>{{ deviceInfo.gateway || '/' }}</span></div>
                      <div class="item">设备名称：<span>{{ deviceInfo.device|| '/' }}</span></div>
                      <div class="item">设备类型：<span>{{ deviceInfo.device_type || '/' }}</span></div>
                      <div class="item">设备位置：<span>{{ deviceInfo.building + deviceInfo.floor }}</span></div>
                    </div>
                    <div class="channel-title">
                      开关通道列表
                    </div>
                    <div class="channel-list">
                      <div class="channel-container" >
                        <div v-for="(item,key) in channelList" :key="key" class="channel">
                          <div class="label">
                            <div>通道：{{ item.channel_name }}</div>
                            <div>描述：{{ item.label }}</div>
                          </div>
                          <div class="ctrl-moudle">
                            <el-switch
                              v-if="deviceInfo.device_type_id === 10"
                              v-model="item.value"
                              :active-value="1"
                              :inactive-value="0"
                              active-color="#13ce66"
                              @change="ctrlChange(item,key)"/>
                            <el-slider v-else :min="0" :max="100" v-model="item.value" @change="ctrlChange(item,key)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { channelOutCtrlList, channelCtrl } from '@/api/channelOut'
import { getCtrlList } from '@/api/devices'
import carTable from './components/carTable.vue'
import lightTable from './components/lightTable.vue'
import { getScenesCtrlList, scenesCtrl } from '@/api/scenes.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    carTable,
    lightTable
  },
  data() {
    return {
      paramGetCtrlList: {
        device_num: undefined
      },
      value: 0,
      channelList: [],
      ctrlList: [],
      ctrlFilterList: [],
      sceneCtrlList: [],
      nav_list: [{
        title: '24小时耗能详情',
        value: 0,
        unit: 'KW.h',
        color: '#c00d23'
      }, {
        title: '节约耗能',
        value: 0,
        unit: 'KW.h',
        color: '#009a76'
      }, {
        title: '节约碳排放量',
        value: 0,
        unit: '吨',
        color: '#c00d23'
      }],
      deviceInfo: {
        gateway: '',
        device: '',
        device_type: '',
        floor: '',
        building: '',
        device_num: '/',
        device_type_id: undefined,
        device_id: undefined
      },
      lightInfo: {
        address: '',
        type: '',
        value: ''
      },
      carInfo: {
        address: '',
        type: '',
        value: ''
      },
      device_num: undefined,
      icontype: ['windmill', 'boat', 'ballon', 'tree', 'pinetree', 'cloud'],
      colorList: ['#6d7bee', '#203977', '#61d2ff', '#c4bd3d', '#162245', '#2c95ef'],
      isChannelDialogShow: false
    }
  },

  computed: {
    ...mapGetters([
      'selected_project_id'
    ])
  },
  created() {
    this.getScenesCtrlList()
    this.getCtrlList()
  },

  methods: {
    getLightInfo(info) {
      this.lightInfo = info
    },
    getCarInfo(info) {
      this.carInfo = info
    },
    ctrlChange(info) {
      const val = info.value
      const params = {
        project_id: this.selected_project_id,
        channel_id: info.id,
        value: info.value
      }
      channelCtrl(params).then(() => {
        info.tempVal = val
        this.$message({
          type: 'success',
          message: '控制成功'
        })
      }).catch(() => {
        this.$set(info, 'value', info.tempVal)
      })
    },

    devNumChange(val) {
      this.ctrlFilterList = this.ctrlList.filter(item => {
        const strLen = val.length
        return item.device_num.toString().slice(0, strLen) === val
      })
    },

    channelOutCtrlList(device_id) {
      this.isChannelLoadingShow = true
      const params = {
        project_id: this.selected_project_id,
        device_id
      }
      channelOutCtrlList(params).then(res => {
        this.isChannelLoadingShow = false
        this.channelList = res.data.items.map(item => {
          return {
            ...item,
            tempVal: item.value
          }
        })
      }).catch(() => {
        this.isChannelLoadingShow = false
      })
    },
    onReturn() {
      this.isChannelDialogShow = false
    },
    toPageChannel(info) {
      this.deviceInfo.gateway = info.gateway
      this.deviceInfo.device = info.device
      this.deviceInfo.device_num = info.device_num
      this.deviceInfo.building = info.building
      this.deviceInfo.floor = info.floor
      this.deviceInfo.device_type = info.device_type
      this.deviceInfo.device_type_id = info.device_type_id
      this.channelOutCtrlList(info.id)
      this.isChannelDialogShow = true
    },
    getCtrlList() {
      getCtrlList({
        project_id: this.selected_project_id,
        device_num: this.paramGetCtrlList.device_num
      }).then(res => {
        this.ctrlList = res.data.items
        this.ctrlFilterList = this.ctrlList
      }).catch(() => {

      })
    },
    onSceneCtrl(scene_id) {
      scenesCtrl({
        project_id: this.selected_project_id,
        scene_id
      }).then(() => {
        this.$message({
          type: 'success',
          message: '控制成功'
        })
      })
    },
    getRandomNum() {
      return Math.floor(Math.random() * 6)
    },
    getScenesCtrlList() {
      getScenesCtrlList({ project_id: this.selected_project_id }).then(res => {
        const list = res.data.items
        const getNum = this.getRandomNum
        this.sceneCtrlList = list.map(item => {
          return {
            type: this.icontype[getNum()],
            color: this.colorList[getNum()],
            name: item.scene_name,
            label: item.label,
            scene_id: item.scene_id
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$scene-padding: 14px;
.ctrl-wrapper {
  overflow: auto;
  display: flex;
  flex-direction: row;
  padding: 20px;
  padding-left: 0;
  background-color: #009a76;
  font-family: "STHeiti";
  height: calc(100vh - 50px);
  .left-wrapper, .right-wrapper {
    display: flex;
    height: 100%;
  }
  .left-wrapper {
    flex: 1;
    flex-direction: column;
    .top-item, .bottom-item {
      flex: 1;
      .content-wrapper {
        color: #fff;
        display: flex;
        padding: 15px;
        flex-direction: column;
        .top-part {
          flex: 1;
          border-bottom: 1px solid rgba(255,255,255,.5);
          position: relative;
          .title {
            font-size: 14px;
            span {
              vertical-align: middle;
            }
            .title-icon {
              vertical-align: middle;
              display: inline-block;
              width: 16px;
              height: 16px;
              background-size: 100% 100%;
            }
          }
          .value {
            margin-top: 10px;
            font-size: 28px;
          }
          .label {
            margin-top: 20px;
            width: 60%;
            word-break: break-word;
          }
          .right-top-icon {
            position: absolute;
            right: -5px;
            top: -5px;
            width: 100px;
            height: 100px;
            background-size: 100% 100%;
          }
        }
        .bottom-part {
          position: relative;
          flex: 1;
          border-bottom: none;
        }
      }
    }

    .bottom-item {
      .content-wrapper {
        background-image: linear-gradient(to right, #7ec3ff ,#82e4fa );
      }
    }

    .top-item {
      margin-bottom: 10px;
      .content-wrapper {
        background-color: #52d887;
      }
    }
  }

  .right-wrapper {
    padding-left: 0;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    flex: 2;
    .header {
      display: flex;
      flex: 0 0 140px;
      margin-bottom: 10px;
      .nav-item {
        flex: 1;
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      .nav-wrapper {
        background-size: 100% 100%;
        padding: 20px;
        .nav-title {
          font-size: 14px;
          margin-bottom: 20px;
        }
        .nav-label {
          font-size: 24px;
        }
      }
      }
    }

    .body {
      flex: 1;
      display: flex;
      .left-item,.right-item {
        flex: 1;
        .content-wrapper {
          background: #3cc981;
          .ctrl-container {
            position: relative;
            height: 100%;
            .title {
              color: #fff;
              padding: 10px;
              text-align: center;
              font-size: 18px;
            }
            .main {
              position: absolute;
              top: 38px;
              bottom: 0;
              width: 100%;
              overflow: auto;
              .fliter-wrapper {
                position: absolute;
                top: 0;
                width: 100%;
                z-index: 20;
                padding: 0 10px;
                /deep/.el-input__inner {
                  border-radius: 20px;
                  height: 35px;
                  line-height: 35px;
                  background: rgba(255,255,255,.4);
                }
                /deep/input::-webkit-input-placeholder {
                  color: rgba(144,147,153,0.5);
                  font-size: 15px;
                }
                /deep/.el-input__icon {
                  color: rgba(144,147,153,0.5);
                  line-height: 35px;
                }
              }
              .noData {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 0;
                bottom: 0;
                width: 100%;
                color: #fff;
                height: 100%;
                .icon {
                  margin-bottom: 10px;
                  background-size: 100% 100%;
                  width: 104px;
                  height: 128px;
                  background-image: url('~@/assets/ctrl_images/noData.png');
                }
              }
              .scene-ctrl {
                display: flex;
                flex-direction: row;
                background: #3cc981;
                align-content: flex-start;
                flex-wrap: wrap;
                overflow: auto;
                padding: 10px;
                padding-top: 0;
                .ctrl-item {
                  position: relative;
                  height: 100px;
                  flex:0 0 50%;
                  .inner-content {
                    cursor: pointer;
                    position: relative;
                    height: calc(100% - 10px);
                    width: calc(100% - 10px);
                    margin: 5px;
                    color: #fff;
                    border-radius: 20px;
                    font-size: 14px;
                    .scene-name {
                      position: absolute;
                      top: $scene-padding;
                      left: $scene-padding;
                    }
                    .scene-icon {
                      position: absolute;
                      width: 18px;
                      height: 18px;
                      background-size: 100% 100%;
                      top: $scene-padding;
                      right: $scene-padding;
                    }
                    .scene-label {
                      position: absolute;
                      left: $scene-padding;
                      bottom: $scene-padding;
                      width: calc(100% - 28px);
                      word-break: break-all;
                    }
                  }
                }
              }
              .single-ctrl {
                position: absolute;
                background: #3cc981;
                top: 35px;
                bottom: 0;
                width: 100%;
                padding: 10px;
                color: #fff;
                .device-title {
                  margin: 10px 0;
                }
                .device-list {
                  position: absolute;
                  overflow: auto;
                  top: 56px;
                  bottom: 10px;
                  left: 10px;
                  right: 10px;
                  font-size: 14px;
                  display: flex;
                  flex-direction: column;
                  padding: 20px;
                  padding-top: 0;
                  .device-wrapper {
                    cursor: pointer;
                    padding: 10px 0;
                    border-bottom: 1px solid rgba(255,255,255,.5);
                    &:first-child {
                      padding-top: 0;
                    }
                    &:last-child  {
                      border-bottom: none;
                      padding-bottom: 0;
                    }
                    .device-num {
                      margin-bottom: 10px;
                      span {
                        margin-left: 10px;
                      }
                    }
                    .device-item {
                      .item {
                        line-height: 16px;
                      }
                      span {

                      }
                    }
                  }
                }
              }
              .channel-wrapper {
                background: #3cc981;
                position: relative;
                font-size: 14px;
                padding: 0 10px;
                position: absolute;
                z-index: 20;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: #3cc981;
                border-radius: 0 0 20px 20px;
                .back {
                  width: 100%;
                  margin-bottom: 10px;
                }
                .device-info {
                  line-height: 14px;
                  padding: 10px 20px;
                  background: #fff;
                  border-radius: 20px;
                  width: 100%;
                  .device-num {
                    color: #3cc981;
                    margin-bottom: 10px;
                    span {
                      margin-left: 10px;
                    }
                  }
                  .item {
                    line-height: 18px;
                  }
                }
                .channel-title {
                  margin: 10px 0;
                  color: #fff;
                  font-size: 16px;
                }
                .channel-list {

                  position: absolute;
                  overflow: auto;
                  margin: 0 10px 10px 10px;
                  background: #fff;
                  border-radius: 20px;
                  padding:  20px;
                  top: 202px;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  .channel-container {

                    .channel {
                      padding: 10px 0;
                      border-top: 1px solid rgba(0,0,0,.1);
                      &:first-child {
                        padding-top: 0;
                        border-top: none;
                      }
                      .label {
                        word-break: break-all;
                        div {
                          line-height: 18px;
                        }
                      }
                      .ctrl-moudle {
                        margin-top: 2px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      .left-item {
        margin-right: 10px;
      }
    }
  }
  .content-wrapper {
    background: white;
    height: 100%;
    width: 100%;
    box-shadow: 0 2px 12px 0 rgba(97, 67, 67, 0.1);
    border-radius: 10px;
    background-size: 100% 100%;

  }
}
</style>
