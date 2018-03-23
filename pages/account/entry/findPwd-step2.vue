<template lang="html">
    <div id="forgetPwd-step2">
        <stepInfo :stepinfo="stepinfo" :showComplete="showComplete"></stepInfo>
        <div class="form-area">
          <gzInput
              label="中国 +86"
              type="tel"
              placeholder="建议使用常用手机"
              v-model="phone"
              required="true"
              :errMsg="phoneErrMsg"
              :isFocused="isFocused"
              @blur="checkPhone"
          ></gzInput>
          <gzInput
              @click="sendPhoneCode"
              label="短信验证码"
              type="tel"
              placeholder="请输入手机验证码"
              v-model="phoneCode"
              required="true"
              :errMsg="phoneCodeErrMsg"
              :isFocused="isFocused"
              @blur="checkPhoneCode"
          >
              <button
                      class="addons"
                      :class={disabled:phoneCodeBtnIsInvalid}
                      :disabled="phoneCodeBtnIsInvalid"
                      @click="sendPhoneCode"
                  >{{countdown > 0 ? `重新获取(${countdown}s)` : '获取验证码'}}
              </button>
          </gzInput>
        </div>
        <div class="FwdconfirmBox confirmBox">
            <button
                :disabled="signUpBtnDisabled"
                :class={disabled:signUpBtnDisabled}
                @click="forgetPwdStep2"
            >下一步</button>
        </div>
    </div>
</template>

<script>
import gzInput from '~components/biz/account/input.vue'
import stepInfo from '~components/stepinfo.vue'

export default {
  components: { gzInput, stepInfo },
  data () {
    return {
      phone: '',
      phoneCode: '',
      stepinfo: [{ name: '填写账户名', class: 'active' }, { name: '验证身份', class: 'active' }, { name: '设置新密码' }],
      showComplete: true,
      countdown: 0,
      maxCountDown: 60,
      phoneErrMsg: '',
      phoneCodeErrMsg: '',
      isFocused: false,
      timeoutHandler: []
    }
  },
  computed: {
    phoneValid () {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0-9])\d{8}$/
      return reg.test(this.phone)
    },
    phonecodeValid () {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0-9])\d{8}$/
      return reg.test(this.phone)
    },
    phoneCodeBtnIsInvalid () {
      return !(this.phoneValid && this.countdown === 0)
    },
    signUpBtnDisabled () {
      return (
        !this.phoneValid
      )
    }
  },
  methods: {
    checkPhone () {
      this.$set(this, 'phoneErrMsg', !this.phoneValid ? '请输入正确的手机号' : '')
    },
    checkPhoneCode () {
      this.$set(this, 'phoneCodeErrMsg', !this.phonecodeValid ? '请输入验证码' : '')
    },
    sendPhoneCode () {
      this.$store.dispatch('authorization/phoneExisted', this.phone).then((res) => {
        if (!res) {
          this.phoneErrMsg = '该用户不存在'
        } else {
          this.$set(this, 'countdown', this.maxCountDown)
          const verifyCode = {
            Phone: this.phone,
            VerificationCodeType: '0'
          }
          this.$store.dispatch('authorization/sendVerifyCode', verifyCode).then(() => {
            this.startCountdown(this.maxCountDown)
          }).catch((err) => {
            this.$store.commit('common/setMessage', err.msg || err)
          })
        }
      })
    },
    startCountdown (counter) {
      let countdown = counter
      while (countdown >= 0) {
        ((e) => {
          this.timeoutHandler.push(setTimeout(() => {
            this.$set(this, 'countdown', e)
          }, 1000 * (counter - e)))
        })(countdown)
        countdown -= 1
      }
    },
    forgetPwdStep2 () {
      const queryCondition = {
        account: this.phone,
        verifyCode: this.phoneCode,
        loginType: 2
      }
      this.$store.dispatch('authorization/signIn', queryCondition).then((data) => {
        this.$store.commit('authorization/setUserAuth', data.sessionId)
        global.hasOwnProperty('localStorage') && localStorage.setItem('sessionId', data.sessionId)
        this.$router.push('/account/entry/findPwd-step3')
        this.$store.commit('authorization/forgetPwdStep2Sussces', true)
      }).catch((err) => {
        this.$store.commit('authorization/forgetPwdStep2Sussces', false)
        if (err.code) {
          switch (err.code.toString()) {
            case '1015':
              this.phoneCodeErrMsg = err.msg
              break
            case '1018':
              this.phoneCodeErrMsg = err.msg
              break
            case '1019':
              this.phoneCodeErrMsg = err.msg
              break
            default:
              this.$store.commit('common/setMessage', err.msg || err)
          }
        } else {
          this.$store.commit('common/setMessage', err.msg || err)
        }
      })
    }
  },
  destroy () {
    this.timeoutHandler.forEach(clearTimeout)
  },
  mounted () {
    if (!this.$store.state.authorization.setForgetPwdStep1Sussces) {
      this.$router.push('/account/entry/findPwd-step1')
    }
  }
}
</script>

<style lang="less">
#forgetPwd-step2 {
    width: 1200px;
    box-sizing: border-box;
    text-align: center;
    margin: 64px auto 0 auto;
    .stepinfo {
        width: 640px;
        margin: 89px auto 80px auto;
    }
    .form-area {
        width: 400px;
        margin: 64px auto 20px auto;
        .errMsg {
          text-align: left;
        }
        .addons {
            button {
                border: none;
                background: #ff4544;
                color: #ffffff;
                width: 123px;
                height: 42px;
                font-size: 12px;
                float: right;
            }
            &.disabled {
                background-color: #f2f2f2;
                color: #333;
                pointer-events: none;
            }
        }
    }
}
</style>
