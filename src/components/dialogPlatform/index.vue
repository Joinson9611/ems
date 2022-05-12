<template>
  <transition name="fade" mode="out-in">
    <div v-if="dialogVisible" class="shelter">
      <div :style="main" class="content">
        <div class="back" >
          <SvgIcon icon-class="close" @click="closeDialog"/>
        </div>
        <div class="title">
          <span v-if="title">{{ title }}</span>
          <slot v-else name="title"/>
        </div>
        <div class="main">
          <slot/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  components: {
    SvgIcon
  },
  props: {
    width: {
      type: Number,
      default: 1200
    },
    height: {
      type: Number,
      default: 900
    },
    title: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      main: {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .shelter {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,.4);
    .back {
      cursor: pointer;
      position: absolute;
      z-index: 9999;
      right: 16px;
      top: 8px;
      font-size: 20px;
    }
    .content {
      display: flex;
      flex-direction: column;
      position: relative;
      width: 1200px;
      height: 900px;
      background: rgba(7,28,109,1);
      .title {
        flex: 0 0 50px;
        // height: 50px;
        font-size: 24px;
        line-height: 50px;
        text-align: center;
        font-weight: bold;
      }
      .main {
        flex: 1;
        overflow: auto;
      }
    }
  }
</style>
