<template lang="html">
    <div id="forgetPwd-step1">
        <stepInfo :stepinfo="stepinfo" :showComplete="showComplete" :completeActive="completeActive"></stepInfo>
        <div class="form-area">
            <div class="codeinfo">
              <img src="../../../assets/img/Group 125.png">
              <span>新密码设置成功！ 请您牢记新密码</span>
              </div>
            <div class="FwdconfirmBox confirmBox"
              @click="goToHome"
            >
                <button
                >立即购物</button>
            </div>
        </div>
    </div>
</template>

<script>
import stepInfo from '~components/stepinfo.vue'

export default {
  components: { stepInfo },
  data () {
    return {
      stepinfo: [{ name: '填写账户名', class: 'active' }, { name: '验证身份', class: 'active' }, { name: '设置新密码', class: 'active' }],
      showComplete: true,
      completeActive: true
    }
  },
  methods: {
    goToHome () {
      this.$router.push('/')
    }
  },
  mounted () {
    this.$store.commit('authorization/verifyForgetPwdStep1', false)
    this.$store.commit('authorization/forgetPwdStep2Sussces', false)
    this.$store.dispatch('authorization/signOut').catch((err) => {
      this.$store.commit('common/setMessage', err.msg || err)
      this.$store.commit('account/setFavoritesList', [])
      this.$store.commit('cart/updateCart', [])
      this.$store.commit('cart/updatePromotion', [])
    })
  }
}
</script>

<style lang="less">
#forgetPwd-step1 {
    width: 1200px;
    box-sizing: border-box;
    margin: 64px auto 80px auto;
    .stepinfo {
        width: 640px;
        margin: 89px auto 0 auto;
    }
    .form-area {
        width: 400px;
        text-align: center;
        margin: 64px auto 136px auto;
        .codeinfo {
            margin-bottom: 51px;
            img {
                width: 26px;
                height: 26px;
                vertical-align: middle;
            }
            span {
                display: inline-block;
                vertical-align: middle;
                line-height: 26px;
                margin-left: 14px;
                font-size: 14px;
                color: #b7a078;
            }
        }
    }
}
</style>
