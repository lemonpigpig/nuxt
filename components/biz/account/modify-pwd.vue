<template lang="html">
    <div id="modify-pwd">
        <div class="form-area">
          <gzInput
              label="旧密码"
              type="password"
              placeholder="请输入密码"
              v-model="originalPassword"
              :errMsg="originalPasswordErrMsg"
              required="true"
              :isFocused="isFocused"
          ></gzInput>
            <gzInput
                label="新密码"
                type="password"
                placeholder="建议至少使用两种字符组合"
                v-model="newPassword"
                :errMsg="newPasswordErrMsg"
                required="true"
                :isFocused="isFocused"
            ></gzInput>
            <gzInput
                label="确认密码"
                type="password"
                placeholder="请再次输入密码"
                :errMsg="confirmPasswordErrMsg"
                v-model="confirmPassword"
                required="true"
                :isFocused="isFocused"
            ></gzInput>
            <div class="confirmBox">
                <button
                  :disabled="disableValue"
                  :class={disabled:disableValue}
                  @click="modifyPassword"
                >确认</button>
            </div>
        </div>
    </div>
</template>

<script>
import gzInput from '~components/biz/account/input.vue'

export default {
  name: 'modify-pwd',
  components: { gzInput },
  data () {
    return {
      originalPassword: '',
      newPassword: '',
      confirmPassword: '',
      originalPasswordErrMsg: '',
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
        !this.originalPassword.length > 0
      )
    }
  },
  methods: {
    checkPassword () {
      this.$set(this, 'passwordErrMsg', !this.passwordValid ? '请使用字母数字组合,6-12个字符' : '')
    },
    checkConfirmPassword () {
      this.$set(this, 'confirmPasswordErrMsg', !this.confirmPasswordValid ? '密码不一致' : '')
    },
    modifyPassword () {
      const queryCondition = {
        oldPassword: this.originalPassword,
        newPassword: this.confirmPassword
      }
      this.$store.dispatch('account/modifyPassword', queryCondition).then(() => {
        this.$set(this, 'originalPassword', '')
        this.$set(this, 'newPassword', '')
        this.$set(this, 'confirmPassword', '')
        this.$store.commit('common/setMessage', '修改成功')
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
              this.this.$store.commit('common/setMessage', err.msg || err)
          }
        } else {
          this.$store.commit('common/setMessage', err.msg || err)
        }
      })
    }
  }
}
</script>

<style lang="less">
#modify-pwd {
    box-sizing: border-box;
    .form-area {
        width: 400px;
        .confirmBox button {
            width: 400px;
        }
    }
}
</style>
