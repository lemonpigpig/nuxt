<template>
  <section class="container" id="product-details" @click="showAreaBox(false)">
    <div class="goods-location-links">
      当前位置：
      <nuxt-link class="location__link" href="javascript:void(0)"
                 :to="{name:'home'}">首页
      </nuxt-link>
      <template v-for="(item, index) in location">
        <gz-icon size="10" icon="go"></gz-icon>
        <template v-if="index === location.length - 1">
          {{ item.name }}
        </template>
        <template v-else>
          <a href="javascript:void(0)" @click="goCategory(item)">{{ item.name }}</a>
        </template>
      </template>
    </div>
    <div class="container-top">
      <div class="top-left">
        <div class="top-left-main">
          <img :src="currentImgItem" />
          <!--gz-zoom-preview :src="currentImgItem" :previewSrc="currentImgItem"></gz-zoom-preview-->
        </div>
        <div class="top-left-sub" v-if="goodsBasicInfo.imagesCarousel && goodsBasicInfo.imagesCarousel.length>0">
          <div class="sub-categories" @mouseover="setImgItem(item)" :class="{active: currentImgItem===item}" v-for="item in goodsBasicInfo.imagesCarousel.slice(0, 5)">
            <img :src="item" />
          </div>
        </div>
      </div>
      <div class="top-middle">
          <div class="middle-body">
              <div class="middle-title">
                <!-- <span v-if="goodsBasicInfo.isPresale">预售</span> -->
                <gz-tag backgroundColor="#fe8d00" v-if="goodsBasicInfo.isPresale">
                  <span slot="tag-text">预售</span>
                </gz-tag>
                <gz-tag backgroundColor="#555c78" v-if="goodsBasicInfo.isAbholung">
                  <span slot="tag-text">自提</span>
                </gz-tag>
                {{goodsBasicInfo.name}}
              </div>
              <div class="middle-tags">{{goodsBasicInfo.introduction}}</div>
              <div class="middle-info" v-if="!goodsBasicInfo.promotion || !goodsBasicInfo.promotion.id">
                <div class="info-left">
                  <div class="info-title">
                      <span class="letterSpace">价格</span>
                      <span class="big-number">{{goodsBasicInfo.computedPrice}}</span>
                      <span class="line-number">￥{{goodsBasicInfo.originalPrice}}</span>
                  </div>

                  <div class="info-title" v-if="couponsList.length">
                      <span class="coupon">优惠券</span>
                      <span class="coupon-num" v-for="item in couponsList.slice(0,3)">{{item.useOrderAmountLimit ? `满${item.useOrderAmountLimit}减${item.faceValue}` : `${item.faceValue}元券`}}</span>
                      <span class="more" @click="iShowGoodsCoupons = true"> 更多<img src="~assets/img/detail.svg"></span>
                  </div>
                  <div class="goods-coupons" v-show="iShowGoodsCoupons">
                    <div class="goods-coupons-group">
                        <div class="coupons" v-for="item in couponsList">
                          <coupon-receive :item="item" :goodsId="goodsId"></coupon-receive>
                        </div>
                    </div>
                    <div class="button-part">
                        <button type="button" @click="iShowGoodsCoupons = false">返回</button>
                    </div>
                  </div>

                  <div class="info-title promotion" v-if="promotionInfo.length">
                     <span class="letterSpace">促销</span>
                     <div class="content">
                          <div class="part" v-if="reduceList.length">
                              <i>满减</i>
                              <span>{{`满${reduceList[0].amountLimit}减${reduceList[0].fullcutAmount}`}}</span>
                              <span  class="detail" @click="iShowReducePanme = true" v-show="reduceList.length > 1">详细
                                  <img src="~assets/img/detail.svg">
                              </span>
                          </div>
                          <div class="part" v-if="giftList.length">
                              <i>满赠</i>
                              <span>{{`满${giftList[0].amountLimit}领取赠品`}}</span>
                              <span  class="detail" @click="iShowGiftPane = true">详细
                                  <img src="~assets/img/detail.svg">
                              </span>
                          </div>
                      </div>
                  </div>
                  <div class="gift-promotion-pane promotion-pane" v-show="iShowGiftPane">
                      <div class="promotion-detail" v-for="item in giftList">
                          <span class="pic-part"><img :src="item.imageCover[0]"></span>
                          <div class="text-part">
                              <div class="giftName-part">
                                  <span v-for="detail in item.giftDetail">{{`${detail.name}`}}<em>{{ `x${detail.num}`}}</em></span>
                              </div>
                              <span class="price-part">
                                  <i class="num">¥0.00</i>
                                  <i class="limit-num">{{`(满¥${item.amountLimit}可领取)`}}</i>
                              </span>
                          </div>
                      </div>
                      <div class="button-part">
                          <button type="button" @click="iShowGiftPane = false">返回</button>
                      </div>
                  </div>
                  <div class="reduce-promotion-pane promotion-pane" v-show="iShowReducePanme">
                      <div class="promotion-detail" v-for="item in reduceList">
                          <div class="text-part">
                              满<span>{{item.amountLimit.toFixed(2)}}</span>元，可减<span>{{item.fullcutAmount.toFixed(2)}}</span>现金
                          </div>
                      </div>
                      <div class="button-part">
                          <button type="button" @click="iShowReducePanme = false">返回</button>
                      </div>
                  </div>
                </div>
                <div class="info-right" v-show="goodsBasicInfo.isTraceSource">
                  <img src="~assets/img/origin.svg">
                  <span>溯源</span>
                </div>
              </div>
              <div class="middle-info-promotion" v-if="goodsBasicInfo.promotion && goodsBasicInfo.promotion.id">
                <div class="promotion-left">
                  <div class="promotion-header">
                      <div class="promotion-icon"><gz-icon icon="lightning" class="red" size="18"></gz-icon></div>
                      <span style="margin-left: 8px">距抢购结束</span>
                      <span style="margin-left:8px">
                        <time-reverse :timer="getTimer()" :hourclass="`goods-time-style`" :minclass="`goods-time-style`" :secondclass="`goods-time-style`"></time-reverse>
                      </span>
                  </div>
                  <div class="promotion-body">
                    <div class="promotion-title">价格：<span class="promotion-big-number">{{goodsBasicInfo.computedPrice}}</span>
                        <span class="line-number">￥{{goodsBasicInfo.originalPrice}}</span>
                    </div>
                    <div class="promotion-info">
                      <div class="promotion-info-name">抢购信息：</div>
                      <div class="promotion-info-content" v-if="goodsBasicInfo.maxLimit>0">
                        限购{{goodsBasicInfo.maxLimit}}件
                      </div>
                      <div class="promotion-info-content" v-else>
                        不限购
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="middle-input" v-if="goodsBasicInfo.status !== 5 || goodsBasicInfo.status !== 3">
                <div>送货至：</div>
                <span @click="showAreaBox(true, $event)">
                  <input v-model="totalAreaInfo" readonly /><gz-icon icon="more" size="14"></gz-icon>
                </span>
                <span class="area-stock" v-if="hasStock && goodsBasicInfo.status === 2">有货</span>
                <span class="area-stock" v-if="noStock && goodsBasicInfo.status === 2">无货</span>
              </div>
              <div class="info-body-content" v-if="freightData && freightData.length>=1">
                <p v-for="p in freightData">{{p}}</p>
              </div>
              <div class="area-box" v-if="areaBoxShow" @click="showAreaBox(true, $event)">
                <div class="area-tag">
                  <div class="area-tag-name" @click="saveAreaTag('province')"
                       :class="{nobottom: currentAreaTag==='province'}">
                       {{selectedProvince.name ? selectedProvince.name : '选择省份'}}
                  </div>
                  <div class="area-little"></div>
                  <div class="area-tag-name" @click="saveAreaTag('city')"
                       :class="{nobottom: currentAreaTag==='city'}" v-if="cityList && cityList.length > 0">
                       {{selectedCity.name ? selectedCity.name : '选择城市'}}
                  </div>
                  <div class="area-little"></div>
                  <div class="area-tag-name" @click="saveAreaTag('region')"
                       :class="{nobottom: currentAreaTag==='region'}"  v-if="regionList && regionList.length > 0">
                       {{selectedRegion.name ? selectedRegion.name : '选择区域'}}
                  </div>
                  <div class="area-tag-null"></div>
                </div>
                <div class="area-info">
                  <div class="area-button-group" v-if="currentAreaTag==='province'">
                    <div class="area-button" v-for="item in provinceList"
                         @click="selectProvince(item)" :class="{selected: selectedProvince.code===item.code}">
                         {{item.name}}
                    </div>
                  </div>
                  <div class="area-button-group" v-if="currentAreaTag==='city'">
                    <div class="area-button" v-for="item in cityList"
                         @click="selectCity(item)" :class="{selected: selectedCity.code===item.code}">
                         {{item.name}}
                    </div>
                  </div>
                  <div class="area-button-group" v-if="currentAreaTag==='region'">
                    <div class="area-button" v-for="item in regionList"
                         @click="selectRegion(item)" :class="{selected: selectedRegion.code===item.code}">
                         {{item.name}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="middle-input" v-if="goodsBasicInfo.status !== 5">
                <div style="letter-spacing:8px">数量：</div>
                <span><input v-model="goodsQuantity" class="quantity-input" @blur="checkGoodsQuantity"/></span>
                <span style="left:130px;margin-top:16px;position:absolute">
                  <a class="quantity-action add-top" :class="{'grey-arrow': goodsQuantity<=1}" @click="quantityMinus"><gz-icon icon="more" size="14"></gz-icon></a>
                  <a class="quantity-action add-bottom" :class="{'grey-arrow': goodsQuantity>=maxQuantity()}" @click="quantityPlus"><gz-icon icon="less" size="14"></gz-icon></a>
                </span>
                <span style="margin-left:36px;color:#333333" v-if="goodsBasicInfo.stock>0 && goodsBasicInfo.status===2">
                  库存{{goodsBasicInfo.stock}}件
                  <span v-if="goodsBasicInfo.maxLimit>0">[每单限购{{goodsBasicInfo.maxLimit}}件]</span>
                  <span v-else>[不限购]</span>
                </span>
              </div>
              <div class="presale" v-if="goodsBasicInfo.isPresale">
                <div class="presale-icon"><gz-icon icon="info1" size="12"></gz-icon></div>
                预计 {{goodsBasicInfo.presaleTime.slice(5,10)}} 发货
              </div>
          </div>
          <div class="middle-button">
            <div class="product-button" @click.stop.prevent="buyNow" v-if="goodsBasicInfo.stock>0 && goodsBasicInfo.status===2 && !reduceList.length && !giftList.length">立即购买</div>
            <div class="product-button" style="background-color: #ff5f25" @click.stop.prevent="addCart" v-if="goodsBasicInfo.stock>0 && goodsBasicInfo.status===2">加入购物车</div>
            <div class="product-button middle-bottom-button" v-if="goodsBasicInfo.stock<=0 && goodsBasicInfo.status === 2">已售罄</div>
            <div class="product-button middle-bottom-button" v-if="goodsBasicInfo.status===5">敬请期待</div>
            <div class="product-button middle-bottom-button" v-if="goodsBasicInfo.status===3">已下架</div>
            <div class="middle-icon" @click.stop.prevent="collect" v-if="!isFavorite"><gz-icon icon="heart"></gz-icon>收藏</div>
            <div class="middle-icon" @click.stop.prevent="cancelCollect" v-if="isFavorite"><gz-icon icon="heart1"></gz-icon>收藏</div>
          </div>
      </div>
      <div class="top-right" v-if="museumInfo && museumInfo.districtCode">
        <div class="top-box">
          <div class="box-img"><img :src="museumInfo.logoUrl"></div>
          <div class="box-body">
            <div class="box-title">{{museumInfo.name}}</div>
            <div class="box-content">{{museumInfo.promotionTitle}}</div>
            <div class="box-button-group">
              <div class="product-button box-button" @click="goMuseum(museumInfo.id)">进馆逛逛</div>
              <div class="product-button box-button" style="background-color: #ff5f25">
                <a href="tencent://message/?uin=3202385982&Site=&Menu=yes">
                  联系客服
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-content">
      <div class="content-left">
        <div class="content-section">
          <div class="content-title">相关分类</div>
          <div class="content-body">
            <div class="content-tag" v-for="tag in categoryTags.slice(0,6)" @click="goRelatedCategory(tag)">{{tag.name}}</div>
          </div>
        </div>
        <div class="content-section">
          <special-goods :goodsItems="specialGoodsItems"/>
        </div>
      </div>
      <div class="content-right">
        <div class="right-tags">
            <div class="tag-name" :class="{active: currentTag==='product'}" @click="setTag('product')">商品详情</div>
            <div class="tag-name" :class="{active: currentTag==='variant'}" @click="setTag('variant')">规格详情</div>
        </div>
        <div class="tag-content" v-if="currentTag==='product'">
          <!-- <div class="goods-description" v-if="transData(goodsBasicInfo.description).length>0">
            <div v-for="data in transData(goodsBasicInfo.description)" class="description-array">
                <div v-for="desc in data.columns" class="description-columns">
                  <img :src="desc.content.content" v-if="desc.content.type==='image'" />
                  <p v-if="desc.content.type==='paragraph'">{{desc.content.content}}</p>
                </div>
            </div>
          </div> -->
          <div class="goods-description">
              <div class="goods-description-html ql-editor" v-html="goodsBasicInfo.description"></div>
          </div>
        </div>
        <div class="tag-content" v-if="currentTag==='variant'">
          <div class="tag-detail">
            <div class="tag-detail-obj" v-for="item in goodsBasicInfo.properties">
              <span class="tag-detail-title">{{item.name}}：</span><span>{{item.value}}</span>
            </div>
          </div>
          <div class="tag-note">
            <div class="note-title">温馨提示：</div>
            <div class="note-content">
              <p>1、国资商城商品均有严格的品质把控，请您放心购买。如您发现商品有质量问题，请在收到商品后及时联系客服处理；</p>
              <p>2、由于部分商品包装更换较为频繁，因此您收到的货品有可能与图片不完全一致，请您以收到的商品实物为准；</p>
              <p>3、请避免与其他味重产品一同存放，以防串味；</p>
              <p>4、拆封后请冷藏密封保存，延缓氧化，确保品质。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
import SpecialGoods from '~components/special-goods'
import AlertModal from '~components/alert-modal'
import Time from '~components/time'
import Tag from '~components/biz/tag/tag'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'
import '~/assets/css/quill.core.css'
import Coupon from '~components/biz/coupon'

export default {
  mixins: [SeoMixin],
  async asyncData () {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 20 }) }
    } catch (e) {
      throw e
    }
  },
  data () {
    return {
      currentImgItem: '/img/default-img.jpg',
      currentTag: 'product',
      categoryTags: [],
      areaBoxShow: false,
      currentAreaTag: '',
      selectedProvince: '',
      selectedCity: '',
      selectedRegion: '',
      totalAreaInfo: '',
      goodsQuantity: 1,
      isSaleArea: false,
      freightData: [],
      location: [],
      reduceList: [],
      giftList: [],
      iShowGiftPane: false,
      iShowReducePanme: false,
      hasStock: false,
      noStock: false,
      iShowGoodsCoupons: false
    }
  },
  components: {
    [SpecialGoods.name]: SpecialGoods,
    [AlertModal.name]: AlertModal,
    [Time.name]: Time,
    [Tag.name]: Tag,
    [Coupon.couponReceive.name]: Coupon.couponReceive
  },
  methods: {
    setImgItem (item) {
      this.$set(this, 'currentImgItem', item)
    },
    setTag (name) {
      this.$set(this, 'currentTag', name)
    },
    showAreaBox (status, event) {
      if (this.goodsBasicInfo.status === 3 || this.goodsBasicInfo.stock <= 0) {
        return
      }
      this.$set(this, 'areaBoxShow', status)
      if (event) {
        event.stopPropagation()
      }
    },
    saveAreaTag (tag) {
      switch (tag) {
        case 'city':
          if (!this.selectedProvince) {
            return null
          }
          break
        case 'region':
          if (!this.selectedCity) {
            return null
          }
          break
        default:
      }
      this.$set(this, 'currentAreaTag', tag)
    },
    selectProvince (province) {
      if (this.selectedProvince !== province) {
        this.$set(this, 'selectedRegion', '')
        this.$set(this, 'selectedCity', '')
      }
      this.$set(this, 'selectedProvince', province)
      this.queryAreaByLevelAndCode(2, province.code)
    },
    selectCity (city) {
      if (this.selectedCity !== city) {
        this.$set(this, 'selectedRegion', '')
      }
      this.$set(this, 'selectedCity', city)
      this.queryAreaByLevelAndCode(3, city.code)
    },
    selectRegion (region) {
      this.$set(this, 'selectedRegion', region)
    },
    queryAreaByLevelAndCode (level, code) {
      const params = {
        level: level,
        code: code
      }
      this.$store.dispatch('common/getLevelAreaByCode', params)
    },
    checkParams () {
      var result = false
      if (this.goodsQuantity < 1) {
        this.$store.commit('common/setMessage', '购买数量不能小于1')
        result = true
      }
      return result
    },
    maxQuantity () {
      var maxNum = this.goodsBasicInfo.maxLimit > this.goodsBasicInfo.stock ? this.goodsBasicInfo.stock : this.goodsBasicInfo.maxLimit
      if (this.goodsBasicInfo.maxLimit === 0) {
        maxNum = this.goodsBasicInfo.stock
      }
      return maxNum
    },
    quantityPlus () {
      var maxNum = this.maxQuantity()
      if (this.goodsBasicInfo.stock <= 0) {
        return
      }
      if (this.goodsQuantity >= maxNum) {
        this.goodsQuantity = maxNum
        return
      }
      this.goodsQuantity += 1
    },
    quantityMinus () {
      if (this.goodsQuantity <= 1) {
        this.goodsQuantity = 1
        return
      }
      this.goodsQuantity -= 1
    },
    setQuantity (cb) {
      this.$set(this.goodsBasicInfo, 'goodsQuantity', this.goodsQuantity)
      if (cb) {
        cb()
      }
    },
    buyNow () {
      if (this.checkParams()) {
        return null
      }
      // this.$store.dispatch('order/clearGoods', {
      //   goods: [{
      //     goodsId: this.goodsBasicInfo.id,
      //     goodsQuantity: this.goodsQuantity
      //   }],
      //   platformType: 1
      // }).then(() => {
      //   this.$router.push('/order/create')
      // })
      this.$store.dispatch('order/beforeCreate', {
        goods: [{
          goodsId: this.goodsBasicInfo.id,
          goodsQuantity: this.goodsQuantity,
          itemType: 1
        }],
        platformType: 1
      }).then((res) => {
        if (res) {
          this.$store.commit('order/setGoodsCache', {
            goods: {
              goods: [{
                goodsId: this.goodsBasicInfo.id,
                goodsQuantity: this.goodsQuantity,
                itemType: 1
              }],
              platformType: 1
            },
            key: res
          })
          this.$store.commit('order/setGoodsIdCache', res)
          this.$router.push(`/order/create?key=${res}`)
        }
      })
      .catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
      // this.setQuantity(() => {
      //   this.$store.commit('order/setBuyList', [this.goodsBasicInfo])
      // })
    },
    addCart () {
      if (this.checkParams()) {
        return null
      }
      var id = this.$route.params.id
      // 未登录的时候是可以加入购物车的所以我是需要goodsName computedPrice。。。。
      const cartItem = {
        goodsId: id,
        goodsQuantity: this.goodsQuantity || 1,
        goodsName: this.goodsBasicInfo.name,
        computedPrice: this.goodsBasicInfo.computedPrice,
        imageCover: this.goodsBasicInfo.imageCover,
        itemType: 1,
        isSelected: true
      }
      this.$store.dispatch('cart/addGoodsQuantity', cartItem)
      .then((res) => {
        this.$store.commit('common/setMessage', '添加成功')
      })
    },
    collect () {
      const goodsId = this.$route.params.id
      this.$store.dispatch('account/addGoodsToFavorite', goodsId)
      .then((res) => {
        this.$store.commit('common/setMessage', '收藏成功')
      })
      .catch((err) => {
        this.$store.commit('common/setMessage', err)
      })
    },
    cancelCollect () {
      const id = this.goodsBasicInfo.id
      this.$store.dispatch('account/deleleSingleFavoriteGoods', [id])
      .then((res) => {
        this.$store.commit('common/setMessage', '取消成功！')
      })
      .catch((err) => {
        this.$store.commit('common/setMessage', err || err.msg)
      })
    },
    checkGoodsQuantity () {
      if (!this.goodsQuantity || this.goodsQuantity === '0') {
        this.$set(this, 'goodsQuantity', 1)
      }
    },
    checkAreaSale () {
      const queryCondition = {
        id: this.goodsBasicInfo.id,
        provinceCode: this.selectedProvince.code,
        cityCode: this.selectedCity.code
      }
      this.$store.dispatch('goodsBasic/checkIsSaleArea', queryCondition).then((result) => {
        this.$set(this, 'hasStock', result)
        this.$set(this, 'noStock', !result)
        this.$set(this, 'isSaleArea', result)
      })
    },
    getFreight () {
      const queryCondition = {
        GoodsId: this.goodsBasicInfo.id,
        ProvinceCode: this.selectedProvince.code,
        CityCode: this.selectedCity.code
      }
      this.$store.dispatch('goodsBasic/getGoodsFreight', queryCondition).then((resp) => {
        this.$set(this, 'freightData', resp)
      })
    },
    getPromotionInfoHandle (id) {
      this.$store.dispatch('goodsBasic/getPromotionInfo', id).then(() => {
        this.promotionInfo.forEach((item) => {
          const info = {
            amountLimit: 0,
            fullcutAmount: 0,
            imageCover: [],
            giftDetail: []
          }
          info.amountLimit = item.amountLimit
          info.fullcutAmount = item.fullcutAmount
          if (!item.fullcutAmount) {
            item.fullcutGiftList.forEach((item) => {
              const giftInfo = {
                name: '',
                num: 0
              }
              giftInfo.name = item.name
              giftInfo.num = item.quantity
              info.giftDetail.push(giftInfo)
              info.imageCover.push(item.imageCover)
            })
            this.giftList.push(info)
          } else {
            this.reduceList.push(info)
          }
        })
      }).catch((err) => {
        this.$store.commit('common/setMessage', err || err.msg)
      })
    },
    getGoodsInfo (id) {
      this.$store.dispatch('goodsBasic/getGoodsBasicInfo', id).then(() => {
        this.$set(this, 'hasStock', !!this.goodsBasicInfo.stock)
        this.$set(this, 'noStock', !this.goodsBasicInfo.stock)
        if (this.goodsBasicInfo.categoryCode) {
          this.$store.dispatch('category/getCategoryLocation', this.goodsBasicInfo.categoryCode).then((data) => {
            this.$set(this, 'location', data)
          })
        }
        if (this.goodsBasicInfo.imageCover) {
          this.$set(this, 'currentImgItem', this.goodsBasicInfo.imageCover)
        }
        if (this.goodsBasicInfo.originDistrictCode) {
          this.$store.dispatch('museums/getMuseumsByCode', this.goodsBasicInfo.originDistrictCode)
        } else {
          this.$store.commit('museums/setMuseumsInfoFromGoods', {})
        }
        if (this.goodsBasicInfo.categoryCode) {
          this.$store.dispatch('goodsBasic/relatedCategory', this.goodsBasicInfo.categoryCode).then((data) => {
            this.$set(this, 'categoryTags', data)
          })
          this.$store.dispatch('goodsBasic/specialGoods', this.goodsBasicInfo.categoryCode)
        }
        if (this.goodsBasicInfo.stock > 0 && this.goodsBasicInfo.status === 2) {
          this.$set(this, 'selectedProvince', { name: '云南省', code: '53' })
          this.$set(this, 'selectedCity', { name: '昆明市', code: '5301' })
          this.$set(this, 'totalAreaInfo', '云南省昆明市')
          this.queryAreaByLevelAndCode(2, '53')
          this.queryAreaByLevelAndCode(3, '5301')
          this.getFreight()
          this.checkAreaSale()
        }
      })
    },
    goMuseum (id) {
      window.open(`/museums/${id}`)
    },
    goCategory (tag) {
      this.$router.push(`/category/${tag.code}`)
    },
    goRelatedCategory (tag) {
      window.open(`/category/${tag.code}`)
    },
    getTimer () {
      const promotion = this.goodsBasicInfo.promotion
      let remainTime = 0
      if (promotion && promotion.endTime) {
        remainTime = moment(promotion.endTime).format('X') - moment().format('X')
      }
      return remainTime
    },
    transData (data) {
      if (data) {
        const description = JSON.parse(data)
        return description
      }
      return []
    }
  },
  watch: {
    selectedRegion (val) {
      if (val) {
        const area = this.selectedProvince.name + this.selectedCity.name + this.selectedRegion.name
        this.$set(this, 'totalAreaInfo', area)
        setTimeout(() => {
          this.$set(this, 'areaBoxShow', false)
          this.checkAreaSale()
          this.getFreight()
        }, 0)
      } else {
        this.$set(this, 'totalAreaInfo', '')
        this.$set(this, 'isSaleArea', false)
      }
    },
    goodsQuantity (val) {
      if (/\D/.test(val)) {
        this.$set(this, 'goodsQuantity', 1)
      }
    },
    regionList (val) {
      if (val && val.length === 0) {
        const area = this.selectedProvince.name + this.selectedCity.name
        this.$set(this, 'totalAreaInfo', area)
        setTimeout(() => {
          this.$set(this, 'areaBoxShow', false)
          this.checkAreaSale()
          this.getFreight()
        }, 0)
      }
    },
    goodsId (val) {
      if (val) {
        this.getGoodsInfo(val)
      }
    }
  },
  computed: {
    goodsBasicInfo () {
      return this.$store.state.goodsBasic.goodsBasicInfo
    },
    provinceList () {
      return this.$store.state.common.firstLevelAreaList
    },
    cityList () {
      return this.$store.state.common.secondLevelAreaList
    },
    regionList () {
      return this.$store.state.common.thirdLevelAreaList
    },
    museumInfo () {
      return this.$store.state.museums.museumsInfoFromGoods
    },
    specialGoodsItems () {
      return this.$store.state.goodsBasic.specialGoods.slice(0, 10)
    },
    goodsId () {
      return this.$route.params.id
    },
    sessionId () {
      return this.$store.state.authorization.sessionId
    },
    promotionInfo () {
      return this.$store.state.goodsBasic.promotionInfo
    },
    isFavorite () {
      var itemList = this.$store.state.account.favoritesGoodsItemList
      var id = this.goodsBasicInfo.id
      return itemList && itemList.indexOf(id) > -1
    },
    couponsList () {
      return this.$store.state.promotion.goodsCouponsList.sort(it => it.useOrderAmountLimit)
    }
  },
  mounted () {
    this.$store.commit('common/setBreadCrumbVisibility', false)
    this.$store.commit('common/setCurrentActivePage', '')
    var goodsId = this.$route.params.id
    this.getGoodsInfo(goodsId)
    this.getPromotionInfoHandle(goodsId)
    this.$store.dispatch('promotion/getCouponsByGoodsId', goodsId)
    if (!this.provinceList || this.provinceList.length === 0) {
      this.$store.dispatch('common/getFirstLevelArea')
    }
    if (this.sessionId) {
      this.$store.dispatch('account/getFavoritesGoodsItemList')
    }
  },
  destroyed () {
    this.$store.commit('goodsBasic/setGoodsBasicInfo', {})
  }
}
</script>

<style lang="less">
#product-details {
  min-height: 100vh;
  width: 1200px;
  margin:0px auto;

  .gz-zoom-preview {
    z-index: 1000;
  }
  input {
    height: 20px;
    border: 1px solid #cccccc;
  }
  .goods-location-links {
    white-space: nowrap;
    padding-bottom: 18px;
    display: flex;
    align-items: center;
    line-height: 30px;
    font-size: 12px;
    margin-top: 26px;
    border-bottom: 1px solid #dddddd;
    .gz-icon {
      margin: 0px 4px;
    }
    a {
      text-decoration: none;
      color: #999999;
    }
  }
  .container-top {
      height: 550px;
      width: 100%;
      margin-top: 25px;
      > div {
        display: inline-block
      }
  }
  .top-left {
      width: 400px;
      vertical-align: top;
  }
  .top-left-sub {
      margin-top: 15px;
  }
  .sub-categories {
      border: 1px solid #dddddd;
      width: 68px;
      height: 68px;
      margin-right: 15px;
      margin-bottom: 10px;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
  }
  .sub-categories:nth-child(5n) {
    margin-right: 0px;
  }
  .sub-categories.active {
      border-color: #ff4544;
      color: #ff4544;
  }
  .top-middle {
      position: relative;
      margin: 0px 20px;
      width: 490px;
      text-align: start;
      vertical-align: top;
      .middle-body {
        min-height: 337px;
      }
  }
  .middle-title {
      width: 470px;
      word-break: break-all;
      line-height: 22px;
      font-size: 16px;
      text-align: justify;
      color: #333333;
      font-weight: 600;
      .tag-item {
        line-height: normal;
        font-weight: normal;
      }
  }
  .middle-tags {
    margin: 10px 0px;
    font-size: 14px;
    color: #666666;
    word-break: break-all;
  }
  .presale {
      background-color: #ffecec;
      padding: 8px 0px 8px 10px;
      margin-bottom: 20px;
      margin-top: 20px;
      font-size: 14px;
      color: #ff4544;
      display: flex;
      align-items: center;
      .presale-icon {
          width: 20px;
          height: 20px;
          border-radius: 100px;
          background-color: #ff4544;
          margin-right: 8px;
          color: white;
          padding-top: 4px;
          text-align: center;
      }
  }
  .middle-info-promotion{
    width: 470px;
    color: white;
    .promotion-header{
      display: flex;
      align-items: center;
      line-height: 36px;
      background-color: #ff4544;
      .promotion-icon {
          border: 1px solid white;
          width: 18px;
          background: white;
          height: 18px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0px 8px;
          .gz-icon{
            color: #ff4544 !important;
          }
      }
    }
    .promotion-body{
      width: 470px;
      font-size: 14px;
	    color: #999999;
      padding: 10px;
    	background-color: #f4f4f4;
      .promotion-title{
        margin-bottom: 10px;
        .promotion-big-number{
          font-size: 26px;
          color: #ff4544;
          font-weight: 600px;
        }
      }
      .promotion-info{
        display: flex;
      }
    }
  }
  .middle-info {
    width: 470px;
    background-color: #ff4544;
    color: white;
    display: flex;
    flex-direction: row;
  }
  .info-left {
      width: 400px;
      padding-left: 10px;
      padding-bottom: 10px;
      position: relative;
      .promotion-pane {
          position: absolute;
          top: 54px;
          left: 65px;
          z-index: 999;
          background: #fff;
          padding: 13px 56px 20px 23px;
          border: 1px solid #ff4544;
          .promotion-detail {
            position: relative;
            color: #333;
            overflow: hidden;
          }
          .button-part {
              margin-top: 20px;
              text-align: center;
              button {
                  border: 1px solid #ddd;
                  background-color: #f4f4f4;
                  width: 80px;
                  line-height: 34px;
              }
          }
      }
      .gift-promotion-pane {
          .promotion-detail {
            margin-bottom: 60px;
            .pic-part {
                float: left;
                padding: 3px;
                border: 1px solid #eee;
                margin-right: 20px;
                img {
                    width: 72px;
                    height: 75px;
                }
            }
            .text-part {
                float: left;
                font-size: 14px;
                color: #333;
                span {
                    display: block;
                    i {
                        font-style: normal;
                    }
                }
                .giftName-part {
                  min-height: 66px;
                  em {
                    font-style: normal;
                    color: #adadad;
                    margin-left: 10px;
                  }
                }
                .price-part {
                    .num {
                        color: #ff4544;
                    }
                    .limit-num {
                        margin-left: 28px;
                        font-weight: bold;
                    }
                }
            }
          }
      }
      .reduce-promotion-pane {
          .text-part {
              margin-bottom: 10px;
              span {
                  color: #ff4544;
              }
          }
      }
  }
  .promotion {
      i {
          float: left;
          font-style: normal;
          color: #591616;
          padding: 0px 4px;
          font-size: 12px;
          text-align: center;
          background: #f8e81c;
          margin-right: 10px;
      }
      span {
          float: left;
      }
      .content {
          float: left;
          .part {
              overflow: hidden;
              margin-bottom: 5px;
              span {
                  font-size: 12px;
                  color: #faead0;
              }
          }
          .detail {
              margin-left: 20px;
          }
      }
  }
  .info-right {
      width: 70px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-top: 10px;
      img {
        width: 16px;
      }
      span {
        color:white;
        font-size: 12px;
        margin-left: 5px;
        margin-top:-2px;
      }
  }
  .info-title {
  	height: 20px;
  	font-size: 14px;
  	color: #ffffff;
    margin: 18px 0px;
    .letterSpace {
      letter-spacing: 14px;
    }
    .coupon {
        margin-right: 13px;
    }
    .coupon-num {
        display: inline-block;
        padding: 2px 3px;
        color: #591616;
        font-size: 12px;
        background: #f8e81c;
        margin-right: 10px;
    }
    .more {
      font-size: 12px;
      color: #faead0;
    }
  }
  .goods-coupons {
      position: absolute;
      top: 54px;
      left: 65px;
      z-index: 999;
      background: #fff;
      border: 1px solid #ff4544;
      background-color: #f4f4f4;
      .goods-coupons-group {
        position: relative;
        left: 0;
        max-height: 300px;
        overflow: auto;
        padding: 20px 30px 0px 30px;
        .coupons {
          margin: 12px 0px;
        }
      }
      .button-part {
        margin: 20px 0px;
        text-align: center;
        button {
            border: 1px solid #ddd;
            background-color: #f4f4f4;
            width: 80px;
            line-height: 34px;
            background-color: white;
        }
      }
  }
  .big-number {
    font-size: 26px;
  	font-weight: 600;
  }
  .line-number {
    margin-left: 15px;
    text-decoration: line-through;
  }
  .info-img {
      width: 40px;
      height: 40px;
      margin: 10px;
      // border: 1px solid white;
  }
  .info-body {
    display: flex;
    flex-direction: row;
    padding-bottom: 10px;
    font-size: 14px;
    .info-body-name {
      width: 20%;
    }
    .info-body-content {
      width: 80%;
    }
  }
  .info-body-content {
    width: 390px;
    font-size: 14px;
	  color: #b7a078;
    word-wrap: break-word;
    text-decoration: underline;
    margin-left: 80px;
    margin-top: 5px;
  }
  .middle-input {
      margin: 27px 0px 0px;
      font-size: 14px;
      line-height: 30px;
  	  color: #999999;
      display: flex;
      flex-direction: row;
      .area-stock {
        font-weight: 500;
        color: #ff4544;
        margin-left: 10px;
      }
      .gz-icon {
          margin-left: -20px;
          margin-top: 3px;
      }
      input.quantity-input {
        width: 40px;
        height: 30px;
        padding-left: 5px;
      }
      a {
        border: 1px solid #cccccc;
        box-sizing: border-box;
        height: 15px;
        width: 15px;
        color: #666666;
        position: absolute;
        .gz-icon {
          margin-left: 0px;
          margin-top: -6px;
        }
      }
      a:first-child{
        border-top: none;
      }
      .add-top {
        top: -1px;
      }
      .add-bottom {
        bottom: -1px;
      }
      .grey-arrow {
        color:#dddddd;
      }
  }
  .middle-input div {
      width: 80px;
  }
  .middle-button {
      margin-top:20px;
      display: flex;
      flex-direction: row;
      align-items: center;
  }
  .middle-icon {
    color: #b7a078;
    font-size: 14px;
    cursor: pointer;
    margin-left: 10px;
    border: solid 1px #dddddd;
    padding: 10px 15px;
    .gz-icon {
      width: 17px;
      height: 16px;
      margin: 0px 5px 0px 0px;
    }
  }
  .product-button {
    font-size: 18px;
    font-weight: 600;
    color: white;
    padding: 8px 0px;
    width: 140px;
    text-align: center;
    background-color: #ff4544;
    margin-right: 10px;
    cursor: pointer;
    a {
      color:white;
    }
  }
  .middle-bottom-button {
    width: 290px;
    background-color: #dddddd;
  }
  .top-box {
      width: 250px;
      margin-left: 20px;
  }
  .box-img {
      width: 100%;
      height: 120px;
      box-sizing: border-box;
      img {
        width: 100%;
        height: 100%;
      }
  }
  .box-body {
    padding: 0px 15px;
    border: 1px solid #ebebeb;
    text-align: justify;
  }
  .box-title {
    font-size: 16px;
  	text-align: justify;
  	color: #333333;
    margin: 20px 0px;
  }
  .box-content {
    font-size: 12px;
  	line-height: 1.33;
  	color: #666666;
  }
  .box-button-group {
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  .box-button {
      font-size: 12px;
      width: 70px;
      margin-right: 20px;
  }
  .container-content {
    display: flex;
    flex-direction: row;
    margin-bottom: 80px;
  }
  .content-left {
      width: 180px;
  }
  .content-section{
      margin-bottom: 20px;
  	  border: solid 1px #eeeeee;
  }
  .content-section:last-child {
      margin-bottom: 0px;
  }
  .content-title {
    text-align: center;
    font-size: 14px;
    padding:8px 0px;
    background-color: #ff4544;
    color: white;
  }
  .content-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 20px 0px;
    padding: 0px 10px;
  }
  .content-tag {
    width: 70px;
    font-size: 14px;
  	text-align: start;
  	color: #999999;
    margin:6px 3px;
    cursor: pointer;
    &:hover {
      color: #ff4544;
    }
  }
  .content-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 10px;
    border-bottom: 1px solid #f4f4f4;
  }
  .content-main:last-child {
    border-bottom: none;
  }
  .content-img {
      width: 90px;
      height: 90px;
      background-color: #dddddd;
      margin:15px;
  }
  .content-name {
    font-size: 14px;
  	font-weight: 600;
  	letter-spacing: -0.8px;
  	color: #333333;
  }
  .content-description {
    font-size: 12px;
  	letter-spacing: -0.7px;
    margin-top: 3px;
  	color: #999999;
  }
  .content-price {
    margin: 15px 0px;
    font-size: 16px;
  	color: #ff4544;
  }
  .content-right {
    width: 1000px;
    margin-left: 20px;
    border: solid 1px #eeeeee;
    .tag-content {
        text-align: center;
        padding: 5px 0px;
        p img {
            width: 100%;
            margin-top: -5px;
        }
        .goods-description {
          margin: 0 90px;
          .description-array {
            .description-columns {
                img {
                    width: 100%;
                }
                p {
                    font-size: 15px;
                    line-height: 14px;
                    margin: 10px 0px;
                }
            }
          }
      }
    }
  }
  .right-tags {
    display: flex;
    flex-direction: row;
    background-color: #eeeeee;

  }
  .tag-name {
    width: 180px;
    text-align: center;
    font-size: 14px;
    padding:8px 0px;
    cursor: pointer;
  }
  .tag-name.active {
    color: #ff4544;
    font-weight: 600;
    background-color: white;
    border-top: 4px solid #ff4544;
  }
  .tag-box {
    height: 400px;
    background-color: #f8f8f8;
  }
  .tag-detail {
      display: flex;
      flex-wrap: wrap;
  }
  .tag-detail-obj {
    width: 270px;
    padding: 30px 30px 10px;
    font-size: 14px;
  	font-weight: normal;
  	font-style: normal;
  	font-stretch: normal;
  	line-height: normal;
  	letter-spacing: normal;
  	text-align: justify;
  	color: #999999;
  }
  .tag-detail-title {
    color:#333333;
    margin-right: 4px;
  }
  .tag-note {
      padding: 50px 30px;
      display: flex;
      flex-direction: row;
      font-size: 14px;
      color:#999999;
      line-height: 1.57;
    	letter-spacing: normal;
    	text-align: justify;
  }
  .note-title {
    width: 80px;
    color:#333333;
  }
  .note-content p {
    margin: 4px 0px;
  }
  .note-content p:first-child {
      margin-top: 0px;
  }
  .tag-img {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tag-img-box {
      height: 250px;
      width: 790px;
      background-color: #eeeeee;
      color: white;
      font-size: 50px;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .tag-box {
      padding:10px;
      border: 2px solid white;
  }
  .area-box {
    position: absolute;
    z-index: 2;
    background-color: white;
    width: 386px;
    min-height: 100px;
    margin-top: -28px;
    margin-left: 80px;
    border: 1px solid #cccccc;
    font-size: 12px;
    .area-tag {
      display: flex;
      flex-direction: row;
      margin-top: 19px;
      margin-left: 15px;
      .area-tag-name {
        padding: 2px;
        text-align: center;
        border: 1px solid #cccccc;
        cursor: pointer;
      }
      .area-tag-null {
        width: 10%;
        display: flex;
        flex-grow: 1;
        height: 24px;
        border-bottom: 1px solid #cccccc;
      }
      .area-little {
        width: 2px;
        height: 24px;
        border-bottom: 1px solid #cccccc;
      }
    }
    .area-info {
      padding: 10px 22px;
      .area-button-group {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .area-button {
          padding: 1px 5px;
        }
        .area-button:hover {
          background-color: #ff4544;
          color: white;
          cursor: pointer;
        }
      }
      .selected {
        background-color: #ff4544;
        color: white;
      }
    }
  }
  .goods-time-style {
    color: #ff4544;
    background-color: white;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.nobottom {
  border-bottom: none !important;
}
</style>
