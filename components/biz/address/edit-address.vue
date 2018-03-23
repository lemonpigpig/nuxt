<template lang="html">
  <div class="edit-address-components">
    <div class="section">
      <div class="section-title" style="letter-spacing: 4.5px">收货人：</div>
      <div class="input"><input v-model="address.name" @blur="checkName"/></div>
    </div>
    <p class="errMsg"><span>{{nameErrMsg}}</span></p>
    <div class="section">
      <div class="section-title">收货地址</div>
      <addressSelected ref="areaCode" @sendSelectedAddress="getSelectInfo"></addressSelected>
    </div>
    <p class="errMsg"><span>{{addressErrMsg}}</span></p>
    <div class="section">
      <div class="section-title" @click="checkAdress">详细地址：</div>
      <div class="input">
        <textarea
          v-model="address.detail"
          :class={disabledText:!detailValid}
          placeholder="建议您如实填写详细收货地址，例如街道名称，门牌号码，楼层和房间号等信息"
          @blur="checkDetail"
        /></div>
    </div>
    <p class="errMsg"><span>{{detailErrMsg}}</span></p>
    <div class="section">
      <div class="section-title">手机号码：</div>
      <div class="input"><input style="width: 150px"  v-model="address.phone" @blur="checkPhone"/></div>
      <div class="section-title" style="margin-left:5px;">固定电话：</div>
      <div class="input"><input style="width: 150px" v-model="address.contactPhone"/></div>
    </div>
    <p class="errMsg"><span>{{phoneErrMsg}}</span></p>
    <div class="section">
      <div class="section-title">地址别名：</div>
      <div class="input"><input style="width: 150px"  v-model="address.addressName"></div>
      <div class="section-description">建议填写常用名称<span class="frequent-word" @click="setFrequent('家里')">家里</span><span  class="frequent-word" @click="setFrequent('公司')">公司</span></div>
    </div>
  </div>
</template>

<script>
import addressSelected from '~components/biz/address/addressSelected'

export default {
  name: 'edit-address',
  computed: {
    nameValid () {
      return (
        /^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(this.address.name) &&
        this.address.name.replace(/[\u4e00-\u9fa5]/g, 'aa').length <= 20
      )
    },
    addressValid () {
      return (
        !!this.addressName.provinceName &&
        !!this.addressName.cityName &&
        !!this.addressName.reginName
      )
    },
    detailValid () {
      return this.address.detail.length > 0 && this.address.detail.length < 200
    },
    phoneValid () {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0-9])\d{8}$/
      return reg.test(this.address.phone)
    }
  },
  methods: {
    setFrequent (item) {
      this.address.addressName = item
    },
    clearEditInfo () {
      this.$set(this.address, 'id', '')
      this.$set(this.address, 'name', '')
      this.$set(this.address, 'phone', '')
      this.$set(this.address, 'contactPhone', '')
      this.$set(this.address, 'detail', '')
      this.$set(this.address, 'addressName', '')
      this.$set(this.address, 'isDefault', '')
      this.$set(this.address, 'provinceCode', '')
      this.$set(this.address, 'cityCode', '')
      this.$set(this.address, 'districtCode', '')
      this.$set(this.addressName, 'provinceName', '')
      this.$set(this.addressName, 'cityName', '')
      this.$set(this.addressName, 'reginName', '')
      this.$refs.areaCode.province = ''
      this.$refs.areaCode.city = ''
      this.$refs.areaCode.regin = ''
      this.$refs.areaCode.provinceList = []
      this.$refs.areaCode.cityList = []
      this.$refs.areaCode.reginList = []
    },
    checkName () {
      this.$set(this, 'nameErrMsg', !this.nameValid ? '请输入正确的姓名, 长度为1-20个字符' : '')
    },
    checkAdress () {
      this.$set(this, 'addressErrMsg', !this.addressValid ? '请选择正确地址' : '')
    },
    checkDetail () {
      this.$set(this, 'detailErrMsg', !this.detailValid ? '请输入正确地址' : '')
    },
    checkPhone () {
      this.$set(this, 'phoneErrMsg', !this.phoneValid ? '请输入正确手机号' : '')
    },
    setEditAdress () {
      this.$refs.areaCode.province = this.addressName.provinceName
      this.$refs.areaCode.city = this.addressName.cityName
      this.$refs.areaCode.regin = this.addressName.reginName
      this.$refs.areaCode.setEditAdress(this.addressName.provinceName, this.addressName.cityName)
    },
    getSelect () {
      return {
        queryCondition: this.address,
        displayInfo: {
          addressName: this.address.addressName,
          name: this.address.name,
          detail: this.address.detail,
          phone: this.address.phone,
          province: {
            name: this.addressName.provinceName,
            code: this.address.provinceCode
          },
          city: {
            name: this.addressName.cityName,
            code: this.address.cityCode
          },
          district: {
            name: this.addressName.reginName,
            code: this.address.districtCode
          }
        }
      }
    },
    getSelectInfo (item) {
      if (item.selectedtype === 'province') {
        this.$set(this.address, 'provinceCode', item.selectedCode)
        this.$set(this.addressName, 'provinceName', item.selectedName)
        this.$set(this.address, 'cityCode', '')
        this.$set(this.addressName, 'cityName', '')
        this.$set(this.address, 'districtCode', '')
        this.$set(this.addressName, 'reginName', '')
      } else if (item.selectedtype === 'city') {
        this.$set(this.address, 'cityCode', item.selectedCode)
        this.$set(this.addressName, 'cityName', item.selectedName)
        this.$set(this.address, 'districtCode', '')
        this.$set(this.addressName, 'reginName', '')
      } else {
        this.$set(this.address, 'districtCode', item.selectedCode)
        this.$set(this.addressName, 'reginName', item.selectedName)
        this.checkAdress()
      }
    },
    validate () {
      this.checkName()
      this.checkAdress()
      this.checkDetail()
      this.checkPhone()
      return !this.nameErrMsg && !this.addressErrMsg && !this.detailErrMsg && !this.phoneErrMsg
    }
  },
  data () {
    return {
      nameErrMsg: '',
      addressErrMsg: '',
      detailErrMsg: '',
      phoneErrMsg: '',
      address: {
        id: '',
        name: '',
        phone: '',
        contactPhone: '',
        provinceCode: null,
        cityCode: null,
        districtCode: null,
        detail: '',
        addressName: '',
        isDefault: false
      },
      addressName: {
        provinceName: '',
        cityName: '',
        reginName: ''
      }
    }
  },
  mounted () {
  },
  components: { addressSelected }
}
</script>

<style lang="less">
.edit-address-components{
  font-size: 14px;
  color: #333;
  .errMsg {
      padding-left: 81px;
      color: #ff4544;
      font-size: 12px;
      padding-bottom: 10px;
      height: 20px;
      line-height: 20px;
  }
  .section {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 10px;
    .section-title {
        width: 85px;
        font-size: 14px;
        text-align: left;
        color: #999999;
    }
    .input textarea {
        height: 60px;
        width: 407px;
        padding: 10px 20px;
        border: 1px solid #ddd;
    }
    .input .disabledText {
        background: #F5F5F5;
    }
    .input input {
      margin-right: 24px;
      padding-left: 20px;
      height: 30px;
      border: 1px solid #dddddd;
    }
    .section-description {
      color: #999999;
      span {
        cursor: pointer;
        font-size:14px;
        padding: 3px 7px;
        border: 1px solid #979797;
        margin-left: 12px;
      }
    }
  }
}
</style>
