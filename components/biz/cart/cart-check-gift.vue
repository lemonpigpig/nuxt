<template lang="html">
  <div class="cart-check-gift">
    <div class="cart-check-gift-head">
      可领取最多1件赠品
    </div>
    <div class="cart-check-gift-content">
      <div class="content-item-list">
        <div class="content-item" v-for="gift in [1,2,3]">
          <div class="img">
            <img src="" alt="">
          </div>
          <ul class="list">
            <li v-for="item in [1, 2, 3, 4, 5]">
              <span class="name">原生态鲜野生纯农家自产 枣花蜂蜜380g  </span>
              <span class="num">x1</span>
            </li>
            <li class="total">
              <span class="price">¥0.00</span>
              <span class="info">(满¥149.00可领取)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="cart-check-gift-foot">
      <span class="btn">返回</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cart-check-gift'
}
</script>

<style lang="less">
.cart-check-gift{
  width: 500px;
  height: 420px;
  border: solid 1px #ff4544;
  box-sizing: border-box;
  position: relative;
  &-head{
    width: 100%;
    height: 26px;
    background: #ff4544;
    color: white;
    padding-left: 17px;
  }
  &-content{
    height: 328px;
    width: 100%;
    padding-top: 19px;
    padding-left: 24px;
    padding-right: 19px;
    overflow: auto;
    .content-item-list{
      .content-item{
        // height: 82px;
        margin-bottom: 65px;
        width: 100%;
        .img{
          width: 82px;
          height: 82px;
          border: 1px solid #eeeeee;
          box-sizing: border-box;
          margin-right: 20px;
          float: left;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .list{
          width: 318px;
          list-style: none;
          margin-left: 102px;
          li.total{
            margin-top: 9px;
          }
          li{
            width: 100%;
            font-size: 14px;
            span.name{
              line-height: 1.43;
              color: #333333;
              max-width: 300px;
              overflow: hidden;
            }
            span.num{
              margin-left: 10px;
              color: #999999;
            }
            .price{
              font-weight: 600;
              color: #ff4544;
            }
            .info{
              font-weight: 600;
              line-height: 1.43;
              color: #333333;
              margin-left: 28px;
            }
          }
        }
      }
    }
  }

  &-foot{
    position: absolute;
    bottom: 13px;
    width: 100%;
    .btn{
        width: 80px;
       height: 34px;
       background-color: #f4f4f4;
       border: solid 1px #dddddd;
       margin: 0 auto;
       display: block;
       font-size: 14px;
       color: #333333;
       text-align: center;
       line-height: 34px;
    }
  }

}
</style>
