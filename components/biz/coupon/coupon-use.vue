<template lang="html">
    <div id="coupon" :style="{'opacity': couponinof.status === 3 ? 0.5 : 1}" @mouseleave="hideDetail">
          <div @click="showAngleVisible(couponinof.status ? couponinof.status : '-10')">
              <div class="top" :style="{'background-image': `url(${couponBg})`}">
                  <div>
                        <span class="icon"><img src="~assets/img/icon6.svg"></span>
                        <span class="num">{{couponinof.faceValue}}</span>
                        <span class="desc">{{couponinof.useOrderAmountLimit ? `满${couponinof.useOrderAmountLimit}`: '无门槛'}}</span>
                        <span class="desc">{{couponinof.isGlobal ? '全场通用': '指定商品'}}</span>
                  </div>
                  <p class="name">[<span>国资商城</span><span> {{couponinof.couponName}}</span>]</p>
                  <p class="time">{{couponinof.useEndTime.substr(0, 4) == '2099' ? '长期有效': `有效期至${couponinof.useEndTime.substr(0, 10)}`}}</p>
              </div>
              <!-- :class="{'active-bottom': type == 1 ? showAngle : active}" -->
              <div class="bottom" v-if="this.$route.name === 'account-center'">
                  <div class="detail-area" v-if="couponinof.introduction.length > 0">
                      <h6 @click="showCover">详细说明</h6>
                      <span>{{couponinof.introduction.length > 40 ? couponinof.introduction.substr(0, 40) + '.....' : couponinof.introduction}}</span>
                      <div class="cover" v-if="couponinof.introduction.length > 40" v-show="showDetailCover">
                          <p>{{couponinof.introduction}}</p>
                      </div>
                  </div>
                  <div class="btn-area" v-if="couponinof.status === 2">
                      <button v-if="couponinof.status === 2" :class="{'isGlobal': !couponinof.isGlobal}" type="button" @click="goHref">立即使用</button>
                  </div>
              </div>
          </div>
          <div @click="showAngleVisible(couponinof.status ? couponinof.status : '-10')" class="angle-part" v-show="type == 1 ? (showAngle || couponinof.status === 4) : (active)">
             <img :class="{'expriedAngle': couponinof.status === 4}" :src="couponAngle">
          </div>
    </div>
</template>

<script>
export default {
  name: 'coupon-use',
  props: {
    couponinof: {
      type: Object,
      default: () => {}
    },
    bgType: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    couponBg () {
      return this.couponinof.status === 4
      ? this.imgBg.expired
      : (this.couponinof.isGlobal ? this.imgBg.noLimit : this.imgBg.isLimit)
    },
    couponAngle () {
      return this.couponinof.status === 4
      ? this.imgAngle.expired
      : (this.couponinof.isGlobal ? this.imgAngle.noLimit : this.imgAngle.isLimit)
    }
  },
  methods: {
    showAngleVisible (status) {
      if (status === '-10') {
        if (this.showAngle) {
          this.$set(this, 'showAngle', !this.showAngle)
        } else {
          this.$set(this, 'showAngle', true)
        }
        this.$emit('showAngle', this.couponinof)
      }
    },
    hideDetail () {
      if (this.$route.name === 'account-center') {
        this.$set(this, 'showDetailCover', false)
      }
    },
    goHref () {
      this.$router.push('/')
    },
    showCover () {
      if (this.couponinof.introduction.length > 40) {
        this.$set(this, 'showDetailCover', !this.showDetailCover)
      }
    }
  },
  data () {
    return {
      imgBg: {
        isLimit: require('~static/img/coupon/redbg.png'),
        noLimit: require('~static/img/coupon/yellowbg.png'),
        expired: require('~static/img/coupon/greybg.png')
      },
      imgAngle: {
        isLimit: require('~static/img/coupon/anglered.svg'),
        noLimit: require('~static/img/coupon/angleyellow.svg'),
        expired: require('~static/img/coupon/anglexpired.png')
      },
      showDetailCover: false,
      showAngle: false
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
  #coupon {
      position: relative;
      width: 220px;
      cursor: pointer;
      .yellowbg {
          background-image: url('~static/img/coupon/yellowbg.png');
      }
      .redbg {
          background-image: url('~static/img/coupon/redbg.png');
      }

      .top {
          height: 110px;
          padding-top: 10px;
          padding-left: 15px;
          background-size: cover;
          color: #fff;
          .desc {
              font-size: 12px;
              margin-left: 3px;
          }
          .icon {
              font-size: 28px;
          }
          .num {
              font-size: 30px;
          }
          .time {
              font-size: 12px;
              opacity: 0.5;
              margin-top: 5px;
          }
          .name {
              font-size: 12px;
              color: #fff;
              margin-top: 12px;
          }
      }
      .bottom {
          position: relative;
          width: 100%;
          height: 180px;
          z-index: 999;
          padding: 12px;
          background: #f0f0f0;
          h6 {
              font-size: 12px;
              color: #666;
          }
          span {
              color: #888;
              font-size: 12px;
          }
          button {
              position: absolute;
              bottom: 10px;
              left: 50%;
              margin-left: -60px;
              border: none;
              background: #fff;
              width: 120px;
              height: 30px;
              border-radius: 30px;
              font-size: 14px;
              border: 1px solid #dd8d00;
              color: #dd8d00;
          }
          button:hover {
              background: #dd8d00;
              color: #fff;
          }
          .isGlobal {
              border: 1px solid #ff4544;;
              color: #ff4544;
          }
          .isGlobal:hover {
              background: #ff4544;
              color: #fff;
          }
          .cover {
              position: absolute;
              padding: 21px 10px 20px 15px;
              background: url('~static/img/coupon/99.svg') no-repeat top left;
              left: 13px;
              width: 200px;
              top: 26px;
              z-index: 999;
              display: block;
              height: 170px;
              overflow-y: auto;
              div {
                  padding: 18px 7px 20px 9px;
              }
              p {
                  font-size: 12px;
                  color: #666;
              }
          }
      }
      .bottom:hover .cover {
          display: block;
      }
      .btn-area {
          text-align: center;
      }
      .active-bottom{
        border: 1px solid #ff4544 !important;
      }
      .angle-part {
        position: absolute;
        bottom:0;
        right: 0;
        img {
            display: block;
            width: 20px;
        }
        .expriedAngle {
            width: 66px;
        }
      }
  }
</style>
