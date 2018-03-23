<template lang="html">
  <div class="pay-header">
    <div class="content">
      <nuxt-link class="logo" tag="div" to="/">
        <gz-icon className="gznb-pay-logo" icon="logo" size="130 54"></gz-icon>
      </nuxt-link>
      <div class="progress-bar">
          <stepInfo :stepinfo="progressinfo" :showComplete="showComplete"></stepInfo>
      </div>
    </div>
  </div>
</template>

<script>
import stepInfo from '~components/stepinfo.vue'
export default {
  name: 'pay-header',
  components: { stepInfo },
  props: {
    progressinfo: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      showComplete: false
    }
  }
}
</script>

<style lang="less">
.pay-header{
  width: 100%;
  border-bottom: 1px solid #f4f4f4;
  height: 138px;
  .content{
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo{
      cursor: pointer;
    }
  }
}
</style>
