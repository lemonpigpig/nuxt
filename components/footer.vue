<template>
  <footer>
    <div class="footer-one wrapper uk-flex uk-flex-space-between uk-flex-middle ">
      <div class="uk-flex uk-flex-middle uk-flex-column">
        <p class="service">客服电话</p>
        <p class="service-num">400-188-0871</p>
        <p class="service-content">24小时在线为您服务</p>
      </div>
      <div class="speciality uk-flex uk-flex-center">
        <gz-icon icon="you" size="36"></gz-icon>
        <div>
          <p class="name">国资商城</p>
          <p class="des">新鲜、健康、优质</p>
        </div>
      </div>
      <div>
        <img src="../assets/img/division.png">
      </div>
      <div class="speciality uk-flex uk-flex-center">
        <gz-icon icon="pin-b2c" size="36"></gz-icon>
        <div>
          <p class="name">品质保证</p>
          <p class="des">正规、质优、低价</p>
        </div>
      </div>
      <div>
        <img src="../assets/img/division.png">
      </div>
      <div class="speciality uk-flex uk-flex-center">
        <gz-icon icon="miao" size="36"></gz-icon>
        <div>
          <p class="name">每天秒杀</p>
          <p class="des">总有你想不到的低价</p>
        </div>
      </div>
      <div>
        <img src="../assets/img/division.png">
      </div>
      <div class="speciality uk-flex uk-flex-center">
        <gz-icon icon="tui" size="36"></gz-icon>
        <div>
          <p class="name">退换货</p>
          <p class="des">7天退货 售后无忧</p>
        </div>
      </div>
    </div>
    <div class="footer-two">
      <div class="items wrapper uk-flex uk-flex-space-between uk-flex-top">
        <div v-for="category in categoryList" v-bind:key="category.id" class="item">
          <p class="name">{{category.name}}</p>
          <a :href="page.id | toHelpCenterPath" v-for="page in category.pages" v-bind:key="page.id" class="" target="_blank">
            {{page.title}}
          </a>
        </div>
        <div class="download">
          <p class="name">国资商城App & 微信公众号</p>
          <div class="uk-flex uk-flex-space-between">
            <img src="../static/img/qrcode.jpg" style="width:90px;height:90px;margin-top:15px">
            <img src="../static/img/public.jpg" style="width:90px;height:90px;margin:15px 0 0 60px">
          </div>
        </div>
      </div>
      <p class="footer-text">
        <span class="copyright">云南省国有资本运营商城管理有限公司&copy;COPYRIGHT 2017</span>
        <a href="http://www.miibeian.gov.cn" target="_blank">
          滇ICP备15003101号-6
        </a>
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=53011202000305" target="_blank">
          滇公网安备53011202000305号
        </a>
      </p>
    </div>
  </footer>
</template>
<script>
export default {
  data () {
    return {
      categoryList: this.$store.getters['help-center/categoryListInFooter']// this.$store.state['help-center'].categoryList
    }
  },
  filters: {
    toHelpCenterPath (id) {
      return `/help-center/${id}`
    }
  }
}
</script>
<style lang="less">
.footer-one {
  color: #333333;
  padding: 20px;
  .service {
    font-size: 16px;
    font-weight: 600;
  }
  .service-num {
    font-size: 28px;
    margin-top: 10px;
  }
  .service-content {
    font-size: 14px;
  }
  .speciality {
    text-align: left;
    img {
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }
    .name {
      font-size: 14px;
    }
    .des {
      font-size: 12px;
      color: #999999;
    }
  }
}

.footer-two {
  width: 100%;
  background-color: #210404;
  .items {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    ;
    padding: 80px 20px 40px 40px;
    margin-bottom: 30px;
    .item {
      font-size: 12px;
      font-weight: 300;
      line-height: 2;
      text-align: left;
      color: rgba(256, 256, 256, 0.8);
      a {
        cursor: pointer;
        color: white;
        display: block;
        &:hover {
          color: #ff4544;
          text-decoration: none;
        }
      }
      .name {
        font-size: 14px;
        line-height: 14px;
        font-weight: 300;
        text-align: left;
        margin-bottom: 19px;
        color: #fff;
        cursor: default;
        &:hover {
          color: #fff;
        }
      }
    }
    .download {
      .name {
        font-size: 14px;
        font-weight: 300;
        text-align: left;
        color: #fff;
      }
    }
    .tip {
      font-size: 12px;
      font-weight: 300;
      line-height: 2;
      text-align: left;
      color: #ae8560;
      margin-top: 10px;
      margin-bottom: 5px;
    }
  }
  .footer-text {
    font-size: 11px;
    font-weight: 300;
    padding-bottom: 40px;
    color: rgba(256, 256, 256, 0.8);
    .copyright {
      margin: 0 5px 0 5px;
      font-size: 12px;
      color: #ae8560;
    }
    a {
      color: #ae8560;
    }
  }
  .footer-logo {
    margin-top: 50px;
    padding-bottom: 30px;
  }
}
</style>
