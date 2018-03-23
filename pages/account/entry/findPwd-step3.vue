<template lang="html">
    <div id="forgetPwd-step1">
        <stepInfo :stepinfo="stepinfo" :showComplete="showComplete"></stepInfo>
        <div class="form-area">
            <gzInput
                label="设置密码"
                type="password"
                placeholder="建议至少使用两种字符组合"
                v-model="newPassword"
                :errMsg="newPasswordErrMsg"
                required="true"
                @blur="checkPassword"
                :isFocused="isFocused"
            ></gzInput>
            <gzInput
                label="确认密码"
                type="password"
                placeholder="请再次输入密码"
                :errMsg="confirmPasswordErrMsg"
                v-model="confirmPassword"
                required="true"
                @blur="checkConfirmPassword"
                :isFocused="isFocused"
            ></gzInput>
            <div class="FwdconfirmBox confirmBox">
                <button
                  :disabled="disableValue"
                  :class={disabled:disableValue}
                  @click="forgetPwdStep3"
                >提交</button>
            </div>
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
      newPassword: '',
      confirmPassword: '',
      newPasswordErrMsg: '',
      confirmPasswordErrMsg: '',
      isFocused: false,
      stepinfo: [{ name: '填写账户名', class: 'active' }, { name: '验证身份', class: 'active' }, { name: '设置新密码', class: 'active' }],
      showComplete: true
    }
  },
  computed: {
    passwordValid () {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      return reg.test(this.newPassword)
    },
    confirmPasswordValid () {
      return this.newPassword === this.confirmPassword
    },
    disableValue () {
      return (
        !this.passwordValid ||
        !this.confirmPasswordValid ||
        !this.confirmPassword.length > 5
      )
    }
  },
  methods: {
    checkPassword () {
      this.$set(this, 'newPasswordErrMsg', !this.passwordValid ? '请使用字母数字组合,6-12个字符' : '')
    },
    checkConfirmPassword () {
      this.$set(this, 'confirmPasswordErrMsg', !this.confirmPasswordValid ? '密码不一致' : '')
    },
    forgetPwdStep3 () {
      const queryCondition = {
        oldPassword: '',
        newPassword: this.confirmPassword
      }
      this.$store.dispatch('account/modifyPassword', queryCondition).then(() => {
        this.$router.push('/account/entry/findPwd-Success')
      }).catch((err) => {
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
  mounted () {
    if (!this.$store.state.authorization.setForgetPwdStep2Sussces) {
      this.$router.push('/account/entry/findPwd-step2')
    }
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
        margin: 64px auto 0 auto;
        .codeinfo {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
        }
    }
    button {
        width: 400px;
    }
}
</style>
