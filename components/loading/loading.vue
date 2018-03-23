<template lang="pug">
    div(":class"="[isShow ? '' : 'fn-hidden', `${classPrefix}loading`]")
        div(":class"="[`${classPrefix}loading__mask`, mask ? `${classPrefix}loading__mask--show` : '']"
            ":style"="{position: fullscreen ? 'fixed' : 'absolute'}" ref="mask")
        div(":style"="{left: left, top: top, 'background-color': mask ? '#fff' : 'transparent'}"
            ref="content" ":class"="[`${classPrefix}loading__content`]")
            div(v-if="icon == 'one'" ":class"="[`${classPrefix}loading__icon`]")
            div(v-if="icon == 'two'" ":class"="[`${classPrefix}loading__icon2`]")
                gz-icon(size="16" color="#FF4544" icon="point")
                gz-icon(size="16" icon="point" color="#FC9695")
            div(v-if="icon == 'three'" ":class"="[`${classPrefix}loading__icon3`]")
                <svg class="gz-icon" style="width: 70pxheight: 70pxcolor: red" stroke="#ff4544"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-ball-triangle"></use></svg>
            div {{ content }}
</template>
<script>
    import { PREFIX } from '../../utilities/global-const'

    export default {
        data() {
          return {
            icon: 'one',
            fullscreen: false,
            content: '',
            mask: false,
            left: '50%',
            top: '50%',
            classPrefix: PREFIX,
            isShow: false
          }
        },

        methods: {
          show() {
            this.$set(this, 'isShow', true)

            this.$nextTick(() => {
              const maskRect = this.$refs.mask.getBoundingClientRect()
              const contentRect = this.$refs.content.getBoundingClientRect()

              this.top = `${((maskRect.height - contentRect.height) / 2)}px`
              this.left = `${((maskRect.width - contentRect.width) / 2)}px`
            })
          },
          destroy () {
            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
          },
          update (options) {
            if (options.content) {
              this.$set(this, 'content', options.content)
            } else {
              this.$set(this, 'content', '')
            }

            if (options.mask) {
              this.$set(this, 'mask', options.mask)
            } else {
              this.$set(this, 'mask', false)
            }
            this.show()
          }
        },
        mounted () {
          this.show()
        }
    }
</script>
