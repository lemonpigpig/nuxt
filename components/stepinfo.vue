<template lang="html">
    <div class="stepinfo">
        <ul>
            <li :class="item.class" v-for="(item, index) in stepinfo">
                <span class="line">
                    <span class="circle">{{index+1}}</span>
                </span>
                <p>{{item.name}}</p>
            </li>
            <li v-show="showComplete" :class="{'active': completeActive}">
                <span class="line">
                    <span class="circle"><img src="../assets/img/icon1.svg"/></span>
                </span>
                <p>完成</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  props: {
    stepinfo: {
      type: Array,
      default: () => []
    },
    showComplete: {
      type: Boolean,
      default: () => false
    },
    completeActive: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style lang="less">
.stepinfo {
    ul {
        overflow: hidden;
        li {
            float: left;
            span {
                display: inline-block;
            }
            .line {
                position: relative;
                width: 160px;
                height: 4px;
                background-color: #bab5b0;
                .circle {
                    position: absolute;
                    top: -10px;
                    left: 68px;
                    width: 24px;
                    line-height: 24px;
                    border-radius: 50%;
                    background: #bab5b0;
                    color: #fff;
                    text-align: center;
                }
            }
            P {
                text-align: center;
                margin-top: 14px;
                color: #bab5b0;
                font-size: 14px;
            }
        }
        .active {
            .line {
                background-color: #ff4544;
                .circle {
                    background-color: #ff4544;
                }
            }
            p {
                color: #ff4544;
            }
        }
    }
}
</style>
