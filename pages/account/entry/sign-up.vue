<template lang="html">
    <div id="sign-up">
        <div class="form-area">
            <gzInput
                label="用户名"
                type="text"
                placeholder="您的账户名和登录名"
                v-model="userName"
                required="true"
                :errMsg="userNameErrMsg"
                :isFocused="isFocused"
                @blur="checkUserName"
              ></gzInput>
            <gzInput
                label="设置密码"
                type="password"
                placeholder="请使用字母数字组合,6-12个字符"
                v-model="password"
                required="true"
                :errMsg="passwordErrMsg"
                :isFocused="isFocused"
                @blur="checkPassword"
            ></gzInput>
            <gzInput
                label="确认密码"
                type="password"
                placeholder="请输入密码"
                :errMsg="confirmPasswordErrMsg"
                v-model="confirmPassword"
                required="true"
                :isFocused="isFocused"
                @blur="checkConfirmPassword"
            ></gzInput>
            <gzInput
                type="mail"
                label="邮箱验证"
                placeholder="建议使用常用邮箱"
                v-model="mail"
                required="true"
                :isFocused="isFocused"
                :errMsg="mailErrMsg"
                @blur="checkMail"
              ></gzInput>
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
            <gzInput
                label="验证码"
                type="text"
                placeholder="请输入图片验证码"
                v-model="imgVerifyCode"
                required="true"
                :errMsg="imgcodeErrMsg"
                :isFocused="isFocused"
                @blur="checkImgCode"
            >
            <img @click="getImgVerify" :src="`data:image/png;base64,${imgVerifyData.img}`"/>
          </gzInput>
            <div class="terms"><input type="checkbox" v-model="ischecked"> 我已阅读并同意<span @click="gotoAgreement">《国资商城用户注册协议》</span></div>
            <div class="confirmBox">
                <button
                    :disabled="signUpBtnDisabled"
                    :class={disabled:signUpBtnDisabled}
                    @click="signUp"
                >立即注册</button>
            </div>
        </div>
        <div class="pic-area">
            <div>
                <img src="../../../assets/img/pic.jpg"/>
            </div>
            <span>已有账号？</span>
            <span @click="signIn"> 马上登录</span>
        </div>
        <transition name="mask">
            <div class="mask" v-if="this.mask" @click="this.cancle"></div>
        </transition>
        <transition name="agreementBox">
                <div class="agreementBox" v-if="this.agreementBox">
                      <div class="title">
                            <span class="name">国资商城用户注册协议</span>
                            <span class="close" @click="this.cancle">×</span>
                      </div>
                      <div class="body">
                            <gsGreement></gsGreement>
                      </div>
                      <div class="footer">
                          <div class="sure" @click="favour">
                                同意并继续
                          </div>
                      </div>
                </div>
        </transition>
    </div>
</template>

<script>
import gzInput from '~components/biz/account/input.vue'
import Cookies from '~plugins/cookies'
import gsGreement from '~components/biz/account/agreement.vue'

export default {
  components: { gzInput, gsGreement },
  data () {
    return {
      phone: '',
      password: '',
      confirmPassword: '',
      mail: '',
      phoneCode: null,
      imgVerifyCode: '',
      userName: '',
      countdown: 0,
      maxCountDown: 60,
      timeoutHandler: [],
      phoneErrMsg: '',
      passwordErrMsg: '',
      confirmPasswordErrMsg: '',
      phoneCodeErrMsg: '',
      mailErrMsg: '',
      imgcodeErrMsg: '',
      userNameErrMsg: '',
      isFocused: false,
      ischecked: false,
      hasDefaultSlot: true,
      imgVerifySession: '',
      imgVerify: '',
      mask: false,
      agreementBox: false
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
    passwordValid () {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      return reg.test(this.password)
    },
    confirmPasswordValid () {
      return this.password === this.confirmPassword
    },
    mailValid () {
      const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ // eslint-disable-line
      return reg.test(this.mail)
    },
    phoneValid () {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0-9])\d{8}$/
      return reg.test(this.phone)
    },
    phonecodeValid () {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0-9])\d{8}$/
      return reg.test(this.phone)
    },
    imgCodeValid () {
      return this.imgVerifyCode.length > 0
    },
    phoneCodeBtnIsInvalid () {
      return !(this.phoneValid && this.countdown === 0)
    },
    signUpBtnDisabled () {
      return (
        !this.userNameValid ||
        !this.passwordValid ||
        !this.mailValid ||
        !this.phoneValid ||
        !this.phonecodeValid ||
        !this.imgCodeValid ||
        !!this.phoneErrMsg ||
        !!this.confirmPasswordErrMsg ||
        !this.ischecked
      )
    },
    showNavigation () {
      return this.$store.state.common.showNavigation
    }
  },
  watch: {
    imgVerifyData: {
      handler () {
      }
    }
  },
  methods: {
    checkUserName () {
      this.$set(this, 'userNameErrMsg', !this.userNameValid ? '4-20个字符，不包含特殊字符' : '')
    },
    checkPassword () {
      this.$set(this, 'passwordErrMsg', !this.passwordValid ? '请使用字母数字组合,6-12个字符' : '')
    },
    checkConfirmPassword () {
      this.$set(this, 'confirmPasswordErrMsg', !this.confirmPasswordValid ? '两次密码输入不一致' : '')
    },
    checkMail () {
      this.$set(this, 'mailErrMsg', !this.mailValid ? '邮箱格式不正确' : '')
    },
    checkPhone () {
      this.$set(this, 'phoneErrMsg', !this.phoneValid ? '请输入正确的手机号' : '')
    },
    checkPhoneCode () {
      this.$set(this, 'phoneCodeErrMsg', !this.phonecodeValid ? '请输入正确的手机验证码' : '')
    },
    checkImgCode () {
      this.$set(this, 'imgcodeErrMsg', !this.imgCodeValid ? '请输入正确的图片验证码' : '')
    },
    sendPhoneCode () {
      this.$store.dispatch('authorization/phoneExisted', this.phone).then((res) => {
        if (res.data) {
          this.phoneErrMsg = '用户已存在'
        } else {
          this.$set(this, 'countdown', this.maxCountDown)
          const verifyCode = {
            Phone: this.phone,
            VerificationCodeType: '1'
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
    signUp () {
      const queryCondition = {
        phone: this.phone,
        verficationCode: this.phoneCode,
        password: this.password,
        email: this.mail,
        userName: this.userName,
        imgSession: this.imgVerifyData.session,
        imgVerifyCode: this.imgVerifyCode
      }
      this.$store.dispatch('authorization/signUp', queryCondition).then((data) => {
        if (!process.SERVER_BUILD) {
          global.hasOwnProperty('localStorage') && global.localStorage.setItem('sessionId', data.sessionId)
          global.hasOwnProperty('localStorage') && global.localStorage.setItem('userName', this.userName)

          Cookies.setCookie('sessionId', data.sessionId, 15)
          Cookies.setCookie('userName', this.userName, 15)
          this.$store.commit('common/setMessage', '注册成功')
          setTimeout(() => {
            this.signIn()
          }, 1000)
        }
      }).catch((err) => {
        if (err.code) {
          switch (err.code.toString()) {
            case '1018':
              this.phoneCodeErrMsg = err.msg
              break
            case '1009':
              this.$store.commit('common/setMessage', '短信验证码不能为空')
              break
            default:
              this.$store.commit('common/setMessage', err.msg || err)
          }
        } else {
          this.$store.commit('common/setMessage', err.msg || err)
        }
      })
    },
    signIn () {
      this.$router.push('sign-in')
    },
    getImgVerify () {
      this.$store.dispatch('authorization/getImgVerify').then((data) => {
        this.$set(this, 'imgVerifySession', data.session)
        this.$store.commit('common/setShowNavigation', false)
        this.$store.commit('common/setBreadCrumbVisibility', false)
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    },
    gotoAgreement () {
      this.mask = true
      this.agreementBox = true
    },
    cancle () {
      this.mask = false
      this.agreementBox = false
    },
    favour () {
      this.ischecked = true
      this.cancle()
    }
  },
  mounted () {
    this.getImgVerify()
  },
  destroy () {
    this.timeoutHandler.forEach(clearTimeout)
  }
}
</script>

<style lang="less">
#sign-up {
    width: 1200px;
    box-sizing: border-box;
    margin: 30px auto 64px auto;
    overflow: hidden;
    .form-area {
        width: 400px;
        float: left;
        .codeinfo {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
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
            img {
              height: 42px;
            }
            &.disabled {
                background-color: #f2f2f2;
                color: #333;
                pointer-events: none;
            }
        }
    }
    .terms {
      margin-bottom: 25px;
      font-size: 14px;
      color: #333;
      span {
          color: #ff4544;
          cursor: pointer;
      }
    }
    .pic-area {
        float: left;
        margin-left: 180px;
        font-size: 14px;
        div {
          margin-bottom: 16px;
        }
        span:last-child {
          color: #ff4544;
          cursor: pointer;
        }
    }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    z-index: 10000;
  }
  .agreementBox {
    position: fixed;
    left: 50%;
    top: 30px;
    transform: translateX(-50%);
    width: 958px;
    background-color: #fff;
    border-radius: 6px;
    border-shadow: 0 5px 15px rgba(0, 0, 0, .5);
    z-index: 10001;
    .title {
      height: 52px;
      border-bottom: 1px solid #e5e5e5;
      padding: 15px;
      .name {
        font-size: 16px;
        font-weight: 700;
        color: #333;
      }
      .close {
        cursor: pointer;
        float: right;
        font-size: 21px;
        font-weight: bold;
        line-height: 1;
        color: #000;
        text-shadow: 0 1px 0 #fff;
        filter: alpha(opacity=20);
        opacity: .2;
      }
    }
    .body {
      width: 100%;
      height: 510px;
      border-bottom: 1px solid #e5e5e5;
      overflow: auto;
      .agreement-wrapper {
        margin-top: 0;
      }
    }
    .footer {
      position: relative;
      width: 100%;
      height: 65px;
      .sure {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: 200px;
        height: 34px;
        background-color: #ff524d;
        border-radius: 4px;
        font-size: 14px;
        line-height: 34px;
        text-align: center;
        color: #fff;
        font-weight: 700;
        cursor: pointer;
      }
    }
  }
  .agreementBox-enter-active {
    transition: all .8s ease;
  }
  .agreementBox-leave-active {
    transition: all .5s ease;
  }
  .agreementBox-enter, .agreementBox-leave-to {
    top: 10px;
  }
  .mask-enter-active {
    transition: all 1s ease;
  }
  .mask-leave-active {
    transition: all 1.3s;
  }
  .mask-enter, .mask-leave-to {
    opacity: 0;
  }
}
</style>
