<template>
  <div>
    <PlatformNavbar/>
    <app-main/>
  </div>
</template>

<script>
import { PlatformNavbar, AppMain } from './components'

export default {
  name: 'PlatformLayout',
  components: {
    PlatformNavbar,
    AppMain
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
