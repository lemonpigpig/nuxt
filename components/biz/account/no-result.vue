<template lang="html">
    <div class="no-result">
        <div>
            <img v-show="imgType === 'collection'" src="../../../assets/img/Group119.png">
            <img v-show="imgType === 'address'" src="../../../assets/img/Group2.svg">
        </div>
        <p>{{tip}}</p>
        <span v-show="imgType === 'collection'" @click="goHome">去首页逛逛</span>
        <span v-show="imgType === 'address'" @click="newAddress">新建收货地址</span>
        <img src="../../../assets/img/Group1.svg">
    </div>
</template>

<script>
export default {
  props: {
    imgType: String,
    tip: String
  },
  methods: {
    newAddress () {
      this.$emit('addFormNoresult', 'add')
    },
    goHome () {
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="less">
.no-result {
    margin-top: 52px;
    text-align: center;
    div {
        img {
          width: 56px;
          height: 56px;
          margin-bottom: 26px;
        }
    }
    p {
        font-size: 14px;
        color: #666;
        margin-bottom: 12px;
    }
    span {
        font-size: 16px;
        color: #ff4544;
        line-height: 26px;
        border-bottom: 1px solid #ff4544;
        margin-right: 6px;
        cursor: pointer;
    }
}
</style>
