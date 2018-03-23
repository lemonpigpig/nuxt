import Vue from 'vue'

const getRecommendGoods = ({ pageTypeKey, positionKey }) => {
  return Vue.axios.post(`/goods/recommend`, {
    paging: {
      pageSize: 10,
      pageIndex: 1
    },
    sort: [
      { field: 2,
        isDesc: false
      }
    ],
    condition: {
      pageTypeKey,
      positionKey,
      DisplayCategoryId: '',
      FeatureMuseumId: 0
    }
  })
  .then((res) => {
    if (res.data && res.data.itemList && res.data.itemList.length > 0) {
      return res.data.itemList.map(i => Object.assign(i, {
        imageCover: i.goodsImage,
        stock: i.availableStock
      }))
    }
    return []
  })
  .catch((e) => {
    throw e
  })
}
const addGoodsToFavorite = (data) => Vue.axios.post(`/goods/favorite`, data)
const deleteSingleFavoriteGoods = (id) => Vue.axios.delete(`/goods/favorite/deleteByGoodsId/${id}`)

export default {
  getRecommendGoods,
  addGoodsToFavorite,
  deleteSingleFavoriteGoods
}
