<template lang="html">
    <div id="forgetPwd-step1">
        <stepInfo :stepinfo="stepinfo" :showComplete="showComplete"></stepInfo>
        <div class="form-area">
            <gzInput
                label="用户名"
                placeholder="您的用户名／已验证手机号"
                v-model="userName"
                required="true"
                :isFocused="isFocused"
                :errMsg="userNameErrMsg"
                @blur="checkLoginName"
            ></gzInput>
            <gzInput
                label="验证码"
                placeholder="请输入验证码"
                v-model="verifyCode"
                required="true"
                :isFocused="isFocused"
                Info="看不清？点击图片换一张"
            >
              <img @click="getImgVerify" :src="`data:image/png;base64,${imgVerifyData.img}`"/>
            </gzInput>
            <div class="FwdconfirmBox confirmBox">
                <button
                :disabled="submitBtnDisabled"
                :class={disabled:submitBtnDisabled}
                @click="forgetPwdStep1"
                >提交</button>
            </div>
        </div>
    </div>
</template>

<script>
import gzInput from '~components/biz/account/input.vue'
import stepInfo from '~components/stepinfo.vue'

export default {
  data () {
    return {
      isFocused: false,
      userName: '',
      userNameErrMsg: '',
      verifyCode: '',
      stepinfo: [{ name: '填写账户名', class: 'active' }, { name: '验证身份' }, { name: '设置新密码' }],
      showComplete: true,
      sessionId: ''
    }
  },
  computed: {
    imgVerifyData () {
      return this.$store.state.authorization.imgVerifyData
    },
    userNameValid () {
      return (
          /^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(this.userName) &&
          this.userName.replace(/[\u4e00-\u9fa5]/g, 'aa').length <= 20 &&
          this.userName.replace(/[\u4e00-\u9fa5]/g, 'aa').length >= 4
      )
    },
    phoneValid () {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0-9])\d{8}$/
      return reg.test(this.userName)
    },
    submitBtnDisabled () {
      return (
        !!this.userNameErrMsg ||
        !this.userName ||
        !this.verifyCode.length > 0
      )
    }
  },
  methods: {
    checkLoginName () {
      this.$set(this, 'userNameErrMsg', this.userNameValid || this.phoneValid ? '' : '请输入正确用户名')
    },
    getImgVerify () {
      this.$store.dispatch('authorization/getImgVerify').then(() => {
        this.$set(this, 'sessionId', this.imgVerifyData.session)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    },
    verifyImg () {
      const queryCondition = {
        sessionId: this.sessionId,
        code: this.verifyCode
      }
      this.$store.dispatch('authorization/verifyForgetPwdStep1', queryCondition).then(() => {
        this.$router.push('/account/entry/findPwd-step2')
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    },
    forgetPwdStep1 () {
      if (this.userNameValid || this.phoneValid) {
        if (this.phoneValid) {
          this.$store.dispatch('authorization/phoneExisted', this.userName).then((res) => {
            if (res) {
              this.verifyImg()
            } else {
              this.$store.commit('common/setMessage', '该用户不存在')
            }
          })
        } else {
          this.$store.dispatch('authorization/userNameExisted', this.userName).then((res) => {
            if (res) {
              this.verifyImg()
            } else {
              this.$store.commit('common/setMessage', '该用户不存在')
            }
          })
        }
      } else {
        this.$set(this, 'userNameErrMsg', '请输入正确的用户信息')
      }
    }
  },
  mounted () {
    this.getImgVerify()
  },
  components: { gzInput, stepInfo }
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
        margin: 64px auto 0 auto;
        .codeinfo {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
        }
    }
}
</style>
