<template lang="html">
    <div id="myprofile">
      <gzInput
          label="用户名"
          placeholder="请输入您的用户名"
          v-model="userNname"
          required="true"
          :isFocused="isFocused"
      ></gzInput>
      <gzInput
          label="昵称"
          placeholder="您输入您的昵称"
          v-model="userNname"
          required="true"
          :isFocused="isFocused"
      ></gzInput>
      <div class="profile-form">
          <div class="content">
              <span>性别</span>
              <label>
                  <img v-if="isMale" src="../../../assets/img/checkbox-checked.png"/>
                  <em v-else></em>
                  男
              </label>
              <label>
                  <img v-if="!isMale" src="../../../assets/img/checkbox-checked.png"/>
                  <em v-else></em>
                  女
              </label>

          </div>
      </div>
      <div class="profile-form">
          <div class="content">
              <span>生日</span>
              <timeSelected></timeSelected>
          </div>
      </div>
      <gzInput
          label="手机"
          placeholder="您输入您的手机号码"
          v-model="userNname"
          required="true"
          :isFocused="isFocused"
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
          label="邮箱地址"
          placeholder="请输入您的邮箱地址"
          v-model="userNname"
          required="true"
          :isFocused="isFocused"
      ></gzInput>
      <gzInput
          label="联系电话"
          placeholder="选填号码"
          v-model="userNname"
          required="true"
          :isFocused="isFocused"
      ></gzInput>
      <div class="profile-form">
          <div class="content">
              <span>地区</span>
              <addressSelected></addressSelected>
          </div>
      </div>
      <gzInput
          label="详细地址"
          placeholder="您输入您的详细地址"
          v-model="userNname"
          required="true"
          :isFocused="isFocused"
      ></gzInput>
      <div class="confirmBox">
          <button
          >立即提交</button>
      </div>
    </div>
</template>

<script>
import gzInput from '~components/biz/account/input.vue'
import timeSelected from '~components/biz/account/timeSelected.vue'
import addressSelected from '~components/biz/address/addressSelected.vue'

export default {
  data () {
    return {
      isMale: true,
      countdown: 0,
      maxCountDown: 60
    }
  },
  components: { gzInput, timeSelected, addressSelected }
}
</script>

<style lang="less">
  #myprofile{
      width: 460px;
      .profile-form {
          margin-bottom: 28px;
          border: solid 1px #dddddd;
          height: 42px;
          .content {
              height: 26px;
              margin-top: 10px;
              overflow: hidden;
              span {
                  float: left;
                  margin-left: 20px;
                  width: 90px;
                  color: #666;
                  letter-spacing: 3px;
              }
              label {
                  em {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border: 1px solid #999;
                    border-radius: 3px;
                  }
              }
              label:last-child{
                  margin-left: 50px;
              }
          }
      }
      .gz-input {
        .addons {
            button {
                border: none;
                background: #ff4544;
                color: #ffffff;
                width: 123px;
                height: 46px;
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
      .confirmBox {
          button {
              width: 460px;
          }
      }
  }
</style>
