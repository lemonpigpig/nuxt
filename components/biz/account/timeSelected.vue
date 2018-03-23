<template lang="html">
    <div id="dateSelected">
        <div class="selected-part">
            <div class="item-top">
                <input
                type="text"
                placeholder="请选择"
                readonly="readonly"
                @click="showChoice('year')"
                v-model="year"
              >
                <i><img src="../../../assets/img/Group55.png"></i>
            </div>
            <div class="item-option" v-show="isYearShow">
                <ul>
                    <li v-for="(item, index) in yearList" @click="selectedOption('year', item)">
                      {{item}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="selected-part">
            <div class="item-top">
                <input
                type="text"
                placeholder="请选择"
                readonly="readonly"
                v-model="month"
                @click="showChoice('month')"
              >
                <i><img src="../../../assets/img/Group55.png"></i>
            </div>
            <div class="item-option" v-show="isMonthShow">
                <ul>
                    <li v-for="(item, index) in monthList" @click="selectedOption('month', item)">
                      {{item}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="selected-part">
            <div class="item-top">
                <input
                type="text"
                placeholder="请选择"
                readonly="readonly"
                v-model="day"
                @click="showChoice('day')"
              >
                <i><img src="../../../assets/img/Group55.png"></i>
            </div>
            <div class="item-option" v-show="isDayShow">
                <ul>
                    <li v-for="(item, index) in dayList" @click="selectedOption('day', item)">
                      {{item}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      year: '1970',
      month: '1',
      day: '1',
      isDayShow: false,
      isYearShow: false,
      isMonthShow: false
    }
  },
  computed: {
    yearList () {
      const y = new Date().getFullYear()
      const yearArr = []
      for (let i = 1960; i < y; i++) {
        yearArr.push(i)
      }
      return yearArr
    },
    monthList () {
      const monthArr = []
      for (let i = 1; i < 13; i++) {
        monthArr.push(i)
      }
      return monthArr
    },
    dayList () {
      const dayArr = []
      for (let i = 1; i < 30; i++) {
        dayArr.push(i)
      }
      return dayArr
    }
  },
  methods: {
    showChoice (type) {
      if (type === 'year') {
        this.$set(this, 'isYearShow', !this.isYearShow)
      } else if (type === 'month') {
        this.$set(this, 'isMonthShow', !this.isMonthShow)
      } else {
        this.$set(this, 'isDayShow', !this.isDayShow)
      }
    },
    selectedOption (type, item) {
      if (type === 'year') {
        this.$set(this, 'isYearShow', false)
        this.$set(this, 'year', item)
      } else if (type === 'month') {
        this.$set(this, 'isMonthShow', false)
        this.$set(this, 'month', item)
      } else {
        this.$set(this, 'isDayShow', false)
        this.$set(this, 'day', item)
      }
    }
  },
  mounted () {

  }
}
</script>

<style lang="less">
#dateSelected {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  .selected-part {
      float: left;
      margin-right: 18px;
      width: 80px;
      font-size: 14px;
      .item-top {
          padding: 0px 10px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          line-height: 24px;
          height: 24px;
          input {
            width: 32px;
            cursor: pointer;
          }
          i {
            float: right;
          }
      }
      .item-option {
          height: 270px;
          overflow-y: scroll;
          transition: height 2s;
          -webkit-transition: height 2s;
          position: absolute;
          ul {
            border: 1px soid #ddd;
            border-top: none;
            li {
              font-size: 12px;
              padding-left: 7px;
              line-height: 24px;
              cursor: pointer;
              border-bottom: 1px solid #eee;
              background: #fff;
              width: 73px;
            }
            li:hover {
              background: #e4e8f1;
            }
          }
      }
   }
}
</style>
