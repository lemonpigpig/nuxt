<template lang="html">
    <div id="coupon" :style="{'opacity': couponinof.status === 2 ? 0.5 : 1}">
          <div @click="showAngleVisible(couponinof.status ? couponinof.status : '-10')">
              <div class="top" :style="{'background-image': `url(${couponBg})`}">
                  <div>
                      <div>
                            <span class="icon"><img src="~static/img/icon6.svg"></span>
                            <span class="num">{{couponinof.faceValue}}</span>
                            <span class="desc">{{couponinof.useOrderAmountLimit ? `满${couponinof.useOrderAmountLimit}`: '无门槛'}}</span>
                            <span class="desc">指定商品</span>
                      </div>
                      <p class="time">有效期至{{couponinof.useEndTime.substr(0, 10)}}</p>
                  </div>
              </div>
              <!-- :class="{'active-bottom': type == 1 ? showAngle : active}" -->
              <div class="bottom"  :style="{'border' : activeBottom}">
                  [<span>国资商城</span>
                  <span> {{couponinof.couponName}}</span>]
              </div>
          </div>
          <div class="angle-part" v-show="type == 1 ? (showAngle || couponinof.status === 3) : (active)">
              <img :src="couponinof.useOrderAmountLimit <= 0 ?imgAngle.noLimit : imgAngle.isLimit">
          </div>
    </div>
</template>

<script>
export default {
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
    activeBottom () {
      return this.type === 1
      ? (this.showAngle ? (this.couponinof.useOrderAmountLimit <= 0 ? '1px solid #ff8d00 !important' : '1px solid #ff4544 !important') : '')
      : (this.active ? (this.couponinof.useOrderAmountLimit <= 0 ? '1px solid #ff8d00 !important' : '1px solid #ff4544 !important') : '')
    }
  },
  methods: {
    showAngleVisible (status) {
      if (this.status === 1) {
        this.$set(this, 'showAngle', !this.showAngle)
      }
      if (status === '-10') {
        if (this.showAngle) {
          this.$set(this, 'showAngle', !this.showAngle)
        } else {
          this.$set(this, 'showAngle', true)
        }
        this.$emit('showAngle', this.couponinof)
      }
    },
    couponImg () {
      if (this.couponinof.status === 3) {
        this.$set(this, 'couponBg', this.imgBg.expired)
        this.$set(this, 'couponAgnle', this.imgAngle.expired)
      } else if (this.couponinof.useOrderAmountLimit) {
        this.$set(this, 'couponBg', this.imgBg.isLimit)
        this.$set(this, 'couponAgnle', this.imgAngle.isLimit)
        return this.imgBg.isLimit
      } else {
        this.$set(this, 'couponBg', this.imgBg.noLimit)
        this.$set(this, 'couponAgnle', this.imgAngle.noLimit)
      }
    }
  },
  data () {
    return {
      imgBg: {
        isLimit: require('~static/img/redbg.png'),
        noLimit: require('~static/img/yellowbg.png'),
        expired: require('~static/img/gray.png')
      },
      imgAngle: {
        isLimit: require('~static/img/anglered.png'),
        noLimit: require('~static/img/angleyellow.png'),
        expired: require('~static/img/anglexpired.png')
      },
      showAngle: false,
      couponBg: '',
      couponAgnle: ''
    }
  },
  mounted () {
    this.couponImg()
  }
}
</script>

<style lang="less">
  #coupon {
      position: relative;
      width: 200px;
      cursor: pointer;
      .yellowbg {
          background-image: url('~static/img/yellowbg.png');
      }
      .redbg {
          background-image: url('~static/img/redbg.png');
      }

      .top {
          height: 72px;
          padding-top: 10px;
          padding-left: 15px;
          background-size: contain;
          color: #fff;
          .desc {
              font-size: 14px;
              margin-left: 6px;
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
          }
      }
      .bottom {
         border: 1px solid #d1d1d1;
         line-height: 36px;
         font-size: 12px;
         color: #999;
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
      }
  }
</style>
