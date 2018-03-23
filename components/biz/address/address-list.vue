<template lang="html">
    <div id="address-list">
        <h6 v-show="showSetting">
            <span class="addmin-address">管理收货地址</span>
            <span class="address-num" v-show="addressData.length > 0">
                您已经创建{{addressData.length}}个收货地址，最多可以创建
                <em>10</em>个
                <button class="setting delete-adress" @click="showModal('add')"  v-show="addBtnDisabled">新建地址</button>
          </span>
        </h6>
        <div class="address-item" v-show="addressData.length">
            <div class="item-info" v-for="(item, index) in addressData" :class="{'selected': index === flag && !showSetting, 'defaultBg': item.isDefault}" @click="selected(index)">
                <div class="address">
                    <img v-show="item.isDefault" src="../../../assets/img/Group 141.png" alt=""/>
                    <span class="default-words" v-show="item.isDefault">默认地址</span>
                    <span>{{item.addressName}}</span>
                </div>
                <p>
                  <span class="label" style="letter-spacing: 3px;">收货人:</span>
                  <span class="content">{{item.name}}</span>
                  <span v-show="showSetting" class="setting default-address" :class="{isDefault: item.isDefault}" @click="setDefault(item)">{{item.isDefault ? '默认地址' : '设为默认地址'}}</span>
                </p>
                <p>
                  <span class="label">联系电话:</span>
                  <span class="content">{{item.phone}}</span>
                  <span v-show="showSetting" class="setting edit-address" @click="showModal('edit', item)">编辑地址</span>
                </p>
                <p>
                  <span class="label">收货地址:</span>
                  <span class="content">{{item.province.name + item.city.name + item.district.name + item.detail }}</span>
                  <span v-show="showSetting" class="setting delete-adress" @click="deleteAddress(item.id)">删除地址</span>
                </p>
            </div>
        </div>
        <div class="address-modal" v-show="iShowModal">
            <div class="modal">
                <div class="modal-close" @click="close"><img src="../../../assets/img/Group92.png"></div>
                <div class="modal-title">{{mode === 'add' ? '新增' : '编辑'}}收货地址</div>
                <div class="modal-content">
                    <EditAddress ref="editAddress"></EditAddress>
                </div>
                <div class="button-group">
                  <label @click="changeDefault">
                      <img v-if="isDefault" src="../../../assets/img/checkbox-checked.png"/>
                      <em v-else></em>
                      设为默认
                  </label>
                  <button
                    class="info-button"
                    @click="addOrEditAddress"
                    style="background-color: #ff4544"
                  >保存收货人信息</button>
                  <button class="info-button" @click="close">取消</button>
                </div>
            </div>
        </div>
        <div v-show="!addressData.length">
            <NoResult :tip="addressTip" :imgType="type" @addFormNoresult="listenNoResultMsg"></NoResult>
        </div>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import addressSelected from '~components/biz/address/addressSelected'
import EditAddress from '~components/biz/address'
import NoResult from '~components/biz/account/no-result'

export default {
  name: 'address-list',
  data () {
    return {
      show: false,
      selecteItem: {},
      iShowModal: false,
      mode: '',
      isDefault: true,
      type: 'address',
      addressTip: '抱歉！您暂时还没有收货地址品，赶快去新建吧!'
    }
  },
  props: {
    showSetting: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    addressData () {
      return this.$store.state.address.addressList || []
    },
    flag () {
      return this.$store.state.address.index || 0
    },
    addBtnDisabled () {
      return this.addressData.length < 10
    }
  },
  methods: {
    close () {
      this.$set(this, 'iShowModal', false)
      this.$refs.editAddress.clearEditInfo()
    },
    setDefault (item) {
      if (!item.isDefault) {
        this.$store.dispatch('address/setDefaultAddress', item.id).then((data) => {
          this.fetchData()
        }).catch((err) => {
          this.$store.commit('common/setMessage', err.msg || err)
        })
      }
    },
    changeDefault () {
      this.$set(this, 'isDefault', !this.isDefault)
    },
    listenNoResultMsg (msg) {
      if (msg === 'add') {
        this.$set(this, 'mode', 'add')
        this.$set(this, 'iShowModal', true)
      }
    },
    fetchData () {
      this.$store.dispatch('address/getAddressList')
      .catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    },
    selected (index) {
      if (!this.showSetting) {
        this.$store.commit('address/saveAdressIndex', index)
        this.$emit('getSelectedItem', this.addressData[index])
      }
    },
    deleteAddress (id) {
      this.$store.dispatch('address/deleteAddress', id).then(() => {
        this.fetchData()
        this.$store.commit('common/setMessage', '删除成功')
      }).catch((err) => {
        this.$store.commit('common/setMessage', err.msg || err)
      })
    },
    showModal (type, item) {
      if (type === 'edit') {
        const temp1 = this.$refs.editAddress.address
        const temp2 = this.$refs.editAddress.addressName
        this.$set(temp1, 'id', item.id)
        this.$set(temp1, 'name', item.name)
        this.$set(temp1, 'phone', item.phone)
        this.$set(temp1, 'contactPhone', item.contactPhone)
        this.$set(temp1, 'detail', item.detail)
        this.$set(temp1, 'addressName', item.addressName)
        this.$set(temp1, 'isDefault', item.isDefault)
        this.$set(temp1, 'provinceCode', item.province.code)
        this.$set(temp1, 'cityCode', item.city.code)
        this.$set(temp1, 'districtCode', item.district.code)
        this.$set(temp2, 'provinceName', item.province.name)
        this.$set(temp2, 'cityName', item.city.name)
        this.$set(temp2, 'reginName', item.district.name)
        this.$refs.editAddress.address = Object.assign({}, temp1)
        this.$refs.editAddress.addressName = Object.assign({}, temp2)
        this.$refs.editAddress.setEditAdress()
      }
      this.$set(this, 'mode', type)
      this.$set(this, 'iShowModal', true)
    },
    addOrEditAddress () {
      const editDisabled = this.$refs.editAddress.validate()
      const queryParam = cloneDeep(this.$refs.editAddress.address)
      queryParam.isDefault = this.isDefault
      if (editDisabled) {
        if (this.mode === 'add') {
          delete queryParam.id
          this.$store.dispatch('address/createAddress', queryParam).then(() => {
            this.fetchData()
            this.$set(this, 'iShowModal', false)
          }).catch((err) => {
            this.$store.commit('common/setMessage', err.msg || err)
          })
          this.$refs.editAddress.clearEditInfo()
        } else if (this.mode === 'edit') {
          this.$store.dispatch('address/editAddress', queryParam).then(() => {
            this.fetchData()
            this.$set(this, 'iShowModal', false)
          }).catch((err) => {
            this.$store.commit('common/setMessage', err.msg || err)
          })
          this.$refs.editAddress.clearEditInfo()
        } else {
          this.$store.commit('common/setMessage', '请检查您的输入是否正确')
        }
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  components: { addressSelected, NoResult, EditAddress }
}
</script>

<style lang="less">
#address-list{
    h6  {
        font-size: 14px;
        color: #666;
        height: 36px;
        line-height: 36px;
        font-weight: normal;
        padding: 0 20px;
        margin-bottom: 20px;
        background: #f8f8f8;
        .addmin-address {
            margin-right: 40px;
        }
        .address-num {
            em {
                font-style: normal;
                color: #ff4544;
            }
            button{
                margin-top: 10px;
                background: #fff;
                border: 1px solid #ddd;
                color: #666;
            }
        }
    }
    .setting {
        font-size: 12px;
        height: 20px;
        float: right;
        width: 90px;
        text-align: center;
        cursor: pointer;
    }
    .address-item {
        width: 100%;
        padding-left: 0 20px;
        .defaultBg {
            background: #f8f8f8;
        }
        .item-info {
            font-size: 14px;
            overflow: hidden;
            padding: 9px 20px;
            border-bottom: 1px solid #f8f8f8;
            .address {
                color: #b7a078;
                margin-bottom: 8px;
                span {
                  display: inline-block;
                  vertical-align: top;
                }
                .default-words {
                    margin-right: 12px;
                }
                img {
                    margin-right: 12px;
                    width: 19px;
                    vertical-align: top;
                }
            }
            p {
                span {
                    display: inline-block;
                    vertical-align: bottom;
                    line-height: 22px;
                    margin-bottom: 6px;
                }
                .label {
                    width: 70px;
                    color: #999;
                }
                .content {
                    font-weight: 600;
                    color: #333;
                }
                .isDefault {
                    background: #b7a078;
                    border: none;
                    color: #fff;
                }
            }
        }
        .default-address {
            border: 1px solid #591616;
            color: #591616;
        }
        .edit-address {
            border: 1px solid #b7a078;
            color: #b7a078;
        }
        .delete-adress {
            border: 1px solid #908888;
            color: #908888;
        }
        .selected {
            border: 2px solid #ff4544;
        }
    }
    .address-modal {
      z-index: 1;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      top: 0;
      left: 0;
      position: fixed;
      .modal {
        position: fixed;
        padding-top: 50px;
        top: 10%;
        right: 0;
        left: 0;
        width: 660px;
        background-color: white;
        margin: 0 auto;
        z-index: 2;
        text-align: left;
        .modal-close {
          position: absolute;
          top: 25px;
          right: 25px;
          text-align: right;
          font-size: 30px;
          height: 28px;
          width: 28px;
        }
        .modal-title {
          font-size: 22px;
          font-weight: 600;
          color: #333333;
          padding-left: 50px;
        }
        .modal-content {
          padding: 10px 50px;
          max-height: 470px;
          overflow-y:scroll;
        }
        .button-group {
          display: flex;
          flex-direction: row;
          margin: 20px 60px;
          label {
            font-size: 14px;
            color: #333;
            margin-right: 30px;
            height: 20px;
            margin-top: 20px;
            em {
              display: inline-block;
              width: 12px;
              height: 12px;
              border: 1px solid #999;
              border-radius: 3px;
            }
          }
          .info-button {
            border: none;
            margin: 0px 10px 32px 0;
            width: 158px;
            text-align: center;
            background-color: #908888;
            color: white;
            line-height: 42px;
          }
        }
        .triangle {
          position: relative;
          z-index: 1;
          width: 0;
          height: 0;
          border-bottom: 12px solid red;
          border-left: 12px solid transparent;
          margin: 0px -20px -2px auto;
          .icon-right {
            margin-left: -7px;
            font-size: 6px;
            color: white;
          }
        }
      }
      .selected {
        border:2px solid #ff4544 !important;
      }
    }
}
</style>
