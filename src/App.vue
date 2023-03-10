<template>
  <div id="app">
    <FaPiao />
    <p style="text-align: center;color:#999;font-size:12px">Fex Team</p>
  </div>
</template>

<script>
import FaPiao from './components/FaPiao'

export default {
  name: 'app',
  components: {
    FaPiao
  }
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
}
#app {
  height: 100vh;
  width: 100vw;
}
</style>
