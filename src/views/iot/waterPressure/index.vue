<template>
  <water :device_type_id="102" :alarm_type_id="$route.query.alarm_type_id"/>
</template>

<script>
import water from '../water'
export default {
  components: {
    water
  },
  data() {
    return {
      alarm_type_id: undefined
    }
  },
  watch: {
    '$route.query.alarm_type_id': {
      handler(id) {
        let aid
        if (id || id === 0) {
          aid = id * 1
        } else {
          aid = id
        }
        this.alarm_type_id = aid
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style>

</style>
