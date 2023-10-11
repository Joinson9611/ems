<template>
  <div class="permission-checkbox">
    <div class="pesmission-label">
      <el-checkbox :disabled="disabledAllCheck()" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ checkboxData.label }}</el-checkbox>
    </div>
    <div class="permission-detail">
      <el-checkbox-group v-model="checkedList" @change="handleCheckeditem">
        <el-checkbox v-for="item in checkboxData.list" v-show="item.show" :disabled="disabledSingle(item.pid)" :label="item.pid" :key="item.pid" class="checkbox-item" >{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkboxData: {
      required: true,
      type: Object
    },
    checkedItem: {
      required: true,
      type: Array
    },
    disabledRoles: {
      required: true,
      type: Array
    },
    isNeedDisable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      checkedList: [],
      checkAll: false,
      isIndeterminate: false,
      disabledAll: false
    }
  },
  computed: {
    permissionList() {
      return this.checkboxData.list.map(item => item.pid)
    }
  },
  watch: {
    checkedItem(val) {
      this.init(val)
    }
  },
  created() {
    this.init(this.checkedItem)
  },
  methods: {
    disabledAllCheck() {
      if (this.isNeedDisable) {
        let count = 0
        const arr = this.checkboxData.list.map(item => item.pid)
        this.disabledRoles.forEach(item1 => {
          arr.forEach(item2 => {
            if (item1 === item2) {
              count++
            }
          })
        })
        return count > 0
      } else {
        return false
      }
    },
    disabledSingle(pid) {
      if (this.isNeedDisable) {
        return this.disabledRoles.includes(pid)
      } else {
        return false
      }
    },
    // 初始化数据
    init(val) {
      if (val.length === 0) {
        this.checkAll = false
        this.isIndeterminate = false
      }
      this.checkedList = val
      this.generateCheckedCB()
      const checkedCount = this.checkedList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkboxData.list.length
      this.checkAll = checkedCount === this.checkboxData.list.length
      // 将最新的被选项回传给父组件
      this.$emit('update:checked', this.checkedList)
      this.disabledSingle()
    },
    // 生成筛选后选中的框
    generateCheckedCB() {
      this.checkedList = this.checkedList.filter(item =>
        this.permissionList.includes(item)
      )
    },
    handleCheckAllChange(val) {
      this.checkedList = val ? this.permissionList : []
      this.isIndeterminate = false
      this.$emit('update:checked', this.checkedList)
    },
    handleCheckeditem(val) {
      const checkedCount = val.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkboxData.list.length
      this.checkAll = checkedCount === this.checkboxData.list.length
      this.$emit('update:checked', this.checkedList)
    }
  }
}
</script>

<style scoped lang="scss">
  .permission-checkbox{
    width: 100%;
    display: flex;
    .pesmission-label{
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #DCDFE6;
      flex: 3
    }
    .permission-detail{
      flex: 5;
      padding-left: 10px;
    }
    .checkbox-item{
      margin: 0 15px 0 0;
    }
  }

</style>
