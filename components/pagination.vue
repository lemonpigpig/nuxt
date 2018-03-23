<template>
  <div v-if="paging">
    <div v-if="paging.currentPage > 1" class="pagination__page"
         @click="updatePagination(paging.currentPage - 1)">上一页
    </div>

    <div v-if="paging.currentPage - 4 > 0" class="pagination__page"
         @click="updatePagination(1)">1
    </div>

    <div v-if="paging.currentPage - 5 > 0" class="pagination__text">...</div>

    <div v-if="paging.currentPage - 3 > 0" class="pagination__page"
         @click="updatePagination(paging.currentPage - 3)">{{paging.currentPage - 3}}
    </div>
    <div v-if="paging.currentPage - 2 > 0" class="pagination__page"
         @click="updatePagination(paging.currentPage - 2)">{{paging.currentPage - 2}}
    </div>
    <div v-if="paging.currentPage - 1 > 0" class="pagination__page"
         @click="updatePagination(paging.currentPage - 1)">{{paging.currentPage - 1}}
    </div>

    <div class="pagination__page pagination__page--current">{{paging.currentPage}}</div>

    <div v-if="paging.currentPage < paging.pageCount" class="pagination__page"
         @click="updatePagination(paging.currentPage + 1)">{{paging.currentPage + 1}}
    </div>
    <div v-if="paging.currentPage + 1 < paging.pageCount" class="pagination__page"
         @click="updatePagination(paging.currentPage + 2)">{{paging.currentPage + 2}}
    </div>

    <div v-if="paging.currentPage + 3 < paging.pageCount" class="pagination__text">...</div>
    <div v-if="paging.currentPage + 2 < paging.pageCount"
         :class="['pagination__page', paging.currentPage + 3 == paging.pageCount ? '' : 'pagination__page--nomargin']"
         @click="updatePagination(paging.pageCount)">
      {{paging.pageCount}}
    </div>

    <div v-if="paging.currentPage < paging.pageCount" class="pagination__page"
         @click="updatePagination(paging.currentPage + 1)">下一页
    </div>

    <div class="pagination__text">共{{paging.pageCount}}页</div>
    <div class="pagination__text">到第</div>
    <input min="1" type="number" class="pagination__input" v-model="pageInput" @keyup.13k="updatePagination(pageInput)"/>
    <div class="pagination__text">页</div>
    <button class="pagination__page" @click="updatePagination(pageInput)">确定</button>
  </div>
</template>
<script>
  export default {
    props: ['paging'],
    data () {
      return {
        pageInput: this.paging.currentPage
      }
    },
    methods: {
      updatePagination (currentPage) {
        var index = parseInt(currentPage)
        if (isNaN(parseInt(index)) || (!isNaN(parseInt(index)) && (index < 1 || index > this.paging.pageCount))) {
          this.pageInput = this.paging.currentPage
          return false
        }

        this.pageInput = currentPage
        this.paging.currentPage = parseInt(index)
        this.$emit('setPage', index)
      }
    }
  }
</script>
