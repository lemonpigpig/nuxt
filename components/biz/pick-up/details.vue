<template lang="html">
  <div class="pick-up">
    <div class="pick-up__info">
      <div class="info__title">收货信息</div>
      <div class="info__panel">
        <div class="info__sub-title">国资商城自提</div>
        <div class="info__tip fn-clear">
          <span class="ft-red">免运费</span>·无续重·随时取
          <span v-if="!hasPickUp" class="fn-right">选择自提点并下单—收到提货短信—到自提点自提</span>
        </div>
        <div @click="openModal" v-if="!hasPickUp" class="info__select"></div>
        <div class="info__address" v-if="hasPickUp">
          <div class="info__user">{{user}}   {{phone}}</div>
          <div>{{addressDetail}}</div>
        </div>
        <div class="info__update" v-if="hasPickUp" @click="updatePickUp">更换自提地址</div>
      </div>
    </div>
    <div class="pick-up__modal modal" v-show="showModal">
      <div class="modal__bg">
        <div class="modal__panel">
          <span @click="closeModal">
            <gz-icon icon="close" className="modal__close"></gz-icon>
          </span>
          <div class="modal__title">
            选择自提地址 <span class="modal__sub-title">（自提当前仅限云南省）</span>
          </div>
          <div class="modal__address fn-clear">
            <span class="fn-left">自提地址：</span>
            <addressSelected class="fn-left" ref="areaCode" @sendSelectedAddress="getAddress"></addressSelected>
          </div>
          <div class="modal__shop" ref="storeList">
            <ul>
              <li v-for="item in stores" @click="selectStore(item)">
                <span class="modal__radio"
                  :class="{'modal__radio--checked': item.isChecked}"><gz-icon
                                                                        v-show="item.isChecked"
                                                                        color="#fff"
                                                                        icon="check"></gz-icon></span>
                {{item.detail}}
              </li>
            </ul>
            <div v-show="showStores && stores.length == 0" class="modal__no-list">该地区暂未开通自提点，请选择其他地区</div>
          </div>
          <div class="fn-clear">
            <label class="modal__label fn-left">提 货 人：<input
                                                          class="modal__input"
                                                          v-model="user"
                                                          @keyup="verifiedUser"/>
              <div class="modal__error modal__error-user">{{hasInputUser ? (isVerifiedUser ? '' : '请正确输入提货人') : ''}}</div>
            </label>
            <label class="modal__label fn-right">手机号码：<input
                                                            class="modal__input"
                                                            v-model.number="phone"
                                                            @keyup="verifiedPhone"/>
              <div class="modal__error">{{hasInputPhone ? (isVerifiedPhone ? '' : '请正确输入手机号码') : ''}}</div>
            </label>
          </div>
          <div>
            <button class="modal__button"
                    @click="submitPickUpAddress"
                    :class="{'modal__button--disabled': !isVerified}"
                    :disabled="!isVerified">确认自提地址</button>
            <button class="modal__button modal__button--cancel" @click="closeModal">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import addressSelected from '~components/biz/address/addressSelected'

  export default {
    name: 'pick-up',
    components: { addressSelected },
    data () {
      return {
        hasPickUp: false,
        showModal: false,
        isVerified: false,
        isVerifiedUser: false,
        isVerifiedPhone: false,
        isVerifiedStore: false,
        hasInputPhone: false,
        hasInputUser: false,
        showStores: false,
        user: '',
        phone: '',
        addressDetail: '',
        address: {
          provinceName: '云南省',
          cityName: '昆明市',
          districtName: '官渡区',
          cityCode: '5301',
          districtCode: '530111',
          provinceCode: '53'
        },
        stores: [],
        storeId: '',
        selectedStoreData: {}
      }
    },
    watch: {
      addressDetail () {
        this.$emit('addressChange', this.selectedStoreData)
      }
    },
    methods: {
      updatePickUp () {
        this.getStore(() => {
          this.$set(this, 'showModal', true)
          this.$set(this, 'isVerifiedPhone', true)
          this.$set(this, 'isVerifiedUser', true)
          this.$set(this, 'hasInputPhone', true)
          this.$set(this, 'hasInputUser', true)
          this.$set(this, 'isVerified', true)
          this.$set(this, 'showStores', true)
          // set address
          this.$refs.areaCode.province = this.address.provinceName
          this.$refs.areaCode.city = this.address.cityName
          this.$refs.areaCode.regin = this.address.districtName
          this.$refs.areaCode.setEditAdress(this.address.provinceName, this.address.cityName, this.address.districtName)
          // set store
          this.$store.dispatch('account/getStores', this.address).then((res) => {
            this.$set(this, 'stores', res.data.map(data => {
              if (data.id === this.storeId) {
                return Object.assign({}, data, {
                  isChecked: true
                })
              } else {
                return Object.assign({}, data, {
                  isChecked: false
                })
              }
            }))
          }).catch((err) => {
            this.$store.commit('common/setMessage', err.msg || 'error')
          })
        })
      },
      submitPickUpAddress () {
        if (!this.isVerified) {
          return
        }
        let storeId = ''
        this.stores.forEach(data => {
          if (data.isChecked) {
            storeId = data.id
            this.$set(this, 'selectedStoreData', {
              name: this.user,
              phone: this.phone,
              ...data
            })
            this.addressDetail = data.detail
          }
        })
        if (this.hasPickUp) {
          this.$store.dispatch('account/updateStore', {
            storeId,
            name: this.user,
            phone: this.phone
          }).then((res) => {
            this.$set(this, 'hasPickUp', true)
            this.$set(this, 'showModal', false)
          }).catch((err) => {
            this.$store.commit('common/setMessage', err.msg || 'error')
          })
        } else {
          this.$store.dispatch('account/setStore', {
            storeId,
            name: this.user,
            phone: this.phone
          }).then((res) => {
            this.$set(this, 'hasPickUp', true)
            this.$set(this, 'showModal', false)
          }).catch((err) => {
            this.$store.commit('common/setMessage', err.msg || 'error')
          })
        }
        this.$emit('change', {
          cityName: this.address.cityName,
          provinceName: this.address.provinceName,
          detail: this.addressDetail,
          districtName: this.address.districtName,
          name: this.user,
          phone: this.phone
        })
      },
      verified () {
        if (this.isVerifiedUser && this.isVerifiedPhone && this.isVerifiedStore) {
          this.$set(this, 'isVerified', true)
        } else {
          this.$set(this, 'isVerified', false)
        }
      },
      selectStore (item) {
        this.$set(this, 'isVerifiedStore', true)
        this.$set(this, 'stores', this.stores.map(data => {
          if (data.id === item.id) {
            return Object.assign({}, data, {
              isChecked: true
            })
          } else {
            return Object.assign({}, data, {
              isChecked: false
            })
          }
        }))
        this.verified()
      },
      verifiedUser () {
        this.$set(this, 'hasInputUser', true)
        if (/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(this.user) &&
          this.user.replace(/[\u4e00-\u9fa5]/g, 'aa').length <= 20) {
          this.$set(this, 'isVerifiedUser', true)
        } else {
          this.$set(this, 'isVerifiedUser', false)
        }
        this.verified()
      },
      verifiedPhone () {
        this.$set(this, 'hasInputPhone', true)
        if (/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0-9])\d{8}$/.test(this.phone)) {
          this.$set(this, 'isVerifiedPhone', true)
        } else {
          this.$set(this, 'isVerifiedPhone', false)
        }
        this.verified()
      },
      openModal () {
        this.$set(this, 'showModal', true)
        // set address
        this.$refs.areaCode.province = this.address.provinceName
        this.$refs.areaCode.city = this.address.cityName
        this.$refs.areaCode.regin = this.address.districtName
        this.$refs.areaCode.setEditAdress(this.address.provinceName, this.address.cityName, this.address.districtName)

        // set store
        this.$store.dispatch('account/getStores', this.address).then((res) => {
          this.$set(this, 'stores', res.data.map(data => {
            if (data.id === this.storeId) {
              return Object.assign({}, data, {
                isChecked: true
              })
            } else {
              return Object.assign({}, data, {
                isChecked: false
              })
            }
          }))
        }).catch((err) => {
          this.$store.commit('common/setMessage', err.msg || 'error')
        })
      },
      closeModal () {
        this.$set(this, 'showModal', false)
      },
      getAddress (item) {
        this.$set(this, 'isVerifiedStore', false)
        this.verified()
        if (item.selectedtype === 'province') {
          this.$set(this.address, 'provinceCode', item.selectedCode)
          this.$set(this.address, 'cityCode', '')
          this.$set(this.address, 'districtCode', '')
          this.$set(this.address, 'provinceName', item.selectedName)
          this.$set(this.address, 'cityName', '')
          this.$set(this.address, 'districtName', '')
          this.$set(this, 'stores', [])
          this.$set(this, 'showStores', false)
        } else if (item.selectedtype === 'city') {
          this.$set(this.address, 'cityCode', item.selectedCode)
          this.$set(this.address, 'districtCode', '')
          this.$set(this.address, 'cityName', item.selectedName)
          this.$set(this.address, 'districtName', '')
          this.$set(this, 'stores', [])
          this.$set(this, 'showStores', false)
        } else {
          this.$set(this.address, 'districtCode', item.selectedCode)
          this.$set(this.address, 'districtName', item.selectedName)
          this.$set(this, 'showStores', true)
          this.$store.dispatch('account/getStores', this.address).then((res) => {
            this.$set(this, 'stores', res.data.map(data => Object.assign({}, data, {
              isChecked: false
            })))
            this.$refs.storeList.scrollTop = 0
          }).catch((err) => {
            this.$store.commit('common/setMessage', err.msg || 'error')
          })
        }
      },
      getStore (cb) {
        this.$store.dispatch('account/getStore').then((res) => {
          if (res.data && res.data.name) {
            this.$set(this, 'selectedStoreData', res.data)
            this.$set(this, 'user', res.data.name)
            this.$set(this, 'phone', res.data.phone)
            this.$set(this, 'addressDetail', res.data.detail)
            this.$set(this, 'storeId', res.data.storeId)
            this.$set(this, 'isVerifiedStore', true)
            this.$set(this, 'address', {
              cityCode: res.data.cityCode,
              districtCode: res.data.districtCode,
              provinceCode: res.data.provinceCode,
              provinceName: res.data.provinceName,
              cityName: res.data.cityName,
              districtName: res.data.districtName
            })
            this.$set(this, 'hasPickUp', true)
          } else {
            this.$set(this, 'hasPickUp', false)
          }
          if (typeof cb === 'function') {
            cb()
          }

          this.$emit('change', res.data)
        }).catch((err) => {
          this.$store.commit('common/setMessage', err.msg || 'error')
        })
      }
    },
    mounted () {
      this.getStore()
    }
  }
</script>
<style lang="less">
  @import "~assets/less/_variables.less";

  .pick-up {
    &__info {
      border-left: 1px solid @gray-lightener;
      border-right: 1px solid @gray-lightener;
      color: @black;
      margin-top: 36px;

      .info {
        &__title {
          height: 42px;
          background-color: @gray-lightener;
          line-height: 42px;
          font-size: 16px;
          font-weight: 600;
          padding: 0 18px;
        }

        &__panel {
          padding: 50px 20px;
          height: 297px;
        }

        &__sub-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        &__tip {
          font-size: 12px;
          color: @gray;
          width: 420px;
        }

        &__address {
          padding: 17px 20px;
          background-image: url("../../../static/img/pick-up-address.jpg");
          height: 96px;
          width: 420px;
          background-size: cover;
          margin: 18px 0 14px;
          font-size: 14px;
          font-weight: 600;
        }

        &__user {
          margin-bottom: 4px;
        }

        &__update {
          font-size: 14px;
          text-decoration: underline;
          cursor: pointer;
        }

        &__select {
          background-image: url("../../../static/img/pick-up-select.jpg");
          height: 96px;
          width: 420px;
          background-size: cover;
          margin-top: 18px;
          cursor: pointer;
        }
      }
    }


    &__modal {
      color: #333;

      .modal {
        &__title {
          font-size: 22px;
          font-weight: 600;
        }

        &__sub-title {
          color: @gray;
          font-size: 14px;
          margin-left: 12px;
          font-weight: normal;
        }

        &__address {
          .fn-left {
            line-height: 30px;
            color: @gray;
            font-size: 14px;
          }
          margin: 30px 0;
        }

        &__shop {
          height: 160px;
          overflow: auto;
          margin-bottom: 50px;

          li {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 30px;
            cursor: pointer;
          }
        }

        &__button {
          margin-top: 15px;
        }

        &__error {
          padding-left: 83px;
        }

        &__error-user {
          padding-left: 78px;
        }

        &__radio {
          width: 16px;
          height: 16px;
          border-radius: 8px;
          background-color: #fff;
          border: solid 1px @gray-lighten;
          margin: 1px 10px 0 0;
          float: left;

          &--checked {
            background-color: @red;
            border-color: @red;

            svg {
              padding: 1px 0 0 1px;
            }
          }
        }

        &__no-list {
          font-size: 14px;
          font-weight: 600;
          margin: 108px 0 0 108px;
        }
      }
    }

  }
</style>
