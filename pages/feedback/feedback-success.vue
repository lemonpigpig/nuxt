<template lang="html">
    <div id="advise-success">
        <div class="success-info">
            <img src="../../assets/img/Group122.png">
            <p>提交成功</p>
        </div>
        <div class="goindex">
            <p>您的反馈信息已经收到，我们会认真考虑您的意见与建议谢谢！</p>
            <p>页面将在<span>{{counter}}秒</span>后自动跳转至首页</p>
            <button @click="goHome">返回首页</button>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      interval: '',
      counter: 5
    }
  },
  methods: {
    startCountdown () {
      this.interval = setInterval(() => {
        this.counter -= 1
        if (this.counter <= 0) {
          clearInterval(this.interval)
          this.$router.replace('/')
        }
      }, 1000)
    },
    goHome () {
      this.$router.replace('/')
    }
  },
  mounted () {
    this.$store.commit('common/setShowNavigation', false)
    this.startCountdown()
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="less">
  #advise-success {
      width:1200px;
      margin: 140px auto 160px;
      text-align: center;
      .success-info {
          img {
              width: 54px;
              margin-bottom: 23px;
          }
          p {
              font-size: 18px;
              color: #333;
          }
      }
      .goindex {
          margin-top: 16px;
          font-size: 12px;
          color: #666;
          p {
              line-height: 24px;
              span {
                  color: #ff4544;
              }
          }
          button {
            border: none;
            margin-top: 20px;
            width: 140px;
            height: 42px;
            background: #fff;
            border: 1px solid #ff4544;
            color: #ff4544;
          }
      }
  }
</style>
