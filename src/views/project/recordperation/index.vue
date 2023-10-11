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
      <el-table-column align="center" label="操作类型">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作内容">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{ getTime(scope.row.operation_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--页码导航-->
    <pagination v-show="total>0" :total="total" :page.sync="paramGetList.page" :limit.sync="paramGetList.limit" @pagination="getRecordOperations" />
  </div>
</template>

<script>
import { getRecordOperations } from '@/api/recordoperations'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { Formattimestamp } from '@/utils/time'

export default {
  name: 'Recordperation',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      total: 0,
      list: [],
      isListLoadingShow: false,
      paramGetList: {
        page: 1,
        limit: 20,
        project_id: this.selected_project_id
      }
    }
  },
  computed: {
    ...mapGetters([
      'selected_project_id'
    ])
  },

  created() {
    this.getRecordOperations()
  },
  methods: {
    getTime(time) {
      return Formattimestamp(time)
    },
    getRecordOperations() {
      this.paramGetList.project_id = this.selected_project_id
      this.isListLoadingShow = true
      getRecordOperations(this.paramGetList).then(res => {
        this.total = res.data.total
        this.isListLoadingShow = false
        this.list = res.data.items
      }).catch(() => {
        this.isListLoadingShow = false
      })
    }
  }
}
</script>
