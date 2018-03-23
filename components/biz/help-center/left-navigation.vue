<template>
<aside class="left-nav">
  <nav v-for="category in categoryList" v-bind:key="category.id" class="category">
    <h3 class="category-name">{{category.name}}</h3>
    <ul>
      <li v-for="page in category.pages" v-bind:key="page.id" class="title" >
        <a class="title-link" :href="page.id | helpCenterLink" @click.prevent="openPageDetail(page.id)" :class="{active: currentPageId === page.id}">{{page.title}}</a>
      </li>
    </ul>
  </nav>
</aside>
</template>

<script>
export default {
  name: 'left-navigation',
  props: {
    categoryList: {
      type: Array,
      required: true
    },
    currentPageId: String
  },
  methods: {
    openPageDetail (pageId) {
      // this.$set(this, 'currentPageId', pageId)
      this.$emit('open-page-detail', pageId)
    }
  },
  filters: {
    helpCenterLink (id) {
      return `/help-center/${id}`
    }
  }
}
</script>

<style lang="less">
.left-nav{
  padding: 20px 0 105px 20px;
  .category{
    padding: 0 0 35px;
    .category-name {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    .title {
      font-size: 12px;
      line-height: 1.5;
      color: #666;
      .title-link {
        color: #666;
        &:hover {
          text-decoration: none;
          color: #ff4544;
        }
      }
      .active {
        color: #ff4544;
      }
    }
    // .title:hover {
    //   cursor: pointer;

    // }
  }
}
</style>
