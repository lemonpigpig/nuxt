<template>
  <div class="museum-all" id="museum-all">
    <div class="wrapper">
      <div class="museum-selected" v-if="currentCity">
          <span class="selected-name">{{currentCity.name}}</span>
          <span class="selected-icon" @click="select(currentCity)"><gz-icon icon="close" size="8"></gz-icon></span>
      </div>
    </div>
    <div class="wrapper">
      <div class="museum-city">
          <div class="museum-city-title">区域：</div>
          <div class="museum-city-group">
            <div class="museum-city-button" :class="{selected: currentCity === city}" v-for="city in cityList" @click="select(city)">{{city.name}}</div>
          </div>
      </div>
      <div class="museum-content">
          <div class="museum-item-null" v-if="!getHotMuseums || getHotMuseums.length === 0">暂无数据</div>
          <div class="museum-item-margin" v-for="item in getHotMuseums">
              <museum-abstract :museumItem="item" @getMuseum="getMuseumAndGo"></museum-abstract>
          </div>
      </div>
      <div class="category__pagination" v-if="getMuseumsPaging && getMuseumsPaging.total > 0">
        <pagination :paging="getMuseumsPaging" @setPage="updatePagination"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Museum from '~components/biz/museum'
import Pagination from '~components/pagination'
import { SeoService } from '~/services/seo-service.js'
import { SeoMixin } from '~/plugins/mixins.js'

export default {
  mixins: [SeoMixin],
  components: {
    [Museum.MuseumAbstract.name]: Museum.MuseumAbstract,
    [Museum.MuseumDetail.name]: Museum.MuseumDetail,
    Pagination
  },
  async asyncData ({ params }) {
    try {
      return { seoInfo: await SeoService.getSeoInfo({ pageTypeKey: 28 }) }
    } catch (e) {
      throw e
    }
  },
  data () {
    return {
      currentCity: '',
      queryBody: {
        paging: {
          pageSize: 12,
          pageIndex: 1
        },
        sort: [
          {
            field: 0,
            isDesc: true
          }
        ],
        condition: {}
      }
    }
  },
  methods: {
    select (city) {
      this.queryBody.paging.pageIndex = 1
      if (this.currentCity === city) {
        this.$set(this, 'currentCity', '')
        this.queryMuseums()
      } else {
        this.$set(this, 'currentCity', city)
        var params = {
          code: city.code,
          body: this.queryBody
        }
        this.$store.dispatch('museums/getMuseumsByCitycode', params)
      }
    },
    getMuseumAndGo (museumInfo) {
      window.open(`/museums/${museumInfo.id}`)
    },
    updatePagination (index) {
      if (index) {
        this.queryBody.paging.pageIndex = index
        this.queryMuseums()
      }
    },
    queryMuseums () {
      this.$store.dispatch('museums/getNewMuseums', this.queryBody).then(() => {
        window.scrollTo(0, 0)
      })
    }
  },
  computed: {
    cityList () {
      return this.$store.state.common.secondLevelAreaList
    },
    getHotMuseums () {
      return this.$store.state.museums.hotMuseums
    },
    getMuseumsPaging () {
      return this.$store.state.museums.museumsPaging
    }
  },
  mounted () {
    this.$store.commit('common/setCurrentActivePage', this.$route.name.split('-')[0])
    this.$store.commit('common/setBreadCrumbVisibility', true)
    this.$store.commit('common/setBreadCrumbList', [{
      name: '一县一馆',
      url: '/museums'
    }, {
      name: '所有馆'
    }])
    if (!this.cityList || this.cityList.length === 0) {
      var code = 53
      var level = 2
      var params = {
        level: level,
        code: code
      }
      this.$store.dispatch('common/getLevelAreaByCode', params)
    }
    this.queryMuseums()
  }
}
</script>

<style lang="less">
#museum-all {
  padding:0px 0px 30px;
  background-color: #f4f4f4;
  .museum-city {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 20px 0px 5px;
    border-bottom: 1px solid #dddddd;
    .museum-city-title {
      width: 60px;
      margin-top: 4px;
      font-size: 12px;
    }
    .museum-city-group {
      display: flex;
      flex-wrap: wrap;
      .museum-city-button {
        padding: 3px 10px;
        border: solid 1px #979797;
        font-size: 12px;
        margin-right: 10px;
        margin-bottom: 15px;
        cursor: pointer;
      }
    }
  }
  .museum-content {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .museum-item-margin {
      margin: 20px 0px;
    }
    .museum-item-margin:nth-child(3n-1) {
        margin-left: 45px;
        margin-right: 45px;
    }
    .museum-item-null {
      width: 100%;
      text-align: center;
      margin-top: 20px;
    }
  }
  .selected {
    background-color: #ff4544;
    color: white;
    border: none !important;
  }
  .museum-selected {
    position: absolute;
    display: flex;
    margin-top: -69px;
    margin-left: 200px;
    font-size: 12px;
    color: #666666;
    border: solid 1px #ff4544;
    .selected-name {
      padding: 2px 10px;
    }
    .selected-icon {
      width: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background-color: #ff4544;
      cursor: pointer;
    }
  }
}
</style>
