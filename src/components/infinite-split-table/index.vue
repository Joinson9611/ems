<template>
  <div>
    <table
      :class="{'top-border':deep==0,'left-border':deep==0}"
      class="infinite-split-table"
      cellpadding="0"
      cellspacing="0">
      <template>
        <tr
          v-for="(line,key) in for_data"
          :style="{height:typeof line[0].height!='undefined'?line[0].height:'auto'}"
          :key="key"
          style="width: 100%;">
          <td
            v-for="(item,key) in line"
            :style="{width:typeof item.width!='undefined'?item.width:'auto'}"
            :key="key"
            style="padding:0px">
            <div v-if="item.type!='row'&&item.type!='column'" ref="text" class="text">
              <span v-if="item.type=='label'" >
                {{ item.data }}
              </span>
            </div>
            <!--递归调用-->
            <infinite-split-table
              v-else
              :tree_data="item"
              :deep="deep+1"/>
          </td>
        </tr>
      </template>
    </table>
  </div>

</template>
<script>
export default {
  name: 'InfiniteSplitTable',
  props: {
    tree_data: {
      type: Array,
      required: true
    },
    deep: {
      type: Number,
      required: true
    }
  },
  computed: {
    for_data() {
      const type = this.tree_data.type
      const data = this.tree_data.data
      const result = []
      if (type === 'row') {
        result.push(data)
      } else if (type === 'column') {
        for (let i = 0; i < data.length; i++) {
          result.push([data[i]])
        }
      }
      this.$nextTick(() => {
        if (this.$refs.text) {
          this.$refs.text.forEach(item => {
            console.log(item.offsetHeight)
            // item.style['line-height'] = item.offsetHeight + 'px'
          })
        }
      })
      return result
    }
  }
}
</script>
<style scoped lang="scss">
  $borderColor: #000;
  $borderWidth: 3px;
  .infinite-split-table{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .left-border{
    border-left: $borderWidth solid $borderColor;// 左边框宽度
  }
  .top-border{
    border-top: $borderWidth solid $borderColor;
  }
  .text{
    box-sizing: border-box;
    border-right:  $borderWidth solid $borderColor;
    border-bottom:  $borderWidth solid $borderColor;
    line-height: 50px;
    height: 100%;
    min-height: 40px;
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
