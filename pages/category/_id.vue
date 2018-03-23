<template>
  <div class="category">
    <div class="wrapper">

      <div class="category__location fn-clear">
        <div class="location__links">
          当前位置：
          <nuxt-link v-if="typeof $route.query.k === 'undefined'" class="location__link" href="javascript:void(0)"
                     :to="{name:'home'}">首页
          </nuxt-link>
          <span v-if="typeof $route.query.k !== 'undefined'">全部搜索结果</span>
          <template v-for="(item, index) in location">
            <gz-icon class-name="location__name" size="10" icon="go"></gz-icon>
            <template v-if="index === location.length - 1">
              {{ item.name }}
            </template>
            <template v-else="">
              <a class="location__link" href="javascript:void(0)" @click="goCategory(item.code)">{{ item.name }}</a>
            </template>
          </template>
        </div>

        <div class="location__conditions" ref="chooseFilter">
          <span class="location__condition" v-for="item in filters">
            {{ item.name }}
            <span class="location__close" @click="removeFilter(item)">
              <gz-icon icon="close" size="8"></gz-icon>
            </span>
          </span>
        </div>

        <div class="fn-right">
          <span v-if="filters.length > 0" class="location__cancel" @click="removeAllFilters">全部撤销</span>
        </div>
      </div>

      <div v-if="typeof $route.query.k !== 'undefined'" class="category__search fn-clear">
        <template v-if="paging.total > 0">
          <span class="search__keyword">{{condition.keyword}}</span> 商品筛选 共{{paging.total}}个商品
        </template>
        <template v-else>
          <gz-icon class-name="search__icon" color="#FF8D00" size="40" icon="no-data"></gz-icon>
          <div class="search__tip">
            抱歉！没有找到与“<span class="search__keyword">{{condition.keyword}}</span>”相关的商品
            <div class="search__suggest">建议您：适当减少筛选条件／调整价格区间／尝试其他关键字</div>
          </div>
        </template>
      </div>

      <div class="category__filter" ref="categoryFilter" v-if="conditions.length > 0">
        <div class="filter__item fn-clear" v-for="(item, index) in conditions">
          <div class="filter__title">{{item.title}}：</div>
          <div class="filter__condition">
            <span @click="addConditions(`${item.type}`, `${c.name}`, `${c.id}`)" class="filter__element"
                  v-for="c in item.condition">{{c.name}}{{ item.type === 4 ? 'kg' : '' }}</span> &nbsp;
          </div>
          <div v-show="false" class="filter__more" @click="toggleMore($event)">更多
            <gz-icon icon="more" size="10" color="#666"></gz-icon>
          </div>
        </div>
      </div>

      <div class="fn-clear">
        <div class="category__choice ft-center" ref="special" v-if="typeof $route.query.k === 'undefined'">
          <div class="category__header">精选商品</div>
          <ul class="choice" v-for="item in special">
            <li class="choice__item" @click="goGood(item.id)">
              <div class="choice__img"
                   :style="{backgroundImage: `url(${item.imageCover})`}"></div>
              <div class="choice__title fn-ellipsis">
                {{ item.name }}
              </div>
              <div class="choice__desc fn-ellipsis">
                {{ item.introduction }}
              </div>
              <div class="choice__price" style="font-family: Hiragino Sans GB, Microsoft Yahei;">
                ¥ {{ item.computedPrice }}
              </div>
            </li>
          </ul>
          <div class="category__no-data" v-if="special.length === 0">
            <gz-icon color="#FF8D00" size="40" icon="no-data"></gz-icon>
            暂无精选
          </div>
        </div>

        <div class="category__goods" ref="goodList"
             v-if="(typeof $route.query.k !== 'undefined' && goodsList.length !== 0) || typeof $route.query.k === 'undefined'"
             :style="typeof $route.query.k !== 'undefined'? 'width: 100%':''">
          <div class="category__header category__order">
            <span class="order__current">排序：</span>
            <span :class="[sort[0].field === 0 ? 'order__current' : '', 'order__item']"
                  @click="updateSort(0)">默认排序</span>
            <span class="order__item" @click="updateSort(2)">
              销量
              <gz-icon :class-name="['order__up', sort[0].field === 2 && !sort[0].isDesc ? 'order__current' : '']"
                       icon="order-up" size="5"></gz-icon>
              <gz-icon :class-name="['order__down', sort[0].field === 2 && sort[0].isDesc ? 'order__current' : '']"
                       icon="order-down" size="5"></gz-icon>
            </span>
            <span class="order__item" @click="updateSort(1)">
              价格
              <gz-icon :class-name="['order__up', sort[0].field === 1 && !sort[0].isDesc ? 'order__current' : '']"
                       icon="order-up" size="5"></gz-icon>
              <gz-icon :class-name="['order__down', sort[0].field === 1 && sort[0].isDesc ? 'order__current' : '']"
                       icon="order-down" size="5"></gz-icon>
            </span>
          </div>

          <div class="goods ft-center fn-clear">
            <div class="category__no-data" v-if="goodsList.length === 0">
              <gz-icon color="#FF8D00" size="40" icon="no-data"></gz-icon>
              抱歉！没有获取到相关的数据哦～
            </div>
            <div v-for="item in goodsList" class="goods__item">
              <goods-item :showDesc="true" :showCollection="true" :item="item"
                          :height="typeof $route.query.k === 'undefined' ? '333px' : '325px'"
                          :width="typeof $route.query.k === 'undefined' ? '249px' : '240px'"/>
            </div>
          </div>

          <div class="category__pagination" v-if="goodsList.length > 0">
            <pagination :paging="paging" @setPage="updatePagination"></pagination>
          </div>

        </div>

        <div v-if="typeof $route.query.k !== 'undefined' && goodsList.length === 0" class="category__recommend">
          <recommend-goods :pageTypeKey="13" :positionKey="9"></recommend-goods>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import axios from '~plugins/axios'
  import GoodsItem from '~components/goods-item'
  import Pagination from '~components/pagination'
  import RecommendGoods from '~components/recommend-goods'
  import { SeoService } from '~/services/seo-service.js'
  import { SeoMixin } from '~/plugins/mixins.js'

  // set default sort rule
  const SORT = [
    {
      'field': 0,
      'isDesc': true
    }
  ]
  const PAGE_SIZE = 20

  const matchData = (data) => {
    let conditionsList = []
    if (data.brands && data.brands.length > 0) {
      conditionsList.push({
        type: 1,
        title: '品牌',
        condition: data.brands
      })
    }

    if (data.priceBounds && data.priceBounds.length > 0) {
      let priceBounds = []
      data.priceBounds.forEach((d) => {
        priceBounds.push({
          name: d,
          id: d
        })
      })
      conditionsList.push({
        type: 2,
        title: '价格',
        condition: priceBounds
      })
    }

    if (data.salesAreas && data.salesAreas.length > 0) {
      let salesAreas = []
      data.salesAreas.forEach((d) => {
        salesAreas.push({
          name: d.name,
          id: d.code
        })
      })
      conditionsList.push({
        type: 3,
        title: '产地',
        condition: salesAreas
      })
    }

    if (data.weights && data.weights.length > 0) {
      let weights = []
      data.weights.forEach((d) => {
        weights.push({
          name: d,
          id: d
        })
      })
      conditionsList.push({
        type: 4,
        title: '质量',
        condition: weights
      })
    }

    return conditionsList
  }

  export default {
    mixins: [SeoMixin],
    async asyncData ({ params, query }) {
      let location = []
      let searchConditions = []
      let response = []
      let special = []
      let seoInfo
      const id = params.id ? params.id : ''
      const k = query.k ? query.k : ''
      let pageTypeKey
      if (k) {
        pageTypeKey = 13 // 搜索结果页
        try {
          seoInfo = await SeoService.getSeoInfo({ pageTypeKey })
        } catch (e) {
          throw e
        }
      } else {
        let info = {}
        try {
          info = await SeoMixin.asyncData()
        } catch (e) {
          throw e
        }
        if (info.seoInfo) {
          seoInfo = info.seoInfo
        }
      }
      if (params.id) {
        try {
          location = await axios.get(`/goods/category/${params.id}/ancestors`)
        } catch (error) {
          this.$store.commit('common/setMessage', error.response.data)
        }
      }

      try {
        searchConditions = await axios.post('/goods/searchcondition', {
          categoryCode: id,
          keyword: k,
          brandIds: [],
          minPrice: '',
          maxPrice: '',
          salesAreaCodes: [],
          weights: []
        })
      } catch (error) {
        this.$store.commit('common/setMessage', error.response.data)
        searchConditions = {
          data: {
            data: []
          }
        }
      }

      try {
        response = await axios.post('/goods', {
          paging: {
            pageSize: PAGE_SIZE,
            pageIndex: 1
          },
          sort: SORT,
          condition: {
            keyword: k,
            categoryCode: id
          }
        })
      } catch (error) {
        this.$store.commit('common/setMessage', error.response.data)
      }

      try {
        if (typeof query.k === 'undefined') {
          special = await axios.get(`/goods/special?categoryCode=${id}`)
          special.data.data.forEach(data => {
            if (!data.imageCover || data.imageCover === '') {
              data.imageCover = '/img/default-img.jpg'
            }
          })
        }
      } catch (error) {
        this.$store.commit('common/setMessage', error.response.data)
      }

      return {
        condition: {
          keyword: k,
          categoryCode: id,
          brandIds: [],
          salesAreaCodes: [],
          weights: [],
          minPrice: '',
          maxPrice: ''
        },
        special: special.data ? special.data.data : [],
        goodsList: response.data.data.itemList,
        paging: response.data.data.paging,
        location: location.data ? location.data.data : [],
        conditions: matchData(searchConditions.data.data),
        seoInfo
      }
    },
    components: {
      [GoodsItem.name]: GoodsItem,
      Pagination,
      [RecommendGoods.name]: RecommendGoods
    },
    data () {
      return {
        isLoading: false,
        sort: SORT,
        paging: {
          currentPage: 1,
          pageSize: PAGE_SIZE,
          pageCount: 1
        },
        location: [],
        special: [],
        conditions: [],
        filters: [],
        goodsList: [],
        condition: {}
      }
    },
    watch: {
      conditions () {
        setTimeout(() => {
          this.setFilterMore()
        })
      },
      location () {
        setTimeout(() => {
          this.setChooseFilterWidth()
        })
      },
      special () {
        this.setMaxHeight()
      },
      goodsList () {
        this.setMaxHeight()
      }
    },
    methods: {
      setMaxHeight () {
        if (!this.$refs.goodList) {
          return
        }
        this.$nextTick(() => {
          this.$refs.goodList.style.height = 'auto'
          if (typeof this.$route.query.k !== 'undefined') {
            return
          }
          this.$refs.special.removeAttribute('style')
          if (this.$refs.special.clientHeight >= this.$refs.goodList.clientHeight) {
            this.$refs.goodList.style.height = this.$refs.special.clientHeight + 'px'
          } else {
            this.$refs.special.style.height = this.$refs.goodList.clientHeight + 'px'
          }
        })
      },
      goGood (id) {
        window.open(`/goods/${id}`)
        // 同窗口打开时使用
//        this.$store.commit('common/setKeywords', '')
//        this.$router.push(`/goods/${id}`)
      },
      goCategory (code) {
        this.$store.commit('common/setKeywords', '')
        if (code) {
          this.$router.push(`/category/${code}`)
          this.$store.commit('common/setBreadCrumbVisibility', false)
        }
      },
      updatePagination (currentPage) {
        if (this.isLoading) {
          return false
        }
        this.paging.currentPage = currentPage
        this.update()
      },
      updateSort (field) {
        if (this.isLoading || (this.sort[0].field === 0 && field === 0)) {
          return false
        }
        const sort = {
          'field': field
        }

        if (field === 0) {
          sort.isDesc = true
        } else {
          sort.isDesc = !this.sort[0].isDesc
        }

        this.sort = [sort]

        this.update()
      },
      update () {
        if (!this.paging) {
          return false
        }
        this.isLoading = true
        this.$store.dispatch('category/getCategoryList', {
          paging: {
            pageSize: PAGE_SIZE,
            pageIndex: this.paging.currentPage
          },
          sort: this.sort,
          condition: this.condition
        }).then((res) => {
          this.goodsList = res.itemList
          this.paging = res.paging
          this.isLoading = false
        })
      },
      removeFilter (obj) {
        this.filters.forEach((data, index) => {
          if ((data.name === obj.name && obj.id === data.id)) {
            this.filters.splice(index, 1)
          }

          switch (obj.type) {
            case '1':
              this.condition.brandIds.forEach((data, index) => {
                if (data === obj.id) {
                  this.condition.brandIds.splice(index, 1)
                }
              })
              break
            case '2':
              this.condition.minPrice = ''
              this.condition.maxPrice = ''
              break
            case '3':
              this.condition.salesAreaCodes.forEach((data, index) => {
                if (data === obj.id) {
                  this.condition.salesAreaCodes.splice(index, 1)
                }
              })
              break
            case '4':
              this.condition.weights.forEach((data, index) => {
                if (data === obj.id) {
                  this.condition.weights.splice(index, 1)
                }
              })
              break
            default:
              break
          }
        })

        this.update()
      },
      removeAllFilters () {
        this.filters = []
        this.condition.brandIds = []
        this.condition.minPrice = ''
        this.condition.maxPrice = ''
        this.condition.salesAreaCodes = []
        this.condition.weights = []

        this.update()
      },
      addConditions (type, name, id) {
        let isExit = false
        switch (type) {
          case '1':
            this.condition.brandIds.forEach((data) => {
              if (id === data) {
                isExit = true
              }
            })
            if (!isExit) {
              this.condition.brandIds.push(id)
            }

            break
          case '2':
            const prices = name.split('-')
            this.condition.minPrice = prices[0]
            this.condition.maxPrice = prices[1]

            this.filters.forEach((data, index) => {
              if (data.type === '2') {
                if (data.name !== name) {
                  this.filters.splice(index, 1)
                  isExit = false
                } else {
                  isExit = true
                }
              }
            })
            break
          case '3':
            this.condition.salesAreaCodes.forEach((data) => {
              if (id === data) {
                isExit = true
              }
            })
            if (!isExit) {
              this.condition.salesAreaCodes.push(id)
            }
            break
          case '4':
            this.condition.weights.forEach((data) => {
              if (name === data) {
                isExit = true
              }
            })
            if (!isExit) {
              this.condition.weights.push(name)
            }
            break
          default:
            break
        }

        if (!isExit) {
          this.filters.push({ name, id, type })
          this.filters = Array.from(new Set(this.filters))
          this.paging.currentPage = 1
          this.update()
        }
      },
      toggleMore (event) {
        const currentE = event.currentTarget
        if (currentE.parentElement.style.height === 'auto') {
          currentE.parentElement.style.height = '20px'
          currentE.previousElementSibling.style.overflow = 'visible'
          currentE.innerHTML = '更多 <svg class="gz-icon" style="width:10px;height:10px;color:#666;"><use xlink:href="#icon-more"></use></svg>'
          return
        }
        currentE.parentElement.style.height = 'auto'
        currentE.previousElementSibling.style.overflow = 'auto'
        currentE.innerHTML = '收起 <svg class="gz-icon" style="width:10px;height:10px;color:#666;"><use xlink:href="#icon-less"></use></svg>'
      },
      setFilterMore () {
        // set filter more
        const filters = this.$refs.categoryFilter ? this.$refs.categoryFilter.children : []
        for (let i = 0; i < filters.length; i += 1) {
          if (filters[i].scrollHeight > 22) {
            filters[i].querySelector('.filter__more').style.display = 'block'
          } else {
            filters[i].querySelector('.filter__more').style.display = 'none'
          }
        }
      },
      setChooseFilterWidth () {
        const chooseFilter = this.$refs.chooseFilter
        const width = 1100 - chooseFilter.previousElementSibling.offsetWidth
        chooseFilter.style.width = `${width}px`
      }
    },
    mounted () {
      // set keyword
      this.$store.commit('common/setKeywords', this.condition.keyword)
      this.setFilterMore()
      this.setMaxHeight()
      this.setChooseFilterWidth()
    }
  }
</script>
