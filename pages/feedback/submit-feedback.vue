<template lang="html">
    <div id="submit-advise">
        <h5>尊敬的用户：</h5>
        <p>您好！为了给您提供更好的服务，我们希望收集您使用国资商城网站的看法或建议。对您的配合和支持表示衷心感谢！</p>
        <div>
            <textarea v-model="content" placeholder="请填写您的意见与建议"></textarea>
            <div>
                <h6>请留下您的联系方式</h6>
                <input v-model="link" placeholder="请输入您的手机号，QQ号，邮箱号等">
            </div>
            <div class="confirmBox">
                <button
                  :class={disabled:submitBtnDisabled}
                  :disabled="submitBtnDisabled"
                  @click="submit"
                >提交</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      content: '',
      link: ''
    }
  },
  computed: {
    contentValid () {
      return !!this.content
    },
    submitBtnDisabled () {
      return !this.contentValid
    }
  },
  methods: {
    submit () {
      const queryCondition = {
        Content: this.content,
        Phone: this.link,
        Platform: 1
      }
      this.$store.dispatch('account/submitAdvise', queryCondition).then(() => {
        this.$router.push('/feedback/feedback-success')
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    }
  },
  mounted () {
    this.$store.commit('common/setShowNavigation', false)
  }
}
</script>

<style lang="less">
  #submit-advise {
      width: 1200px;
      margin: 40px auto 120px auto;
      font-size: 16px;
      color: #666;
      h5 {
          font-size: 16px;
          font-weight: 600;
          line-height: 30px;
      }
      p {
          line-height: 26px;
      }
      div {
        textarea {
          margin-top: 14px;
          padding: 14px 10px;
          font-size: 14px;
          width: 940px;
          height: 245px;
          border: 1px solid #ddd;
        }
        div {
            margin-top: 30px;
            h6 {
                font-size: 14px;
                line-height: 26px;
            }
            input {
                width: 360px;
                padding: 12px 0 12px 10px;
                font-size: 12px;
                border: 1px solid #ddd;
            }
        }
        .confirmBox {
          margin-top: 40px;
          button {
              width: 200px;
              height: 40px;
         }
        }
      }
  }
</style>
