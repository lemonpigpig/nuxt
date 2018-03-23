<template>
  <div class="time-log">
    <div class="time-title" v-if="title">{{title}}：</div>
    <div  :class="dayclass ? dayclass : 'time-day'">{{item.day}} 天</div>
    <div class="time-time">
      <div :class="hourclass ? hourclass : 'time-box'">{{item.hour}}</div>
      <span>:</span>
      <div  :class="minclass ? minclass : 'time-box'">{{item.minute}}</div>
      <span>:</span>
      <div  :class="secondclass ? secondclass : 'time-box'">{{item.second}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'time-reverse',
  data () {
    return {
      interval: '',
      timeShow: ''
    }
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    timer: {
      type: [Number, String],
      default: () => 3000
    },
    hourclass: {
      type: String,
      default: () => ''
    },
    minclass: {
      type: String,
      default: () => ''
    },
    secondclass: {
      type: String,
      default: () => ''
    },
    dayclass: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    item () {
      return this.getTime(this.timeShow)
    }
  },
  watch: {
    timeShow (val) {
      if (this.interval && val <= 0) {
        clearInterval(this.interval)
      }
    }
  },
  methods: {
    getTime (time) {
      let item = {day: '', hour: '', minute: '', second: ''}
      let totalHour = parseInt(time / 3600)
      let leftSecond = time % 3600
      item.day = parseInt(totalHour / 24)
      item.hour = totalHour % 24
      if (item.hour < 10) {
        item.hour = '0' + item.hour
      }
      item.minute = parseInt(leftSecond / 60)
      if (item.minute < 10) {
        item.minute = '0' + item.minute
      }
      item.second = leftSecond % 60
      if (item.second < 10) {
        item.second = '0' + item.second
      }
      return item
    }
  },
  mounted () {
    this.$set(this, 'timeShow', this.timer)
    if (this.timeShow <= 0) {
      this.timeShow = 0
      return
    }
    this.interval = setInterval(() => {
      this.timeShow -= 1
    }, 1000)
  },
  destroyed () {
    this.timeShow = 0
    clearInterval(this.interval)
  }
}
</script>

<style>
.time-log {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.time-title {
  font-size: 14px;
  margin-right:10px;
}
.time-day {
  margin-right: 8px;
}
.time-time {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.time-time span {
    margin: 0px 5px;
}
.time-box {
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
}
</style>
