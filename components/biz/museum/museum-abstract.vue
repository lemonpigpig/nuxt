<template lang="html">
  <div class="museum-abstract">
      <div class="museum-img" :style="{'background-image': `url(${museumItem.coverUrl[0]})`}" @click="goMuseum">
        <div class="img-arrow">
          <gz-icon icon="more" size="18"></gz-icon>
        </div>
      </div>
      <div class="museum-body">
          <div class="museum-name">{{museumItem.name}}</div>
          <div class="museum-introduction">{{formatIntroduction(museumItem.introduction)}}</div>
          <div class="museum-tag" v-if="museumItem.tags && museumItem.tags.length>0">
            <div class="tag-button" v-for="tag in museumItem.tags">{{tag.name}}</div>
          </div>
      </div>
      <div class="museum-arrow" @click="goMuseum">
        <gz-icon icon="half-arrow" size="20"></gz-icon>
      </div>
  </div>
</template>

<script>
export default {
  name: 'museum-abstract',
  props: {
    museumItem: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    goMuseum () {
      this.$emit('getMuseum', this.museumItem)
    },
    formatIntroduction (introduction) {
      var data = introduction
      if (data.length > 64) {
        return data.slice(0, 64) + '...'
      }
      return data
    }
  },
  computed: {
  }
}
</script>

<style lang="less">
  .museum-abstract {
    display: flex;
    flex-direction: column;
    width: 370px;
    height: 420px;
    text-align: start;
    border: 1px solid #ebebeb;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    .museum-img {
      width: 100%;
      height: 200px;
      cursor: pointer;
      background-color: #cccccc;
      overflow: hidden;
      position: relative;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      -moz-transition-property:all;
      -moz-transition-duration:0.3s;
      /* Safari and Chrome */
      -webkit-transition-property:all;
      -webkit-transition-duration:0.3s;
      /* Opera */
      -o-transition-property:all;
      -o-transition-duration:0.3s;
      .img-arrow {
        position: absolute;
        width: 46px;
        height: 36px;
        font-size: 20px;
        right: 50px;
        bottom: -36px;
        justify-content: center;
        align-items: center;
        background-color: #ff4544;
        color: white;
        display: flex;
        cursor: pointer;
        transition: all ease-out .3s;
        .gz-icon {
          transform:rotate(-90deg);
        }
      }
    }
    .museum-body {
      background-color: white;
      height: 220px;
      -moz-transition-property:all;
      -moz-transition-duration:0.3s;
      /* Safari and Chrome */
      -webkit-transition-property:all;
      -webkit-transition-duration:0.3s;
      /* Opera */
      -o-transition-property:all;
      -o-transition-duration:0.3s;
      .museum-name{
        font-size: 16px;
        color: #333333;
        padding: 20px 20px 15px;
      }
      .museum-introduction {
        padding: 0px 20px;
        font-size: 14px;
        font-weight: 300;
        line-height: 20px;
        height: 60px;
        color: #666666;
        text-align: justify;
        overflow: hidden;
      }
      .museum-tag {
        padding: 0px 20px 10px;
        font-size: 12px;
        color: #999999;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .tag-button {
          padding: 3px 5px;
          margin-right: 4px;
          margin-bottom: 5px;
          border: 1px solid #dddddd;
        }
      }
    }
    .museum-arrow {
      position: absolute;
      width: 100%;
      height: 40px;
      bottom: -40px;
      justify-content: center;
      align-items: center;
      background-color: #ff4544;
      color: white;
      display: flex;
      cursor: pointer;
      transition: all ease-out .3s;
    }
    &:hover .museum-body {
      height: 195px;
    }
    &:hover .museum-img {
      height: 185px;
    }
    &:hover .img-arrow, &:hover .museum-arrow {
      bottom: 0px;
    }
  }
</style>
