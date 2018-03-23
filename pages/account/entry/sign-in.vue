<template lang="html">
    <div id="sign-in" @keyup="enterLogin">
        <div class="form-area">
            <h2>国资商城账号登录</h2>
            <gzInput
                label="用户名"
                placeholder="请输入会员名/手机号"
                v-model="userName"
                required="true"
                :errMsg="userNameErrMsg"
                :isFocused="isFocused"
                @blur="checkLoginName"
            >
              <span
                class="addons"
                v-show = "!!userName"
                @click = "deleteUserName"
              ><img src="../../../assets/img/Group115.png"/>
              </span>
          </gzInput>
            <gzInput
                label="密码"
                type="password"
                placeholder="输入登录密码"
                v-model="password"
                required="true"
                :errMsg="passwordErrMsg"
                :isFocused="isFocused"
                @blur="checkPassword"
            >
            <span
              v-show = "!!password"
              @click="deletePassword"
            ><img src="../../../assets/img/Group115.png"/>
            </span>
            </gzInput>
            <div class="confirmBox">
                <button
                @click="signIn"
                >登录</button>
                <div class="links">
                    <span @click="goFindPwd" class="forPwd">忘记密码?</span>
                    <span @click="goSignUp" class="signUp">免费注册</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gzInput from '~components/biz/account/input.vue'
// import Cookies from '~plugins/cookies'

export default {
  data () {
    return {
      userName: '',
      password: null,
      userNameErrMsg: '',
      passwordErrMsg: '',
      isFocused: false
    }
  },
  computed: {
    loginNameValid () {
      return (
          /^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(this.userName) &&
          this.userName.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 0
      )
    },
    passwordValid () {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      return reg.test(this.password)
    },
    signUpBtnDisabled () {
      return (
        this.passwordValid &&
        this.loginNameValid
      )
    }
  },
  methods: {
    checkLoginName () {
      this.$set(this, 'userNameErrMsg', !this.loginNameValid ? '请输入正确的登录信息' : '')
    },
    checkPassword () {
      this.$set(this, 'passwordErrMsg', !this.passwordValid ? '请正确输入密码' : '')
    },
    deleteUserName () {
      this.$set(this, 'userName', '')
    },
    deletePassword () {
      this.$set(this, 'password', '')
    },
    goFindPwd () {
      this.$router.push('/account/entry/findPwd-step1')
    },
    goSignUp () {
      this.$router.push('/account/entry/sign-up')
    },
    signIn () {
      this.checkLoginName()
      this.checkPassword()
      if (this.signUpBtnDisabled) {
        const queryCondition = {
          account: this.userName,
          Password: this.password,
          loginType: 1
        }
        this.$store.dispatch('authorization/signIn', queryCondition).then((data) => {
          this.$store.commit('authorization/setUserAuth', data.sessionId)
          this.$store.dispatch('authorization/getProfile').then((data) => {
            if (!process.SERVER_BUILD) {
              localStorage.setItem('userName', data.userName)
              localStorage.setItem('phone', data.phone)
            }
          })

          // 同步购物车
          let localCart = []
          if (!process.SERVER_BUILD) {
            localCart = JSON.parse(localStorage.getItem('gz-cart')) || []
          }
          let cart = []
          if (localCart) {
            localCart.forEach(da =>
              cart.push({
                goodsId: da.productId || da.goodsId || da.id,
                quantity: da.productQuantity || da.goodsQuantity,
                isSelected: da.isSelected,
                itemType: da.itemType || 1
              })
            )
          }
          this.$store.dispatch('cart/getMergedCart', cart)
          .then(() => {
            if (global.hasOwnProperty('localStorage')) {
              localStorage.removeItem('gz-cart')
            }
          })
          .catch((err) => {
            console.log(err)
          })
          if (this.$route.query.back) {
            this.$router.back()
          } else {
            this.$router.replace(this.$route.query.redirect || '/')
          }
        }).catch((err) => {
          if (err.code) {
            switch (err.code.toString()) {
              case '1005':
                this.codeErrMsg = err.msg
                break
              case '1016':
                this.passwordErrMsg = err.msg
                break
              case '2001':
                this.userNameErrMsg = err.msg
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
    enterLogin () {
      if (event.keyCode === 13) {
        this.signIn()
      }
    }
  },
  mounted () {
    this.$store.commit('common/setShowNavigation', false)
    this.$store.commit('common/setBreadCrumbVisibility', false)
  },
  components: { gzInput }
}
</script>

<style lang="less">
#sign-in {
    width: 100%;
    height: 460px;
    overflow: hidden;
    margin:  10px auto 0px auto;
    background: url(~assets/img/Group5.jpg) no-repeat center;
    .form-area {
        width: 400px;
        float: right;
        margin-top: 43px;
        margin-right: 223px;
        padding: 32px 30px 74px 30px;;
        background: #fff;
        h2 {
            font-size: 18px;
            color: #333;
            margin-bottom: 19px;
        }
        .addons {
            span {
                margin-right: 12px;
            }
        }
        .gz-input:first-child {
            padding-bottom: 28px;
        }
        .codeinfo {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
        }
        .disabled {
                background-color: #ccc;
                pointer-events: none;
            }
        .links {
            font-size: 12px;
            margin-top: 13px;
            overflow: hidden;
            .forPwd {
                color: #333;
                float: left;
                cursor: pointer;
            }
            .signUp {
                color: #ff4544;
                float: right;
                cursor: pointer;
            }
        }
    }
  .addons {
    img {
      height: 16px;
      margin: 13px;
    }
  }
}
</style>
