<template lang="html">
  <div class="bread-crumb-component" :style="{ background: background}">
    <div class="bread-crumb clearfix" >
      <span class="current-loc">当前位置：</span>
      <span class="crumblist" v-for="(item, index) in breadCrumb">
        <span class="loc1"  :class="{'loc2' : index == breadCrumb.length-1}" @click="goPage(item.url)">{{item.name}}</span>
        <gz-icon icon="go" size="9" v-if="index !== breadCrumb.length-1"/>
      </span>
    </div>
  </div>

</template>

<script>
export default {
  name: 'bread-crumb',
  props: {
    breadCrumb: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    goPage (url) {
      if (url) {
        this.$router.push({
          path: url
        })
      }
    }
  },
  computed: {
    background () {
      var route = this.$route.name.split('-')[0]
      console.log(route)
      if (route === 'museums') {
        return '#f4f4f4'
      }
      return 'white'
    }
  }

}
</script>

<style lang="less">
.bread-crumb-component{
  width: 100%;
  padding-bottom: 27px;
  .bread-crumb{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f4f4f4;
    height: 60px;
    font-size: 12px;
    .crumblist{
      display: flex;
      align-items: center;
    }
    .current-loc{
      color: #666666;
    }
    .loc1{
      color: #999999;
      cursor: pointer;
    }
    .gz-icon{
      margin: 0 6px;
    }
    .loc2{
      color: #333333;
      cursor: default;
    }
  }
}

</style>
