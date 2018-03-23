<template lang="html">
  <div class="create-order">

      <address-info ref="addressList" @getSelectedItem="getSelectedItem"/>
      <pay-header :progressinfo="stepinfo"></pay-header>
      <div class="create-order-content">
        <div v-if="isPickUp">
          <pick-up @addressChange="setOneselfTakeAdress" @change="setDefaultAddress"></pick-up>
        </div>
        <div class="receiver-info" v-if="!isPickUp">
          <div class="title">
            收货人信息
          </div>
          <!-- v-show="showReceiverInfo" -->
          <div class="content" >
            <div class="left" v-show="showDefaultAddress">
              <div class="address">
                <gz-icon icon="local" size="23"></gz-icon>
                <span class="default-address"><span v-if="defaultAddress.isDefault">默认地址</span>  {{defaultAddress.addressName}}</span>
                <button class="change-button" @click="editAddress">修改</button>
              </div>

              <span class="detail-info">收 货 人：<span class="info">{{defaultAddress && defaultAddress.name}}</span></span>
              <span class="detail-info">联系电话：<span class="info">{{defaultAddress && defaultAddress.phone}}</span></span>
              <span class="detail-info">收货地址：<span class="info">{{defaultAddress && defaultAddress.province && defaultAddress.province.name}} {{defaultAddress && defaultAddress.city && defaultAddress.city.name}} {{defaultAddress && defaultAddress.district && defaultAddress.district.name}} {{defaultAddress && defaultAddress.detail}}</span></span>
            </div>
            <div class="left" v-show="!showDefaultAddress">
              <edit-address ref="address"></edit-address>
            </div>
            <div class="right" v-if="showDefaultAddress">
              <span class="default-address" @click="changeAddress">切换地址</span>
              <button class="change-button" @click="showAddModal">新建地址</button>
            </div>
            <div class="right new-address" v-if="!showDefaultAddress">
              <div >
                <div class="new-address-right" @click="setIsChecked">
                  <div class="check-box" :class="{'check-box-active': isChecked}">

                  </div>
                  <span>设为默认地址</span>
                </div>
                <button class="btn btn-red btn-small" @click="addAddress">确认并保存</button>
                <button class="btn btn-grey btn-small" v-if="addressList && addressList.length" @click="cancelAdd">取消</button>
              </div>
            </div>
          </div>
        </div>

        <div class="product-list">

          <table class="table-head" >
            <thead>
              <tr>
                <th class="first" width="600"><span class="img-part">商品清单<span class="name-part">商品名称</span></span></th>
                <th width="150"><span>单价</span></th>
                <th width="225"><span>数量</span></th>
                <th width="225"><span>小计</span></th>
              </tr>
            </thead>
          </table>
          <table class="table-body">
            <tbody>
              <tr v-for="(item, index) in orderDetail.goods">
                <td width="600" class="goods-title">
                  <div class="goods-img">
                    <img :src="item.imageCover" alt="">
                  </div>
                  <span class="product-name product-name-first">
                    <!-- <span class="pre-sale-tag" v-if="item.isPresale">预售</span> -->
                    <gz-tag backgroundColor="#fe8d00" v-if="item.isPresale">
                      <span slot="tag-text">预售</span>
                    </gz-tag>
                    <gz-tag backgroundColor="#555c78" v-if="item.isAbholung">
                      <span slot="tag-text">自提</span>
                    </gz-tag>
                    <gz-tag backgroundColor="#ff4544" v-if="item.itemType == 2">
                      <span slot="tag-text">赠品</span>
                    </gz-tag>
                    <div class="pre-sale" v-if="item.isPresale">
                      <gz-icon icon="info1" size="16"/></gz-icon>
                      预计 {{item.presaleTime}}发货
                    </div>
                    {{item.goodsName}}
                  </span>
                </td>
                <td width="150" class="goods-price"><span class="product-name" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥{{item.salePrice}}</span></td>
                <td class="goods-num" width="225"><span class="product-name">x{{item.goodsQuantity}}</span>
                  <!-- <span class="info" v-if="item.maxLimit">最多能购买{{item.maxLimit}}个</span> -->
                  <!-- <span class="info" v-if="item.minLimit && item.minLimit>1">最少购买{{item.minLimit}}个</span> -->
                </td>
                <td width="225"  class="price-state"><span class="product-name" style="font-family: Hiragino Sans GB, Microsoft Yahei;">¥{{Number(item.salePrice * item.goodsQuantity).toFixed(2)}}</span></td>
              </tr>
            </tbody>
          </table>

          <span class="order-remark">订单备注：</span>
          <input class="order-input" type="text" maxlength="45"  v-model="queryCondition.userMessage" placeholder="限45个字（请勿填写有关支付、收货、发票方面的信息）">
        </div>

        <div class="receiver-info coupons-content">
          <div class="coupons-type">
            <span :class="{'type-active' : !isAdd}" @click="isAdd = false">商品优惠券</span>
            <span :class="{'type-active' : isAdd}" v-if="false" @click="isAdd = true">优惠码兑换</span>
          </div>

          <div class="coupons-list" v-if="!isAdd && orderDetail.canUseCoupons && orderDetail.canUseCoupons.length">
            <div class="coupon-list-item" v-for="coupon in orderDetail.canUseCoupons">
              <coupon :type="2" :active="coupon.active" :couponinof="coupon" @showAngle="showAngle"></coupon>
            </div>
          </div>
          <div class="coupons-list" style="padding-bottom: 20px;font-size: 14px;" v-if="!isAdd && orderDetail.canUseCoupons && orderDetail.canUseCoupons.length == 0">
            无可用优惠券！
          </div>

          <div class="add-coupons" v-if="false">
            <span class="add-title">请输入优惠券兑换码：</span>
            <div class="add-content">
              <input type="text" name="" value="">
              <button type="button" name="button" class="btn btn-red btn-tiny">兑换</button>
            </div>
          </div>

          <div class="coupons-footer" v-if="orderDetail && orderDetail.canUseCoupons && orderDetail.canUseCoupons.length">
            金额抵用 <span class="active">￥{{usedCoupons.length ? (orderDetail.goodsTotalPrice <= usedCoupons[0].faceValue ? orderDetail.goodsTotalPrice : usedCoupons[0].faceValue) : 0}}</span>
          </div>
        </div>

        <div class="receiver-info receipt-info">
          <div class="title">
            发票信息
          </div>
          <div class="content">
            <div class="left" :class="{'no-border': isReceipt[0].active}">
              <div class="is-receipt">
                <span class="btn-border" :class="{'border-active':item.active}" @click="setReceipt(index, 'isReceipt')" v-for="(item,index) in isReceipt">{{item.name}}</span>
              </div>
              <div class="receipt-type" v-if="isReceipt[1].active">
                <div class="">
                  <div class="receipt">
                    <span class="required">*</span>
                    <span class="receipt-name">发票类型：</span>
                    <span class="btn-border" :class="{'border-active':item.active}" @click="setReceipt(index, 'receiptType')" v-for="(item,index) in receiptType">{{item.name}}</span>
                  </div>
                  <span class="info">纸质普通发票是税务局认可的有效凭证，其具有法律效力。</span>
                </div>
              </div>
              <div class="receipt receipt-tt" v-if="isReceipt[1].active">
                <span class="required">*</span>
                <span class="receipt-name">发票抬头：</span>
                <input class="receipt-input" type="text" name="" value="" v-model="queryCondition.InvoiceTitle" placeholder="个人">
              </div>
              <div class="receipt" v-if="isReceipt[1].active">
                <span class="required">*</span>
                <span class="receipt-name">发票内容：</span>
                <span class="btn-border" :class="{'border-active':item.active}" @click="setReceipt(index, 'receiptCategory')" v-for="(item,index) in receiptCategory">{{item.name}}</span>
              </div>
            </div>
            <div class="right" v-if="isReceipt[1].active">
              <p class="receipt-title">发票需知：</p>
              <p>1. 开票金额为用户实际支付的金额（不含礼品卡）</p>
              <p>2. 未随箱寄出的纸质发票会在发货后15-30个工作日单独寄出</p>
              <p>3. 单笔订单只支持开具纸质普通发票</p>
              <!-- <p>4. 单笔订单只支持开具一种类型的发票，如需增值专用发票请联系客服处理</p>
              <p>5. 年购订单发票随每期子单寄出</p> -->
            </div>
          </div>
        </div>

        <div class="total">
          <div class="left">
            <span class="span1">{{orderDetail.goodsTotalCount}}件商品    商品总金额：</span>
            <span class="span-11">折扣：</span>
            <span class="span1">优惠券金额：</span>
            <span class="span2">运费：</span>
            <span>应付总额：</span>
          </div>
          <div class="right">
            <span class="span1">￥{{Number(orderDetail.goodsTotalPrice).toFixed(2)}}</span>
            <span class="span-11">-￥{{Number(orderDetail.discountTotalAmount).toFixed(2)}}</span>
            <span class="span1">-￥{{Number(usedCoupons.length ? ((Number(orderDetail.orderPayment) - Number(orderDetail.shippingFee)) <= usedCoupons[0].faceValue ? (Number(orderDetail.orderPayment) - Number(orderDetail.shippingFee)) : usedCoupons[0].faceValue) : 0).toFixed(2)}}</span>
            <span class="span2">￥{{Number(orderDetail.shippingFee).toFixed(2)}}</span>
            <!-- {{(Number(orderDetail.orderPayment) - Number(usedCoupons.length ? usedCoupons[0].faceValue : 0)).toFixed(2)}} -->
            <span class="span3">￥{{usedCoupons.length ? ((Number(orderDetail.orderPayment) - Number(orderDetail.shippingFee)) <= usedCoupons[0].faceValue ? Number(orderDetail.shippingFee).toFixed(2) : (Number(orderDetail.orderPayment) - Number(usedCoupons[0].faceValue)).toFixed(2)) : Number(orderDetail.orderPayment).toFixed(2)}}</span>
          </div>
        </div>

        <div class="submit-order">
            <div class="left">
              <span v-if="(orderDetail && orderDetail.address && orderDetail.address.length)
                || (!isPickUp || (isPickUp && defaultAddress.province.name !== ''))">
                收货地址：
                {{defaultAddress.province.name}} {{defaultAddress.city.name}} {{defaultAddress.district.name}} {{defaultAddress.detail}}    收货人：{{defaultAddress.name}}{{defaultAddress.phone}}
              </span>
            </div>
            <div class="right">
              <nuxt-link to="/cart" class="line1">返回购物车  >></nuxt-link>
              <!-- :disabled="!showDefaultAddress || !enable" -->
              <button class="btn btn-red" @click="submitOrder()" :disabled="!showDefaultAddress || !enable" :class="{'disabled' : !showDefaultAddress || !enable}">提交订单</button>
            </div>
        </div>
      </div>
      <alert-modal ref="productAlertModal" @comfirm="comfirm" :showCancel="showCancel" @close="close">
        <div slot="modal-content">{{errMsg}}</div>
      </alert-modal>
  </div>
</template>

<script>
import moment from 'moment'
import Pay from '~components/biz/pay'
import PickUp from '~components/biz/pick-up/details'
import EditAddress from '~components/biz/address'
import AddressListModal from '~components/biz/address/address-list-modal'
import AlertModal from '~components/alert-modal'
import Coupon from '~components/biz/coupon/coupon-use.vue'
import Tag from '~components/biz/tag/tag'

export default {
  components: {
    [Pay.PayHeader.name]: Pay.PayHeader,
    [EditAddress.name]: EditAddress,
    [AlertModal.name]: AlertModal,
    [AddressListModal.name]: AddressListModal,
    Coupon,
    [PickUp.name]: PickUp,
    [Tag.name]: Tag
  },
  computed: {
    buyList () {
      return this.$store.state.order.buyList
    },
    addressList () {
      return this.$store.state.address.addressList
    }
  },
  data () {
    return {
      isPickUp: false,
      stepinfo: [{ name: '我的购物车', class: 'active' }, { name: '填写核对订单信息', class: 'active' }, { name: '成功提交订单' }],
      showReceiverInfo: false,
      showDefaultAddress: true,
      enable: true,
      usedCoupons: [],
      isAdd: false,
      errMsg: '',
      showCancel: false,
      isReceipt: [{
        name: '不开发票',
        active: true,
        value: 0
      }, {
        name: '开发票',
        active: false,
        value: 1
      }],
      receiptType: [{
        name: '纸质普通发票',
        active: true,
        value: 1
      }
      // {
      //   name: '增值税发票',
      //   active: false,
      //   value: 2
      // }
      ],
      orderInfo: {},
      receiptCategory: [
        // {
        //   name: '食品',
        //   value: 1,
        //   active: true
        // },
        {
          name: '明细',
          value: 2,
          active: true
        }
      // {
      //   name: '酒/饮料',
      //   active: false
      // }, {
      //   name: '日用品',
      //   active: false
      // }
      ],
      queryCondition: {
        goodsLists: [],
        addressId: 0,
        userMessage: '',
        paymentType: 1,
        returnUrl: '',
        platformType: 1,
        orderType: 1,
        receiveInfoName: '',
        // receiveInfoPhone: '',
        receiveInfoTelephone: '',
        receiveInfoDetail: '',
        Sn: '',
        ProvinceCode: '',
        CityCode: '',
        orderPayment: '',
        DistrictCode: '',
        usedCoupons: [],
        InvoiceType: 0,
        InvoiceTitle: '',
        InvoiceContent: 0,
        ForceCreateOrder: false
      },
      showAlertModelType: 1,
      isChecked: true,
      defaultAddress: {
        province: {},
        city: {},
        district: {}
      },
      goodsList: [],
      orderDetail: {},
      alertType: 1
    }
  },
  mounted () {
    const goodsCache = JSON.parse(global.localStorage.getItem(this.$route.query.key))
    if (!goodsCache) {
      this.$router.go(-1)
      return
    }
    this.$store.dispatch('order/clearGoods', goodsCache).then((data) => {
      let isDefault = false
      if (data.canUseCoupons.length) {
        data.canUseCoupons.forEach((coupon) => {
          coupon.active = false
        })
        data.canUseCoupons[0].active = true
      }
      if (data.address.length) {
        data.address.forEach((address) => {
          if (address.isDefault) {
            isDefault = true
            this.$set(this, 'defaultAddress', Object.assign({}, address))
            this.setQueryConditionAddress(address)
          }
        })
        if (!isDefault) {
          this.$set(this, 'defaultAddress', Object.assign({}, data.address[0]))
          this.setQueryConditionAddress(data.address[0])
        }
        if (!data.goods[0].isAbholung) {
          this.showDefaultAddress = true
        } else {
          this.showDefaultAddress = false
        }
        this.showReceiverInfo = true //  避免页面闪烁
      } else {
        this.showReceiverInfo = true //  避免页面闪烁
        this.showDefaultAddress = false
      }

      if (data.resultMessage && data.resultMessage.length) {
        const temp = []
        data.resultMessage.forEach((item) => {
          temp.push(item.message)
        })
        this.$store.commit('common/setMessage', temp.join(';'))
      }
      this.$set(this.queryCondition, 'Sn', data.sn)
      this.$set(this, 'orderDetail', Object.assign({}, data))
      this.orderDetail.goods.forEach((good) => {
        if (good.isAbholung) {
          this.$set(this, 'isPickUp', true)
        }
        good.presaleTime = moment(good.presaleTime).format('MM月DD日')
      })
      this.orderDetail.orderPayment = (Number(this.orderDetail.goodsTotalPrice) + Number(this.orderDetail.shippingFee) - Number(this.orderDetail.discountTotalAmount)).toFixed(2)
      this.queryCondition.orderPayment = this.orderDetail.orderPayment
      this.$set(this.queryCondition, 'goodsLists', data.goods.map(item => Object.assign({}, item)))
      this.$set(this, 'usedCoupons', data.usedCoupons)
      this.$set(this.queryCondition, 'usedCoupons', data.usedCoupons)
    }).catch((err) => {
      this.$store.commit('common/setMessage', err.msg)
    })
    this.$store.commit('common/setShowMainHeader', false)
    this.$store.commit('common/setShowNavigation', false)
    this.$store.commit('common/setBreadCrumbVisibility', false)
    this.$store.dispatch('address/getAddressList').then((data) => {
      if (data.length && data[0].city && !data[0].city.code) {
        this.$store.commit('common/setMessage', '您的收货地址不完整，请先完善地址信息')
        this.enable = false
      }
    })
  },
  methods: {
    setDefaultAddress (pickup) {
      if (!pickup.name) {
        this.$set(this, 'showDefaultAddress', false)
        this.$set(this.defaultAddress.province, 'name', '')
        this.$set(this.defaultAddress.city, 'name', '')
        this.$set(this.defaultAddress.district, 'name', '')
        this.$set(this.defaultAddress, 'detail', '')
        this.$set(this.defaultAddress, 'name', '')
        this.$set(this.defaultAddress, 'phone', '')
        return
      }
      this.$set(this, 'showDefaultAddress', true)
      this.$set(this.defaultAddress.province, 'name', pickup.provinceName)
      this.$set(this.defaultAddress.city, 'name', pickup.cityName)
      this.$set(this.defaultAddress.district, 'name', pickup.districtName)
      this.$set(this.defaultAddress, 'detail', pickup.detail)
      this.$set(this.defaultAddress, 'name', pickup.name)
      this.$set(this.defaultAddress, 'phone', pickup.phone)
    },
    setQueryConditionAddress (address) {
      this.$set(this.queryCondition, 'addressId', address.id)
      this.$set(this.queryCondition, 'receiveInfoName', address.name)
      // this.$set(this.queryCondition, 'receiveInfoPhone', address.phone)
      this.$set(this.queryCondition, 'receiveInfoTelephone', address.phone)
      this.$set(this.queryCondition, 'receiveInfoDetail', address.detail)
      this.$set(this.queryCondition, 'ProvinceCode', address.province.code)
      this.$set(this.queryCondition, 'CityCode', address.city.code)
      this.$set(this.queryCondition, 'DistrictCode', address.district.code)
    },
    showAngle (coupon) {
      this.enable = true
      this.orderDetail.canUseCoupons.forEach((item) => {
        if (item.couponCode === coupon.couponCode) {
          if (item.active) {
            item.active = false
            this.$set(this, 'usedCoupons', [])
            this.$set(this.queryCondition, 'usedCoupons', this.usedCoupons)
            return
          } else {
            item.active = true
          }
        }
        item.active = false
        if (item.couponCode === coupon.couponCode) {
          item.active = true
          this.$set(this, 'usedCoupons', [coupon])
          this.$set(this.queryCondition, 'usedCoupons', this.usedCoupons)
        }
      })
    },
    editAddress () {
      const item = this.defaultAddress
      const temp1 = this.$refs.address.address
      const temp2 = this.$refs.address.addressName
      this.$refs.address.address = this.defaultAddress
      this.$set(temp1, 'id', item.id)
      this.$set(temp1, 'name', item.name)
      this.$set(temp1, 'phone', item.phone)
      this.$set(temp1, 'contactPhone', item.contactPhone ? item.contactPhone : '')
      this.$set(temp1, 'detail', item.detail)
      this.$set(temp1, 'addressName', item.addressName)
      this.$set(temp1, 'isDefault', item.isDefault)
      this.$set(temp1, 'provinceCode', item.province.code)
      this.$set(temp1, 'cityCode', item.city.code)
      this.$set(temp1, 'districtCode', item.district.code)
      this.$set(temp2, 'provinceName', item.province.name)
      this.$set(temp2, 'cityName', item.city.name)
      this.$set(temp2, 'reginName', item.district.name)
      this.$refs.address.address = Object.assign({}, temp1)
      this.$refs.address.addressName = Object.assign({}, temp2)
      this.$refs.address.setEditAdress()
      this.showDefaultAddress = false
    },
    showAddModal () {
      this.$refs.address.clearEditInfo()
      if (this.addressList.length >= 10) {
        this.$store.commit('common/setMessage', '您的收货地址已达10个，无法新增')
      } else {
        this.showDefaultAddress = false
      }
    },
    setReceipt (index, type) {
      for (let i = 0; i < this[type].length; i += 1) {
        this.$set(this[type][i], 'active', false)
      }
      this.$set(this[type][index], 'active', true)
      if (type === 'isReceipt') {
        if (index === 0) {
          this.queryCondition.InvoiceType = 0
          this.queryCondition.InvoiceContent = 0
          this.queryCondition.InvoiceTitle = ''
        } else {
          this.queryCondition.InvoiceType = this.receiptType[0].active ? 1 : 2
          this.receiptCategory.forEach((item) => {
            if (item.active) {
              this.queryCondition.InvoiceContent = item.value
            }
          })
        }
      } else if (type === 'receiptType') {
        this.queryCondition.InvoiceType = this.receiptType[index].value
      } else if (type === 'receiptCategory') {
        this.queryCondition.InvoiceContent = this.receiptCategory[index].value
      }
    },
    setOneselfTakeAdress (data) {
      if (!data.id) return
      this.$set(this.queryCondition, 'addressId', data.id)
      this.$set(this.queryCondition, 'receiveInfoName', data.name)
      this.$set(this.queryCondition, 'receiveInfoTelephone', data.phone)
      this.$set(this.queryCondition, 'receiveInfoDetail', data.detail)
      this.$set(this.queryCondition, 'ProvinceCode', data.provinceCode)
      this.$set(this.queryCondition, 'CityCode', data.cityCode)
      this.$set(this.queryCondition, 'DistrictCode', data.districtCode)
      if (!this.showDefaultAddress) {
        this.$set(this, 'showDefaultAddress', true)
      }
    },
    getSelectedItem (item) {
      this.enable = true
      this.$set(this, 'defaultAddress', item)
      this.$set(this.queryCondition, 'addressId', item.id)
      this.$set(this.queryCondition, 'receiveInfoName', item.name)
      // this.$set(this.queryCondition, 'receiveInfoPhone', address.phone)
      this.$set(this.queryCondition, 'receiveInfoTelephone', item.phone)
      this.$set(this.queryCondition, 'receiveInfoDetail', item.detail)
      this.$set(this.queryCondition, 'ProvinceCode', item.province.code)
      this.$set(this.queryCondition, 'CityCode', item.city.code)
      this.$set(this.queryCondition, 'DistrictCode', item.district.code)
      this.$store.dispatch('order/getOrderFreight', {
        goods: this.orderDetail.goods,
        platformType: 1,
        sn: this.queryCondition.Sn,
        provinceCode: item.province.code,
        cityCode: item.city.code
      }).then((data) => {
        // this.$set(this.orderDetail, 'goodsTotalPrice', (Number(this.orderDetail.goodsTotalPrice) - Number(this.orderDetail.shippingFee) + Number(data.freight)).toFixed(2))
        this.$set(this.orderDetail, 'shippingFee', data.freight)
        this.$set(this.orderDetail, 'orderPayment', (Number(data.freight) + Number(this.orderDetail.goodsTotalPrice) - Number(this.orderDetail.discountTotalAmount)).toFixed(2))
        this.queryCondition.orderPayment = this.orderDetail.orderPayment
      })
    },
    setIsChecked () {
      this.$set(this, 'isChecked', !this.isChecked)
    },
    addAddress () {
      const valid = this.$refs.address.validate()
      if (!valid) {
        return
      }
      let temp = this.$refs.address.getSelect()
      const tempWay = this.$refs.address.address.id ? 'address/editAddress' : 'address/createAddress'
      temp.queryCondition.isDefault = this.orderDetail.address.length ? this.isChecked : true
      this.$store.dispatch(tempWay, temp.queryCondition).then((data) => {
        this.$store.dispatch('address/getAddressList')
        if (!data.msg) {
          this.$set(this.queryCondition, 'addressId', data)
        }
        this.$set(this.queryCondition, 'receiveInfoName', temp.queryCondition.name)
        // this.$set(this.queryCondition, 'receiveInfoPhone', address.phone)
        this.$set(this.queryCondition, 'receiveInfoTelephone', temp.queryCondition.phone)
        this.$set(this.queryCondition, 'receiveInfoDetail', temp.queryCondition.detail)
        this.$set(this.queryCondition, 'ProvinceCode', temp.queryCondition.provinceCode)
        this.$set(this.queryCondition, 'CityCode', temp.queryCondition.cityCode)
        this.$set(this.queryCondition, 'DistrictCode', temp.queryCondition.districtCode)
        if (!this.orderDetail.address.length) {
          this.defaultAddress = temp.displayInfo
          this.defaultAddress.id = this.queryCondition.addressId
          this.showDefaultAddress = true
        } else {
          // if (temp.queryCondition.isDefault) {
          this.defaultAddress = temp.displayInfo
          this.defaultAddress.id = tempWay === 'address/createAddress' ? data : temp.queryCondition.id
          // }
          this.showDefaultAddress = true
        }
        this.enable = true
        this.$store.dispatch('order/getOrderFreight', {
          goods: this.orderDetail.goods,
          platformType: 1,
          sn: this.queryCondition.Sn,
          provinceCode: temp.queryCondition.provinceCode,
          cityCode: temp.queryCondition.cityCode
        }).then((data) => {
          // this.$set(this.orderDetail, 'goodsTotalPrice', (Number(this.orderDetail.goodsTotalPrice) - Number(this.orderDetail.shippingFee) + Number(data.freight)).toFixed(2))
          this.$set(this.orderDetail, 'shippingFee', data.freight)
          this.$set(this.orderDetail, 'orderPayment', (Number(data.freight) + Number(this.orderDetail.goodsTotalPrice) - Number(this.orderDetail.discountTotalAmount)).toFixed(2))
          this.queryCondition.orderPayment = this.orderDetail.orderPayment
        })
      })
    },
    cancelAdd () {
      if (this.addressList.length) {
        this.showDefaultAddress = true
      }
    },
    comfirm () {
      this.$refs.productAlertModal.hide()
      if (this.alertType === 1) {
        if (this.showAlertModelType === 2) {
          if (Number(this.orderInfo.paymentAmount) === 0) {
            this.$router.push({
              path: '/pay/success',
              query: {
                sn: this.orderInfo.orderSn,
                payment: this.orderInfo.paymentAmount
              }
            })
          } else {
            this.$router.push({
              path: '/pay/wechat',
              query: {
                sn: this.orderInfo.orderSn
              }
            })
          }
        } else {
          this.$router.go(-1)
        }
      } else {
        this.submitOrder(true)
      }
    },
    close () {
      this.$router.go(-1)
    },
    submitOrder (type) {
      if (this.queryCondition.InvoiceType === 1 && this.queryCondition.InvoiceTitle.trim() === '') {
        this.$store.commit('common/setMessage', '请填写发票抬头')
        return
      }
      if (!this.queryCondition.addressId) {
        this.$store.commit('common/setMessage', '地址不能为空')
        return
      }
      this.queryCondition.usedCoupons = this.usedCoupons
      if (this.usedCoupons.length) {
        if (this.orderDetail.orderPayment - this.orderDetail.shippingFee <= this.usedCoupons[0].faceValue) {
          this.queryCondition.orderPayment = this.orderDetail.shippingFee
        } else {
          this.queryCondition.orderPayment = (Number(this.orderDetail.orderPayment) - Number(this.usedCoupons.length ? this.usedCoupons[0].faceValue : 0)).toFixed(2)
        }
      }
      this.queryCondition.ForceCreateOrder = type
      this.$store.dispatch('order/createOrder', this.queryCondition).then((data) => {
        if (data) {
          this.$store.dispatch('cart/getMergedCart')
          this.$store.commit('order/removeGoodsCache', this.$route.query.key)
          // if (data.resultMessage.length) {
          //   const temp = []
          //   data.resultMessage.forEach((item) => {
          //     temp.push(item.message)
          //   })
          //   this.errMsg = temp
          //   this.showCancel = false
          //   this.$refs.productAlertModal.showModal()
          //   this.orderInfo = data
          //   this.showAlertModelType = 2
          //   return
          // }
          if (Number(data.paymentAmount) === 0) {
            this.$router.push({
              path: '/pay/success',
              query: {
                sn: data.orderSn,
                payment: data.paymentAmount,
                orderId: data.orderId
              }
            })
          } else {
            this.$router.push({
              path: '/pay/wechat',
              query: {
                sn: data.orderSn
              }
            })
          }
        }
      }).catch((err) => {
        if (err.code === '1005') {
          this.enable = false
        }
        if (err.code === '1021') {
          this.errMsg = err.msg
          this.showErrMsgType = 1
          this.showCancel = true
          this.alertType = 2
          this.$refs.productAlertModal.showModal()
        }
        if (err.code === '12014') {
          this.errMsg = err.msg
          this.showCancel = false
          this.alertType = 1
          this.$refs.productAlertModal.showModal()
        } else if (err.code === '12017') {
          this.$store.commit('common/setMessage', err.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 3000)
        } else if (err.code !== '1021') {
          this.$store.commit('common/setMessage', err.msg)
        }
      })
    },
    changeAddress () {
      this.$refs.addressList.showModal()
    }
  },
  destroyed () {
    this.$store.commit('address/saveAdressIndex', 0)
  },
  beforeRouteLeave (to, from, next) {
    // this.$store.commit('order/removeGoodsCache', this.$route.query.key)
    next()
  }
}
</script>

<style lang="less">
.create-order {
  .pre-sale{
    background: rgba(255, 69, 68, 0.1);
    font-size: 14px;
    height: 28px;

    // width: 130px;
    margin-top: 16px;
    line-height: 28px;
    // text-align: center;
    color: #ff4544;
    .gz-icon{
      background: #ff4544;
      border-radius: 16px;
      color: #fff;
      padding: 3px;
      margin: 0 10px;
    }
  }
  .pre-sale-tag{
    background: #ff8d00;
    margin-right: 10px;
    display: inline !important;
    color: white !important;
    margin-left: 0 !important;
    padding: 3px;
  }
  .is-gift-good{
    background-color: #ff4544;
    margin-right: 10px;
    font-size: 12px;
    display: inline !important;
    color: white !important;
    margin-left: 0 !important;
    padding: 3px;
  }
  .btn{
    width: 210px;
    height: 62px;
    color: white;
    outline: none;
    cursor: pointer;
    border: none;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.5;
    color: #ffffff;
  }
  .disabled {
    background-color: #908888 !important;
  }
  .btn-small{
    width: 120px;
    height: 46px;
    font-size: 14px;
    font-weight: 300;
  }
  .btn-tiny{
    width: 100px;
    height: 36px;
    font-weight: 300;
    font-size: 14px;
  }
  .btn-red{
    background-color: #ff4544;
  }
  .btn-grey{
    background-color: #908888;
    margin-left: 30px;
  }
  .test-notify{
    width: 60%;
    background: red;
    }
    .border-active{
      border: solid 2px #ff4544 !important;
      background-position: 100% 100%;
      background-image: url('~assets/img/trangleRight.png');
      background-repeat: no-repeat;
    }
    .no-border{
      border-right: none !important;
    }
    .change-button {
        margin-left: 50px;
        height: 30px;
        background-color: #ffffff;
        border: solid 1px #b7a078;
        font-size: 14px;
        text-align: center;
        color: #b7a078;
        padding: 0 16px;
        outline: none;
        box-sizing: border-box;
    }
    .create-order-content {
        width: 1200px;
        margin: 0 auto;
        .title {
            height: 42px;
            background: #f4f4f4;
            font-size: 16px;
            font-weight: 600;
            color: #444444;
            box-sizing: border-box;
            padding-left: 20px;
            line-height: 42px;
        }
        .coupons-content{
          .coupons-type{
            padding-top: 20px;
            padding-left: 20px;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            span{
              margin-right: 50px;
              cursor: pointer;
            }
            .type-active{
              color: #ff4544;
              border-bottom: 3px solid #ff4544;
            }
          }
          .active{
            color: #ff4544;
          }
          .coupons-list{
            padding: 0 20px;
            margin-top: 24px;
            overflow: auto;
            max-height: 420px;
            .coupon-list-item{
              margin-bottom: 30px;
              float: left;
              margin-right: 30px;
            }
          }
          .add-coupons{
            margin-top: 36px;
            .add-title{
              font-size: 14px;
              color: #333333;
              display: block;
              margin-left: 21px;
            }
            .add-content{
              margin-left: 20px;
              margin-top: 9px;
              margin-bottom: 39px;
              input{
                width: 346px;
                height: 36px;
                border: solid 1px #979797;
                margin-right: 20px;
                padding-left: 11px;
                font-size: 14px;
                color: #333333;
              }
            }
          }
          .coupons-footer{
            height: 34px;
            background: #f4f4f4;
            padding-left: 20px;
            margin-top: 16px;
            line-height: 34px;
            font-size: 14px;
            font-weight: 600;
            color: #666666;
            clear: both;
          }
        }
        .receiver-info {
            width: 100%;
            margin-top: 37px;
            border: 1px solid #f4f4f4;

            .content {
                margin-top: 26px;
                display: flex;
                padding-bottom: 30px;
                box-sizing: border-box;
                margin-left: 20px;
                .left {
                    border-right: 1px solid #f4f4f4;
                    box-sizing: border-box;
                    width: 700px;
                    // padding-right: 204px;
                    .address {
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;
                        .gz-icon{
                          color: #b7a078;
                          margin-right: 13px;
                        }
                        .default-address {
                            font-size: 14px;
                            font-weight: 600;
                            color: #b7a078;
                            cursor: pointer;
                        }

                    }

                    .detail-info {
                        display: block;
                        font-size: 14px;
                        letter-spacing: 4.5px;
                        text-align: justify;
                        color: #999999;
                        margin-bottom: 10px;
                        .info {
                            font-size: 14px;
                            font-weight: 600;
                            letter-spacing: 0;
                            color: #333333;
                        }
                    }
                }
                .new-address{
                  display: flex;
                  align-items: center;
                  padding-left: 45px;
                  cursor: pointer;
                  .check-box-active{
                    border: 0 !important;
                    background: url('~assets/img/checkbox-checked.png')
                  }
                  .check-box{
                    width: 14px;
                    height: 14px;
                    border: 1px solid #f4f4f4;
                    box-sizing: border-box;
                    margin-right: 10px;

                  }
                  &-right{
                    font-size: 14px;
                    color: #666666;
                    font-weight: 300;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                  }
                }
                .right {
                    span.default-address {
                        margin-top: 49px;
                        display: block;
                        margin-left: 57px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        color: #b7a078;
                        margin-bottom: 20px;
                    }

                }
            }
        }


        .product-list{
          width: 1200px;
          margin: 0 auto;
          margin-top: 37px;
          border: 1px solid #f4f4f4;
          table.table-head{
            width: 100%;
           background: #f4f4f4;
            thead{
              width: 100%;
              background: #f4f4f4;
              th{
                .img-part{
                  font-size: 16px;
                  font-weight: 600;
                  color: #333333;
                  .name-part{
                    font-size: 14px;
                    color: #999999;
                    font-weight: 300;
                    margin-left: 52px;
                  }
                }

                height: 36px;
                font-size: 14px;
                color: #999999;
                font-weight: 300;
                text-align: left;
              }
              th.first{
                text-align: left;
                span{
                    margin-left: 20px;
                }
              }
            }
          }
          table.table-body{
            text-align: left;
            tbody{
              vertical-align: top;
            }
            tr td{
              margin-top: 30px;
            }
            span.product-name{
              display: block;
              margin-top: 30px;
              text-align: left;
              font-size: 14px;
              color: #333333;
              font-weight: 300;
            }
            .product-name-first{
              margin-left: 43px;width: 354px;margin-top:0 !important;
            }
            .goods-title{
              display: flex;
              // align-items: center;
              text-align: left;
              .goods-img{
                width: 76px;
                height: 76px;
                margin-left: 20px;
              }
            }
            .goods-num{
              .info{
                display: block;
                font-size: 12px;
                text-align: left;
                color: #b7a078;
                display: block;
                width: 160px;
                margin-top: 6px;
              }
            }
            .price-state{
              span{
                color: #ff4544;
                font-weight: 600;
              }
            }
            td{
              height: 135px;
              text-align: left;
            }
          }


          .order-remark{
            font-size: 14px;
            color: #333333;
            display: block;
            margin-left: 20px;
          }
          .order-input{
            width: 456px;
            height: 30px;
            margin-top: 10px;
            margin-left: 20px;
            margin-bottom: 30px;
            font-size: 12px;
            padding-left: 11px;
            border: solid 1px #dddddd;
          }
        }

        .receipt-info{
          width: 100%;
          margin-top: 40px;
          border-bottom: 1px solid #f4f4f4;
          .btn-border{
            padding: 0 17px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: solid 1px #dddddd;
            font-size: 14px;
            color: #999999;
            display: inline-block;
            margin-right: 20px;
            cursor: pointer;

          }
          .content{
            .left{
              padding-right: 38px;
              .is-receipt{

              }
              .receipt-name{
                font-size: 14px;
                color: #333333;
                font-weight: 300;
              }
              .receipt-input{
                width: 329px;
                height: 30px;
                background-color: #ffffff;
                border: solid 1px #dddddd;
                padding-left: 15px;
                font-size: 14px;
              }
              .required{
                width: 8px;
                color: #ff4544;
              }
              .receipt-tt{
                margin-bottom: 22px;
              }
              .receipt{
                display: flex;
                align-items: center;
              }
              .receipt-type{
                display: flex;
                align-items: center;
                margin-top: 20px;


                .info{
                  margin-top: 8px;
                  margin-bottom: 19px;
                  font-size: 14px;
                  display: block;
                  color: #999999;
                  margin-left: 74px;
                }
              }
            }

            .right{
              box-sizing: border-box;
              padding-left: 34px;
              .receipt-title{
                  margin-top: 28px;
                  margin-bottom: 20px;
                  color: #333333;
                  font-size: 14px;
                  line-height: 1.57;
              }
              p{
                color: #999999;
                font-size: 14px;
                line-height: 1.57;
              }
            }
          }
        }

        .total{
          display: flex;
          justify-content: flex-end;
          margin-top: 71px;
          .right{
            // width: 100px;
          }
          .left{

          }
          .span1{
            margin-bottom: 15px;
          }
          .span-11{
            margin-bottom: 11px;
          }
          .span2{
            margin-bottom: 30px;
          }
          .span3{
            font-size: 22px;
            font-weight: 600;
            color: #ff4544;
          }
          span{
            display: block;
            font-size: 14px;
            color: #333333;
            text-align: right;
            display: block;
            height: 22px;
            line-height: 22px;
          }
        }

        .submit-order{
          width: 100%;
          margin-top: 35px;
          height: 62px;
          background: #f4f4f4;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 79px;
          .left{
            font-size: 14px;
            color: #333333;
            margin-left: 91px;
            max-width: 700px;
          }
          .right{
            font-size: 14px;
            font-weight: 300;
            box-sizing: border-box;

            color: #ff4544;
            a {
              color: #ff4544;
            }
            a:hover{
              text-decoration: none;
            }
            .line1{
              margin-right: 46px;
              cursor: pointer;
            }

          }
        }
    }
}
</style>
