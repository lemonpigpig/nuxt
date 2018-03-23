<template>
  <div @click="hideCoupons(false)" v-loading="isLoading">
    <mainheader/>
    <navigation v-if="showNavigation"/>
    <!-- 不需要breadcrumb的话，页面里掉 this.$store.commit('common/setBreadCrumbVisibility', false) 一下就好 -->
    <bread-crumb v-if="showBreadCrumb" :bread-crumb="breadCrumbList"/>
    <nuxt/>
    <my-footer/>
    <sidebar ref="globleSidebar"/>
    <message-modal ref="globleMessage" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Navigation from '~components/navigation'
import Mainheader from '~components/main-header'
import BreadCrumb from '~components/biz/breadcrumb'
import MyFooter from '~components/footer.vue'
import Sidebar from '~components/sidebar.vue'
import messageModal from '~components/message-modal'
import Loading from '~components/loading'

export default {
  components: {
    MyFooter,
    Navigation,
    BreadCrumb,
    Mainheader,
    Sidebar,
    messageModal,
    Loading
  },
  computed: {
    showBreadCrumb () {
      return this.$store.state.common.showBreadCrumb
    },
    breadCrumbList () {
      return this.$store.state.common.breadCrumbList
    },
    showNavigation () {
      return this.$store.state.common.showNavigation
    }
  },
  beforeMount () {
    this.$store.dispatch('authorization/syncSession')
  },
  methods: {
    ...mapActions({ getFavoritesGoodsItemList: 'account/getFavoritesGoodsItemList' }),
    hideCoupons (status) {
      this.$refs.globleSidebar.couponsShow(status)
    }
  },
  directives: {
    loading: {
      bind:
    }
  },
  mounted () {
    // this.getFavoritesGoodsItemList()
    // .then((res) => {
    //   console.log(res)
    // })
    // .catch((err) => {
    //   console.log(err)
    // })
  }
}
</script>
