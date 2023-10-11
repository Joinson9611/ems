<template>
  <div class="table-container">
    <div v-if="list.length !== 0" class="haveData">
      <div class="table-wrapper">
        <div
          v-loading="isLoadingShow"
          class="recordtable"
          element-loading-background="rgba(0, 0, 0, 0)">
          <table class="tb_table" height="100%">
            <tbody>
              <tr v-for="(item, index) in list" :key="index" >
                <td style="width:120px">{{ item.address }}</td>
                <td style="width:60px">{{ item.value }}pcu/d</td>
                <td style="width:120px">{{ item.type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 没有数据时候显示 -->
    <div v-else class="noData">
      暂无数据
    </div>
  </div>
</template>

<script>
import { getSenorctrllist } from '@/api/channelsenors.js'
import { Formattimestamp3 } from '@/utils/time'
import { mapGetters } from 'vuex'
export default {
  // name: 'RecordTable',
  filters: {
    fomatTime(timesStamp) {
      return Formattimestamp3(timesStamp)
    }
  },
  data() {
    return {
      list: [],
      isLoadingShow: false
      // 成员列表
    }
  },

  computed: {
    ...mapGetters([
      'selected_project_id'
    ])
  },
  created() {
    this.getSenorctrllist()
  },

  methods: {
    // 获取成员列表
    getSenorctrllist() {
      this.isLoadingShow = true
      const params = {
        device_type_id: 31,
        project_id: this.selected_project_id
      }
      getSenorctrllist(params).then(({ data }) => {
        this.isLoadingShow = false
        this.list = data.info.map(item => {
          return {
            address: item.building + item.floor,
            value: item.value,
            type: '车流量过大'
          }
        })
        if (this.list.length !== 0) {
          this.$emit('getsenorInfo', this.list[0])
        }
      }).catch(err => {
        this.isLoadingShow = false
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  $fontColor:#fff;
  .table-container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .haveData {
      height: 100%;
      .table-wrapper {
        height: 100%;
        .recordtable {
          height: 100%;
          padding-top: 10px;
          overflow: auto;
          font-size: 12px;
          float: center;
          table {
            height: 100%;
            // margin-top: 13px;
            width: 100%;
            thead {
              width: 100%;
              text-align: center;
              tr {

              }
            }
            tr {
              height: 20px;
              line-height: 20px;
              text-align: center;
              color: $fontColor;
            }
            tr:last-child {
              border-bottom: 0;
            }
          }
        }
      }
    }

    .noData{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-align: center;
      color: $fontColor;
      opacity: .8;
    }

    .tb_table thead {
      border-bottom: 2px solid $fontColor;
    }

    .tb_table tbody{
      display:block;
      width: 100%;
      overflow: auto;
      // height: 400px;
    }

    .tb_table thead tr {
      display: block;
    }

    .tb_table td {
      text-align: left;
      height: 10px !important;
    }
}
</style>
