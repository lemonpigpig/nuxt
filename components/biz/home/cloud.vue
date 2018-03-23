<template lang="html">
  <div class="cloud-template" >
    <div class="template" v-for="(item, index) in goodList.tags" v-if="index == 0">
      <div class="template-title" v-if="goodList.pageTemplate != 14">
        <div class="title-left">
          <span class="title-name">{{goodList.title}}</span>
          <span>|</span>
          <span class="title-content">{{item.name}}</span>
          <ul class="cloud-category">
            <li class="category1" v-for="(child,index) in item.txtLinks" v-if="child.name != '查看更多'"><a target="_blank"  :href="child.linkUrl">{{child.name}}</a></li>
          </ul>
        </div>
        <div v-if="item.txtLinks.length > 1 && item.txtLinks[item.txtLinks.length - 1].name == '查看更多'">
          <a class="more-sale" target="_blank" :href="item.txtLinks[item.txtLinks.length - 1].linkUrl">查看更多</a>
        </div>
      </div>

      <div class="template-title first-title white" :style="{background : (goodList.tags[1] ? goodList.tags[1].name : '#ff4544')}" v-if="goodList.pageTemplate == 14">
        <div class="title-left" style="padding-left: 30px">
          <span class="title-name white">{{goodList.title}}</span>
          <span class="title-content white">{{item.name}}</span>
        </div>
        <div>
          <ul class="cloud-category">
            <li class="category1 white" v-for="child in item.txtLinks"><a target="_blank"  :href="child.linkUrl" >{{child.name}}</a></li>
          </ul>
          <!-- <span class="more-sale">查看更多</span> -->
        </div>
      </div>

      <div class="template-content" v-if="goodList.pageTemplate == 17 || goodList.pageTemplate == 14">
          <div class="content-left" v-for="child in item.advertisements">
            <img :src="child.imgs" alt="" @click="goUrl(child)">
          </div>
          <div class="content-right">
            <div v-for="(goods, index) in item.goods" v-if="index < 8">
              <goods-item :showDesc="false" :item="goods" @getGoodsDetail="goGoodsDetail"/>
            </div>
          </div>
      </div>
      <!-- 模板2 上2图 下4商品 -->
      <div class="template-content" v-if="goodList.pageTemplate == 18">
          <div class="content-left">
            <img :src="item.advertisements[0].imgs" alt="" @click="goUrl(item.advertisements[0])">
          </div>
          <div class="content-right">
            <div class="content-top">
              <div class="top-img" >
                <img class="top-img-class" :src="item.advertisements[1].imgs" alt="" @click="goUrl(item.advertisements[1])">
                <img class="top-img-class" :src="item.advertisements[2].imgs" alt="" @click="goUrl(item.advertisements[2])">
              </div>
            </div>
            <div class="content-bottom">
              <div v-for="(goods, index) in item.goods" v-if="index < 4">
                <goods-item :showDesc="false" :item="goods"/>
              </div>
            </div>
          </div>
      </div>
      <!-- 模板3 左3图 右6商品 -->
      <div class="template-content" v-if="goodList.pageTemplate == 19">
          <div class="content-left template7">
            <img :src="item.advertisements[0].imgs" alt="" class="width-300" @click="goUrl(item.advertisements[0])">
            <div class="left-img">
              <img class="left-img-class" :src="item.advertisements[1].imgs" alt="" @click="goUrl(item.advertisements[1])">
              <img class="left-img-class" :src="item.advertisements[2].imgs" alt="" @click="goUrl(item.advertisements[2])">
            </div>
          </div>
          <div class="content-right template7-right">
            <div v-for="(goods, index) in item.goods" v-if="index < 6">
              <goods-item :showDesc="false" :item="goods"/>
            </div>
          </div>
      </div>
      <!-- 模板4 上1图 下6商品 -->
      <div class="template-content" v-if="goodList.pageTemplate == 20">
          <div class="content-top" v-for="child in item.advertisements">
            <img class="top-one-img" :src="child.imgs" alt="" @click="goUrl(child)">
          </div>
          <div class="content-bottom">
            <div v-for="(goods, index) in item.goods" v-if="index < 6">
              <goods-item :showDesc="false" :item="goods"/>
            </div>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
import GoodsItem from '~components/goods-item'
import generateBannerUri from '~/plugins/banner-url.js'

export default {
  name: 'cloud-template',
  data () {
    return {
      // goodsList: []
      itemList: [
        {id: 4379079202021376, goodsName: '冻干蜂蜜柠檬片 60克', introduction: '微酸果蜜 清心润心', salePrice: 36.01, stock: 10},
        {id: 4379079202021376, goodsName: '冻干蜂蜜柠檬片 60克', introduction: '微酸果蜜 清心润心', salePrice: 36.02, stock: 0},
        {id: 4379079202021376, goodsName: '冻干蜂蜜柠檬片 60克', introduction: '微酸果蜜 清心润心', salePrice: 36.03, stock: 12},
        {id: 4379079202021376, goodsName: '冻干蜂蜜柠檬片 60克', introduction: '微酸果蜜 清心润心', salePrice: 36.04, stock: 4},
        {id: 4379079202021376, goodsName: '冻干蜂蜜柠檬片 60克', introduction: '微酸果蜜 清心润心', salePrice: 36.05, stock: 42},
        {id: 4379079202021376, goodsName: '冻干蜂蜜柠檬片 60克', introduction: '微酸果蜜 清心润心', salePrice: 36.06, stock: 234},
        {id: 4379079202021376, goodsName: '冻干蜂蜜柠檬片 60克', introduction: '微酸果蜜 清心润心', salePrice: 36.07, stock: 0},
        {id: 4379079202021376, goodsName: '冻干蜂蜜柠檬片 60克', introduction: '微酸果蜜 清心润心', salePrice: 36.08, stock: 31}
      ]
    }
  },
  props: {
    goodList: {}
  },
  components: {
    [GoodsItem.name]: GoodsItem
  },
  methods: {
    goGoodsDetail (item) {
      var id = item.goodsId || item.id
      window.open(`/goods/${id}`)
      // this.$router.push(`/goods/${id}`)
    },
    goUrl (item) {
      if (generateBannerUri(item.module, item.linkUrl)) {
        window.open(generateBannerUri(item.module, item.linkUrl))
        // this.$router.push(generateBannerUri(item.module, item.linkUrl))
      } else {

      }
    },
    goCategory (item) {
      window.open(`/category?k=${item.name}`)
      // this.$router.push(`/category?k=${item.name}`)
    }
  }
}
</script>

<style lang="less">
.cloud-template{
  .template{
    width: 1200px;
    margin: 0 auto;
    background: white;
    .first-title{
      // background: url('~assets/img/Group 148.png');
      .cloud-category{
        display: flex;
        .category1{
          width: 70px;
          height: 26px;
          border: solid 1px rgba(255, 255, 255, 0.25);
          color: white;
          text-align: center;
          margin-right: 14px;
          a{
            color: white;
            line-height: 26px;
            font-size: 14px;
            font-weight: 500;
          }
        }

      }
    }
    .white{
      color: white !important;
    }
    .template-title{
       height: 50px;
       width: 100%;
       background:  #f4f4f4;
       display: flex;
       align-items: center;
       justify-content: space-between;
       .title-left{
         display: flex;
         padding-left: 10px;
         align-items: baseline;
         .title-name{
           display: flex;
           align-items: center;
           font-size: 22px;
           color: #333333;
           margin-right: 10px;
         }
         ul.cloud-category>li:last-child>a::after{
          display:none !important;
          }
         ul.cloud-category{
           list-style: none;
           display: flex;
           margin-left: 96px;
           li.category1{
             a{
               font-size: 14px;
                color: #333333;
                text-decoration: none;
             }
             a:hover{
               color: #ff4544;
             }
           }
            li.category1 a:after{
              display: inline-block;
              content: "";
              width: 1px;
              height: 12px;
              vertical-align: baseline;
              background: #dddddd;
              margin-left: 10px;
              margin-right: 10px;
            }
         }
         .title-content{
            font-size: 14px;
            text-align: justify;
            color: #333333;
            margin-left: 10px;
         }
       }
       .more-sale{
         font-size: 14px;
         color: #999999;
       }
    }


    .template-content{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      background: white;
      .template7{
        width: 600px !important;
        display: flex;
      }
      .template7-right{
        width: 600px !important;
      }
      .width-300{
        width: 300px !important;
      }
      .content-left{
        width: 400px;
        height: 520px;
        img{
          width: 100%;
          cursor: pointer;
          height: 100%;
        }
        .left-img{
          width: 300px;
          height: 100%;
          img.left-img-class{
            width: 100%;
            height: 50%;
            vertical-align: middle;
            cursor: pointer;
          }
        }

      }
      .content-top{
        width: 100%;
        height: 240px;
        img.top-one-img{
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .content-bottom{
        width: 100%;
        height: 260px;
        display: flex;
      }
      .content-right{
        display: flex;
        flex-wrap: wrap;
        height: 520px;
        width: 800px;

        .content-bottom{
          display: flex;
        }
        .content-top{
          width: 100%;
          height: 50%;
          .top-img{
            height: 100%;
            img.top-img-class{
              width: 50%;
              cursor: pointer;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
