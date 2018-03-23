<template>
    <div class="gz-input" :class="{'danger': !valid, 'disabled': disabled}">
      <div class="input-area">
          <label v-if="hasLabel">
              <slot name="label">
                  {{ label }}
              </slot>
          </label>
          <input
              :type="type"
              :placeholder="placeholder"
              :value="modelValue"
              v-bind="{'disabled': disabled}"
              @change="nativeEventHandler('change')"
              @focus="nativeEventHandler('focus')"
              @blur="nativeEventHandler('blur')"
              @input="inputHandler($event)"
              v-focus:isFocused="isFocused"
          >
          <div class="addons">
              <slot></slot>
          </div>
      </div>
      <div class="imgInfo" v-show="!!Info">
          <img src="../../../assets/img/Group 125.png">
          <span>{{ Info }}</span>
      </div>
      <div class="errMsg">
          <span>{{ errMsg }}</span>
      </div>
    </div>

</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text'
      // required: true
      // validator (value) {
      //   return ['text', 'number', 'email', 'password', 'tel'].indexOf(value) >= 0
      // }
    },
    label: String,
    placeholder: String,
    value: null,
    required: {
      type: [Boolean, String],
      default: false
    },
    disabled: null,
    hasErr: {
      type: Boolean,
      default: false
    },
    errMsg: {
      type: String,
      default: ''
    },
    Info: {
      type: String,
      default: ''
    },
    isFocused: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modelValue: null,
      modelHasErr: null,
      valid: true
    }
  },
  watch: {
    modelValue (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.$set(this, 'modelValue', val)
    }
  },
  computed: {
//        hasAddons() {
//            return !!this.$slots.default;
//        },
    hasLabel () {
      return !!this.label || !!this.$slots.label
    }
  },
  methods: {
    nativeEventHandler (eventType) {
      this.$emit(eventType, this.modelValue)
      if (eventType === 'blur') {
        this.validate(this.modelValue)
      }
    },
    inputHandler (e) {
      this.$set(this, 'modelValue', e.target.value)
    },
    validate (value) {
      if (this.required && !this.modelValue) {
        return this.$set(this, 'valid', false)
      }
      let regexp = null
      switch (this.type) {
        case 'email':
          regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
          break
        case 'number':
          regexp = /^\d$/
          break
        case 'tel':
          regexp = /^1\d{10}$/
          break
        default:
          regexp = /.*/
      }
      return this.$set(this, 'valid', regexp.test(value))
    },
    resetErr () {
      this.$emit('resetErr', this.errMsg)
    }
  },
  directives: {
    focus: {
      inserted (el, binding) {
        if (binding.value) el.focus()
      }
    }
  },
  beforeUpdate () {
    this.hasDefaultSlot = !!this.$slots.default
  },
  mounted () {
    if (this.value) {
      this.$set(this, 'modelValue', this.value)
    }
  }
}
</script>

<style lang="less">
.gz-input {
    margin-bottom: 10px;
    .input-area {
        border: solid 1px #dddddd;
        display: flex;
        align-items: center;
        &:last-child {
            border-bottom: 2rpx solid #ccc;
        }

        label {
            box-sizing: border-box;
            display:block;
            padding-left: 20px;
            width: 110px;
            text-align: left;
            font-size: 14px;
            color: #666;
            letter-spacing: 3px;
        }

        input, .errHint {
            flex: 1;
            display: flex;
            align-items: center;
            height: 42px;
            line-height: 42px;
            min-width: 0;
            outline: none;
            border: 0;
            font-size: 14px;

            &::placeholder {
                color: #ccc;
                font-weight: normal;
            }
        }
        &.disabled {
            color: #999;
            background-color: #f1f1f1;
            input {
                background-color: #f1f1f1;
                color: #999;
                cursor: not-allowed;
            }
        }
        .addons {
          height: 42px;
          img {
              height: 40px;
          }
        }
    }
    .errMsg {
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        color:  #ff4544;
    }
    .imgInfo {
      margin-top: 8px;
      padding-left: 10px;
      font-size: 12px;
      color: #999;
      img {
        width: 12px;
        margin-right: 6px;
      }
    }
}
</style>
