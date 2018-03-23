<template>
  <span class="tag-item" :style="{ background: backgroundColor }" @click="tagClickHandler">
    <slot name="tag-text"></slot>
  </span>
</template>

<script>

export default {
  name: 'gz-tag',
  props: {
    backgroundColor: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    tagClickHandler () {
      this.$emit('tagClick')
    }
  }
}
</script>

<style lang="less">
  .tag-item {
    display: inline-block !important;
    padding: 3px 6px 4px !important;
    color: #fff !important;
    font-size: 12px !important;
    margin-right: 5px !important;
  }
</style>
