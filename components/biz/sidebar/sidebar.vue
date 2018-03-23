<template lang="html">
  <div class="menu">
    <ul class="main-menu">
      <li class="main-title" v-for="(item, index) in menuList">
        {{item.name}}
        <ul>
          <li  v-for="child in item.child" @click="sendComponentInfo(child)">
            <a class="sub-title" :class="{'active': child.index === flag}">{{child.name}}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    flag: {
      type: Number,
      default: -1
    }
  },
  name: 'side-bar',
  methods: {
    sendComponentInfo (item) {
      console.log(item)
      const component = item.url.query.source
      if (item.name === '退款/退货申请') {
        this.$router.push(`/account/center?type=3&source=${component}`)
      } else if (item.name === '订单查询') {
        this.$router.push(`/account/center?type=1&source=${component}`)
      } else {
        this.$router.push(`/account/center?source=${component}`)
      }
      // if (item.name !== '订单查询') {
      //   this.$router.push(`/account/center?source=${component}`)
      // } else if (item.name === '退款/退货申请') {
      //   this.$router.push(`/account/center?type=3&source=${component}`)
      // } else {
      //   this.$router.push(`/account/center?type=1&source=${component}`)
      // }
    }
  },
  data () {
    return {
      menuList: [{
        name: '订单管理',
        child: [{
          name: '订单查询',
          active: true,
          index: 0,
          url: {
            query: {
              source: 'order-search'
            }
          }
        }]
      },
      {
        name: '服务中心',
        child: [{
          name: '我的收藏',
          active: false,
          index: 1,
          url: {
            query: {
              source: 'collect-list'
            }
          }
        }]
      },
      {
        name: '个人信息管理',
        child: [{
          name: '管理收货地址',
          active: false,
          index: 2,
          url: {
            query: {
              source: 'address-list'
            }
          }
        }, {
          name: '修改密码',
          active: false,
          index: 3,
          url: {
            query: {
              source: 'modify-pwd'
            }
          }
        }]
      },
      {
        name: '优惠券',
        child: [{
          name: '我的优惠券',
          active: false,
          index: 4,
          url: {
            query: {
              source: 'my-coupon'
            }
          }
        }]
      }, {
        name: '退款/退货管理',
        child: [{
          name: '退款/退货申请',
          active: false,
          index: 5,
          url: {
            query: {
              source: 'rma-search'
            }
          }
        }, {
          name: '申请记录',
          active: false,
          index: 6,
          url: {
            query: {
              source: 'rma-list'
            }
          }
        }]
      }]
    }
  }
}
</script>

<style lang="less">
.menu{
  background: #f4f4f4;
  width: 184px;
  height: 610px;
  position: relative;;
  ul,ul li {
    list-style: none;
  }
  ul.main-menu{
    padding: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    li.main-title{
        margin-bottom: 33px;
    }

  }
  li{
    a.sub-title{
      font-size: 12px;
      color: #666666;
      font-weight: 300;
      text-decoration: none;
      cursor: pointer;
    }
    a.active{
      color: #ff4544;
    }
  }
}
</style>
