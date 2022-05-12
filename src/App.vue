<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>

window.addEventListener('touchmove', e => e.preventDefault())
export default {
  name: 'App'
}
</script>
