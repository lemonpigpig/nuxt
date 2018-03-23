<template>
  <section class="container">
    <div class="error-body">
      <div class="content">
          <img src="../assets/img/404.jpg" class="logo" />
          <div class="lighter">PAGE NOT FOUND</div>
          <div class="heavy">咦?页面出错了?!</div>
          <div class="lighter">很抱歉，您所访问的页面未能找到或者不在地球上…</div>
          <div class="button-grounp">
              <div class="button" @click="goHome">返回首页</div>
              <div class="button grey" @click="goBack">上一页</div>
          </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: ['error'],
  mounted () {
    this.$store.commit('common/setShowNavigation', false)
    this.$store.commit('common/setBreadCrumbVisibility', false)
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style  lang="less" scoped>
.error-body {
  margin-top: 80px;
  margin-bottom: 150px;
  .content {
    width: 420px;
    text-align: left;
    margin: 0px auto;
    .lighter {
      font-size: 16px;
    	font-weight: 300;
    	color: #666666;
      margin: 12px 0px 0px 30px;
    }
    .heavy {
      font-size: 22px;
    	font-weight: 600;
    	line-height: 1.18;
    	color: #333333;
      margin: 5px 0px 20px 30px;
    }
    .button-grounp {
      display: flex;
      justify-content: space-between;
      margin-top:15px;
      padding: 5px 30px;
      .button {
        padding: 8px 0px;
        width: 140px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.62;
        color: #ffffff;
        background-color: #ff4544;
        cursor: pointer;
      }
      .grey {
        background-color: #908888;
      }
    }
  }
}
</style>
