<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    // 通过provide传递给子代，谁需要谁获取下就OK了
    return {
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterAlive: true
    }
  },
  methods: {
   reload () {
    console.log("reload")
     this.isRouterAlive = false
     this.$nextTick(() => (this.isRouterAlive = true))
   }   
 }
}
</script>
