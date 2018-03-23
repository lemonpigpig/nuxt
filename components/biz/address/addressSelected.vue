<template lang="html">
    <div id="addressSelected">
        <div class="selected-part" @mouseleave="hideChoice('province')">
          <div class="item-top" @click="showChoice('province')">
                <input
                type="text"
                placeholder="请选择"
                readonly="readonly"
                v-model="province"
              >
                <i><img src="../../../assets/img/Group55.png"></i>
            </div>
            <div class="item-option" v-show="isProvinceShow">
                <ul>
                    <li v-for="(item, index) in addressBasicData" @click="provinceChange(item)">
                      {{item.name}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="selected-part" @mouseleave="hideChoice('city')">
            <div class="item-top" @click="showChoice('city')">
                <input
                type="text"
                placeholder="请选择"
                readonly="readonly"
                v-model="city"

              >
                <i><img src="../../../assets/img/Group55.png"></i>
            </div>
            <div class="item-option" v-show="isCityShow">
                <ul>
                    <li v-for="(item, index) in cityList" @click="cityChange(item)">
                      {{item.name}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="selected-part">
            <div class="item-top" @click="showChoice('regin')">
                <input
                type="text"
                placeholder="请选择"
                readonly="readonly"
                v-model="regin"
              >
                <i><img src="../../../assets/img/Group55.png"></i>
            </div>
            <div class="item-option" v-show="isReginShow">
                <ul>
                    <li v-for="(item, index) in reginList" @click="reginChange(item)">
                      {{item.name}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {
  data () {
    return {
      province: '',
      city: '',
      regin: '',
      provinceList: [],
      cityList: [],
      reginList: [],
      isProvinceShow: false,
      isCityShow: false,
      isReginShow: false,
      addressBasicData: [],
      selectedProvinceInfo: {},
      selectedCityInfo: {},
      code: '',
      name: '',
      flag: 0,
      selectedProvince: '',
      selectedCityName: ''
    }
  },
  computed: {
  },
  methods: {
    hideChoice (type) {
      if (type === 'province') {
        this.$set(this, 'isProvinceShow', false)
      } else if (type === 'city') {
        this.$set(this, 'isCityShow', false)
      } else {
        this.$set(this, 'isReginShow', false)
      }
    },
    showChoice (type) {
      if (type === 'province') {
        this.$set(this, 'isProvinceShow', !this.isProvinceShow)
      } else if (type === 'city') {
        this.$set(this, 'isCityShow', !this.isCityShow)
      } else {
        this.$set(this, 'isReginShow', !this.isReginShow)
      }
    },
    getBasicHandler () {
      this.$store.dispatch('address/getAddressBasicData').then((res) => {
        this.$set(this, 'addressBasicData', cloneDeep(res.data))
        if (this.flag) {
          this.setEditInfo()
        }
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    },
    provinceChange (item) {
      if (item.name) {
        this.$set(this, 'cityList', item.subRegionList)
        this.$set(this, 'province', item.name)
        this.$set(this, 'code', item.code)
        this.$set(this, 'city', '')
        this.$set(this, 'regin', '')
        this.$set(this, 'isProvinceShow', false)
        const query = {
          selectedtype: 'province',
          selectedName: this.province,
          selectedCode: this.code
        }
        this.$emit('sendSelectedAddress', query)
      }
    },
    cityChange (item) {
      if (item.name) {
        this.$set(this, 'reginList', item.subRegionList)
        this.$set(this, 'city', item.name)
        this.$set(this, 'code', item.code)
        this.$set(this, 'isCityShow', false)
        this.$set(this, 'regin', '')
        const query = {
          selectedtype: 'city',
          selectedName: this.city,
          selectedCode: this.code
        }
        this.$emit('sendSelectedAddress', query)
      }
    },
    reginChange (item) {
      if (item.name) {
        this.$set(this, 'regin', item.name)
        this.$set(this, 'code', item.code)
        this.$set(this, 'isReginShow', false)
        const query = {
          selectedtype: 'regin',
          selectedName: this.regin,
          selectedCode: this.code
        }
        this.$emit('sendSelectedAddress', query)
      }
    },
    setEditInfo () {
      const tempCity = this.addressBasicData.find(item => item.name === this.selectedProvince).subRegionList
      this.$set(this, 'cityList', cloneDeep(tempCity))
      this.$set(this, 'reginList', tempCity.find(item => item.name === this.selectedCityName).subRegionList)
    },
    setEditAdress (provinceName, cityName) {
      this.$set(this, 'selectedProvince', provinceName)
      this.$set(this, 'selectedCityName', cityName)
      if (this.addressBasicData.length) {
        this.setEditInfo()
      } else {
        this.$set(this, 'flag', 1)
      }
    }
  },
  mounted () {
    this.getBasicHandler()
  }
}
</script>

<style lang="less">
#addressSelected {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  .selected-part {
      float: left;
      margin-right: 18px;
      width: 120px;
      font-size: 14px;
      .item-top {
          padding-left: 18px;
          padding-right: 16px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          line-height: 24px;
          height: 30px;
          input {
            width: 72px;
            height: 28px;
            cursor: pointer;
          }
          i {
            float: right;
          }
      }
      .item-option {
          max-height: 300px;
          overflow-y: scroll;
          transition: height 2s;
          -webkit-transition: height 2s;
          position: absolute;
          z-index: 99;
          ul {
            border: 1px soid #ddd;
            border-top: none;
            li {
              font-size: 12px;
              padding-left: 18px;
              width: 120px;
              line-height: 30px;
              cursor: pointer;
              // border-bottom: 1px solid #eee;
              background: #fff;
            }
            li:hover {
              background: #549bff;
              color: white;
            }
          }
      }
   }
}
</style>
