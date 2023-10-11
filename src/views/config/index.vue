<template >
  <div class="app-container">
    <el-table
      v-loading="isListLoadingShow"
      :data="list"
      element-loading-text="Loading"
      style="width: 100%;"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="通道名称">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通道地址">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_num }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备">
        <template slot-scope="scope">
          <span>{{ scope.row.device }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="建筑">
        <template slot-scope="scope">
          <span>{{ scope.row.building }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="楼层">
        <template slot-scope="scope">
          <span>{{ scope.row.floor }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleConfig(scope.row)">配置下发</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramGetList.page" :limit.sync="paramGetList.limit" @pagination="getChannel" />
  </div>
</template>

<script>
import { getChannelOutLists, channelOutConfig } from '@/api/channelOut'
import { getChannelInlist, channelInConfig } from '@/api/channelIn'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { Formattimestamp } from '@/utils/time'

export default {
  name: 'Config',
  components: { Pagination },
  directives: { waves },
  props: {
    configType: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      total: 0,
      list: [],

      isListLoadingShow: false,
      paramGetList: {
        page: 1,
        device_type_id: -1,
        limit: 20,
        project_id: this.selected_project_id
      },
      type: 0
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id'
    ])
  },

  created() {
    this.getParams()
    this.getChannel()
  },
  methods: {
    getParams() {
      this.type = this.$route.meta.type
    },
    handleConfig({ id: channel_id }) {
      const params = {
        project_id: this.selected_project_id,
        channel_id
      }
      if (this.type === 1) {
        channelOutConfig(params).then(() => {
          this.$message({
            type: 'success',
            message: '配置下发成功'
          })
        })
      } else {
        channelInConfig(params).then(() => {
          this.$message({
            type: 'success',
            message: '配置下发成功'
          })
        })
      }
    },
    getTime(time) {
      return Formattimestamp(time)
    },

    getChannel() {
      this.paramGetList.project_id = this.selected_project_id
      this.isListLoadingShow = true
      if (this.type === 0) {
        getChannelInlist(this.paramGetList).then(res => {
          this.list = res.data.items
          this.total = res.data.total
          this.isListLoadingShow = false
        }).catch(() => {})
      } else {
        getChannelOutLists(this.paramGetList).then(res => {
          this.list = res.data.items
          this.total = res.data.total
          this.isListLoadingShow = false
        }).catch(() => {})
      }
    }
  }
}
</script>
