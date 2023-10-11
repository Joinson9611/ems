<template>
  <div class="home-wrapper">
    <div class="home-left">
      <div class="content-wrapper">
        <div class="count-container">
          <div class="count">
            <div class="count-list">
              <div v-for="(item,key) in count_top" :key="key" class="count-item">
                <div :style="{backgroundImage:`url(${require(`@/assets/home_images/${item.image}.png`)})`}" class="count-icon"/>
                <div class="count-number"><count-to :start-val="0" :end-val="item.number" :duration="3600" /></div>
                <div class="count-name">{{ item.name }}</div>
              </div>
            </div>
          </div>
          <div class="count">
            <div class="count-list">
              <div v-for="(item,key) in count_bottom" :key="key" class="count-item">
                <div :style="{backgroundImage:`url(${require(`@/assets/home_images/${item.image}.png`)})`}" class="count-icon"/>
                <div class="count-number"><count-to :start-val="0" :end-val="item.number" :duration="3600" /></div>
                <div class="count-name">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-right">
      <div class="top">
        <div class="content-wrapper">
          <img :src="logoImage" alt="" @error="logoImgError">
        </div>
      </div>
      <div class="middle">
        <div :style="{backgroundImage:`url(${require('@/assets/home_images/member.png')})`}" class="content-wrapper">
          <div class="title">
            人员数量
          </div>
          <div class="number">
            <count-to :start-val="0" :end-val="member_count" :duration="3600" class="number"/>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div :style="{backgroundImage:`url(${require('@/assets/home_images/project .png')})`}" class="content-wrapper">
          <div class="title">
            项目详情
          </div>
          <div :style="{backgroundImage:`url(${require('@/assets/home_images/project-right-bottom.png')})`}" class="right-bottom-icon"/>
          <div class="project">
            <div class="project-name">
              {{ project_info.project_name }}
            </div>
            <div class="project-address">
              <svgIcon style="font-size: 16px" icon-class="address"/>{{ project_info.project_address }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHomeCount } from '@/api/index'
import { getProjectInfo } from '@/api/project'
import svgIcon from '@/components/SvgIcon'
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
export default {
  components: {
    CountTo,
    svgIcon
  },
  data() {
    return {
      count_list: [{}, {}, {}],
      count_top: [{
        image: 'gateway',
        name: '网关总数',
        number: 0
      }, {
        image: 'controller',
        name: '控制器总数',
        number: 0
      }, {
        image: 'switch',
        name: '开关总数',
        number: 0
      }],
      count_bottom: [{
        image: 'senor',
        name: '传感器总数',
        number: 0
      },

      {
        image: 'scene',
        name: '场景控制总数',
        number: 0
      }, {
        image: 'timer',
        name: '定时控制总数',
        number: 0
      }],
      // 人员数量
      member_count: 0,
      project_info: {
        project_name: undefined,
        project_address: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id'
    ]),
    logoImage() {
      return process.env.FILE_URL + `/image/project_image/${this.selected_project_id}.png` + '?t=' + (+new Date())
    }
  },

  created() {
    this.getHomeCount()
    this.getProjectInfo()
  },
  mounted() {
    console.log(this.isHasImg(this.logoImage))
  },
  methods: {

    logoImgError(event) {
      const img = event.srcElement
      img.src = process.env.FILE_URL + '/image/project_image/0.png'
      img.onerror = null
    },
    getHomeCount() {
      getHomeCount({ project_id: this.selected_project_id }).then(({ data }) => {
        this.count_top[0].number = data.gatewayCount || 0
        this.count_top[1].number = data.deviceCount || 0
        this.count_top[2].number = data.switchCount || 0
        this.count_bottom[0].number = data.sensorCount || 0
        this.count_bottom[1].number = data.sceneCount || 0
        this.count_bottom[2].number = data.timerCount || 0
        this.member_count = data.memberCount || 0
      }).catch(() => {})
    },
    getProjectInfo() {
      getProjectInfo({ project_id: this.selected_project_id }).then(res => {
        this.project_info.project_name = res.data.name
        this.project_info.project_address = res.data.address
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  $box-padding: 15px;
  .home-wrapper {
    overflow: auto;
    display: flex;
    flex-direction: row;
    padding: 20px;
    padding-left: 0;
    height: calc(100vh - 50px);
    background-color: #009a76;
    font-family: "STHeiti";
    .content-wrapper {
      overflow: hidden;
      height: 100%;
      box-shadow: 0 2px 12px 0 rgba(97, 67, 67, 0.1);
      border-radius: 10px;
      position: relative;
      background-size: 100% 100%;
      background-color: white;
      display: flex;
      // height: 240px;
      .title {
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 14px;
        color: #009a76;
      }

      .number {
        color: #009a76;
        font-size: 30px;
        margin-left: 15px;
        align-self: center;
      }
      .right-bottom-icon {
        position: absolute;
        right: 20px;
        width: 204px;
        height: 147px;
        bottom: 20px;
        background-size: 100% 100%;
      }
      .project {
        position: absolute;
        // padding: 0 20px;
        top: 40px;
        left: 15px;
        color: #009a76;
        .project-name {
          max-width: 260px;
          word-break: break-word;
          font-size: 22px;
          margin-bottom: 10px;
        }
        .project-address {
          line-height: 24px;
          font-size: 18px;
          max-width: 260px;
          word-break: break-all;
        }
      }

      .count-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 0 20px;
        .count {
          display: flex;
          align-items: center;
          margin: 0 20px;
          border-bottom: 1px dashed #009a76;
          height: 50%;
          width: 100%;
          &:last-child {
            border-bottom: none;
          }
          .count-list {
            width: 100%;
            display: flex;
            flex-direction: row;
            .count-item {
              position: relative;
              flex: 1;
              display: flex;
              color: #009a76;
              flex-direction: column;
              align-items: center;
              &::after {
                position: absolute;
                top:0;
                height: 80%;
                right:0;
                content: '';
                width: 0;
                border-right: solid #009a76 1px;
              }
              &:last-child::after{
                border-right: none;
              }
              .count-icon {
                width: 60px;
                height: 60px;
                background-size: 100% 100%;
              }
              .count-number {
                font-size: 26px;
                margin-top: 30px;
                margin-bottom: 10px;
              }

              .count-name {
                font-size: 20px;
              }
            }
          }
        }
      }
    }
    .home-left {
      height: 100%;
      flex: 1;
      margin-right: 20px;
    }
    .home-right {
      height: 100%;
      flex: 0 0 360px;
      display: flex;
      flex-direction: column;
      .top {
        position: relative;
        // padding-bottom: 30%;
        flex: 0 0 100px;
        margin-bottom: 20px;
        // .logo-image {
        //   width: 100%;
        // }
      }
      .middle {
        flex: 0 0 200px;
        margin-bottom: 20px;
      }
      .bottom {
        flex: 1;
      }
    }
  }
</style>
