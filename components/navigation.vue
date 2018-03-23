<template>
  <div class="navigation">
    <div class="wrapper">
      <div v-if="$route.name !== 'category-first'"
           class="navigation__category"
           @mouseleave="hideCategory()"
           @mouseenter="showCategory()">
        全部商品分类
        <span class="category__sub-title">All</span>
        <div class="category__one-level"
             @mouseleave="resetIcon()"
             v-show="$store.state.common.showCategory">
          <div class="one-level__item" v-for="item in category"
               :class="{'one-level__item--current': currentCode === item.code}"
               @mouseenter="getSubCategories(item.code)"
               @mouseleave="resetIcon(item.code)">
            <div class="fn-clear">
              <span class="one-level__icon"
                    :style="{backgroundImage: `url(${item.currenticon})`}"
              ></span>
              <a class="one-level__title" :href="`/category/first?code=${item.code}`" target="_blank">{{item.name}}</a>
              <gz-icon icon="less"></gz-icon>
            </div>
            <div class="one-level__links fn-ellipsis">
              <a class="one-level__link" v-for="(sub, index) in item.subCategories"
                 :href="`/category/${sub.code}`" target="_blank" v-if="index < 4">{{sub.name}}</a>
            </div>
          </div>
          <div class="category__two-level"
               @mouseleave="currentCode = ''">
            <div class="two-level__item fn-clear" v-for="sub in twoLevel">
              <a class="two-level__title" :href="`/category/${sub.code}`" target="_blank"">{{sub.name}}</a>
              <span class="two-level__links" v-if="sub.subCategories">
                <a class="two-level__link" :href="`/category/${leaf.code}`" target="_blank"
                   v-for="leaf in sub.subCategories">{{leaf.name}}</a>
              </span>
            </div>

            <div class="two-level__goods">
              <div class="good" v-for="item in []">
                <div class="good__img" v-dpr=""
                     style="background-image:url(//10.66.30.40:1024/public/img/banner.png);"></div>
                <div class="good__title">沙发大方</div>
                <div class="good__description">阿水淀粉</div>
                <div class="good__tag">DSDFWSDF</div>
                <gz-icon icon="go"></gz-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$route.name === 'category-first'"
           class="navigation__category navigation__category--first"
           @mouseleave="hideCategory()"
           @mouseenter="showCategory()">
        {{ $store.state.common.firstCategory.name ? $store.state.common.firstCategory.name.substr(0, 10) : '' }}
        <div class="category__one-level"
             v-show="$store.state.common.showCategory"
             @mouseleave="currentCode = ''">
          <div class="one-level__item one-level__item--first"
               v-for="(item, fIndex) in $store.state.common.firstCategory.subCategories"
               v-if="fIndex < 7"
               :class="{'one-level__item--current': currentCode === item.code}"
               @mouseenter="getSubCategories(item.code)"
               @mouseleave="resetIcon(item.code)">
            <div class="fn-clear">
              <a class="one-level__title" :href="`/category/${item.code}`" target="_blank">{{item.name}}</a>
              <gz-icon icon="less"></gz-icon>
            </div>
            <div class="one-level__links fn-ellipsis">
              <a class="one-level__link" v-for="(sub, index) in item.subCategories"
                 :href="`/category/${sub.code}`" target="_blank" v-if="index < 4">{{sub.name}}</a>
            </div>
          </div>
          <div class="category__two-level"
               @mouseleave="currentCode = ''">
            <div class="two-level__item fn-clear">
              <span class="two-level__links">
                <a class="two-level__link" v-for="sub in twoLevel"
                   :href="`/category/${sub.code}`" target="_blank">{{sub.name}}</a>
              </span>
            </div>

            <div class="two-level__goods">
              <div class="good" v-for="item in []">
                <div class="good__img" v-dpr=""
                     style="background-image:url(//10.66.30.40:1024/public/img/banner.png);"></div>
                <div class="good__title">沙发大方</div>
                <div class="good__description">阿水淀粉</div>
                <div class="good__tag">DSDFWSDF</div>
                <gz-icon icon="go"></gz-icon>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="navigation__links">
        <div class="navigation__link" @click="resetCategory('home')">
          <nuxt-link class="navigation__link--color" target="_blank"
                     :class="{'navigation__link--current': $store.state.common.currentActivePage==='home' ||
                        $store.state.common.currentActivePage === 'index'}"
                     :to="{name:'home'}">首页
          </nuxt-link>
        </div>
        <div class="navigation__link" @click="resetCategory()">
          <nuxt-link class="navigation__link--color" target="_blank"
                     :class="{'navigation__link--current': $store.state.common.currentActivePage==='museums'}"
                     :to="{name:'museums'}">一县一馆
          </nuxt-link>
        </div>
        <div class="navigation__link" @click="resetCategory()">
          <nuxt-link class="navigation__link--color" target="_blank"
                     :class="{'navigation__link--current': $store.state.common.currentActivePage==='origin'}"
                     :to="{name:'origin'}">溯源
          </nuxt-link>
        </div>
        <div class="navigation__link" @click="resetCategory()">
          <nuxt-link class="navigation__link--color" target="_blank"
                     :class="{'navigation__link--current': $store.state.common.currentActivePage==='flashsale'}"
                     :to="{name:'flashsale'}">限时抢购
          </nuxt-link>
        </div>
        <!--    :class="{'navigation__link--current': $store.state.common.currentActivePage===''}" -->
        <div class="navigation__link" @click="resetCategory()" v-for="item in menuList">
          <nuxt-link class="navigation__link--color" target="_blank"
                     :class="{'navigation__link--current': $store.state.common.currentActivePage=== item.shortTitle}"
                     :to="{path: `/promotion/${item.shortTitle}`}">{{item.title}}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        category: [],
        twoLevel: [],
        menuList: [],
        currentCode: ''
      }
    },
    methods: {
      resetCategory (routerName) {
        this.$set(this, 'category', this.category.map(data => Object.assign({}, data, {
          currenticon: data.icon === '' ? '/img/category-icon.svg' : data.icon
        })))
      },
      showCategory () {
        this.$store.commit('common/setShowCategory', true)
      },
      hideCategory () {
        if (this.$route.name !== 'index' && this.$route.name !== 'home' && this.$route.name !== 'category-first') {
          this.$store.commit('common/setShowCategory', false)
        }
      },
      // 当前页面打开时使用
      goCategory (code, name) {
        this.$store.commit('common/setKeywords', '')
        this.$store.commit('common/setCurrentActivePage', 'category')

        if (name) {
          this.category.forEach((data) => {
            if (data.code === code) {
              this.setFirstCategory(data)
            }
          })
          this.$router.push(`/category/first?code=${code}`)
          return
        }

        this.resetCategory()
        this.$router.push(`/category/${code}`)
      },
      getSubCategories (code) {
        this.currentCode = code

        if (this.$route.name !== 'category-first') {
          this.category.forEach((data) => {
            if (data.code === code) {
              this.twoLevel = data.subCategories
              data.currenticon = data.hoverIcon === '' ? '/img/category-icon-hover.svg' : data.hoverIcon
            } else {
              data.currenticon = data.icon === '' ? '/img/category-icon.svg' : data.icon
            }
          })
        } else {
          this.$store.commit('common/setFirstCategory', { code: '', hoverCode: code })
          this.$store.state.common.firstCategory.subCategories.forEach((data) => {
            if (data.code === code) {
              this.twoLevel = data.subCategories
            }
          })
        }
      },
      resetIcon (code) {
        if (this.$route.name !== 'category-first') {
          if (code) {
            this.category.forEach((data) => {
              if (data.code === code) {
                data.currenticon = data.icon === '' ? '/img/category-icon.svg' : data.icon
              }
              if (data.code === code && this.currentCode === code) {
                data.currenticon = data.icon === '' ? '/img/category-icon-hover.svg' : data.hoverIcon
              }
            })
          } else {
            this.currentCode = ''
            this.category.forEach((data) => {
              data.currenticon = data.icon === '' ? '/img/category-icon.svg' : data.icon
            })
          }
        } else {
          this.$store.commit('common/setFirstCategory', { code: '', hoverCode: '' })
        }
      },
      setFirstCategory (data) {
        this.$store.commit('common/setFirstCategory', { code: data.code, hoverCode: '' })
      }
    },
    mounted () {
      // get category
      this.$store.dispatch('common/getCategory').then((res) => {
        res.forEach((data) => {
          if (data.code === this.$route.query.code) {
            this.setFirstCategory(data)
          }
          data.currenticon = data.icon === '' ? '/img/category-icon.svg' : data.icon
        })
        this.category = res.splice(0, 10)
      })
      this.$store.dispatch('common/getTopic', { IsMenu: true }).then((data) => {
        this.$set(this, 'menuList', data.slice(0, 3).map(item => Object.assign({}, item)))
      })

      if (this.$route.name === 'index' || this.$route.name === 'home' || this.$route.name === 'category-first') {
        // first, index, home show category
        this.$store.commit('common/setShowCategory', true)
      }
    }
  }
</script>
