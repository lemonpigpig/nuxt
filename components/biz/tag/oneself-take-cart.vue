<template>
  <span class="tag-oneself-take-cart">
    <svg width="50px" height="28px" viewBox="0 0 50 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="04购物车" transform="translate(-387.000000, -955.000000)" fill="#555C78">
                <path d="M393.028476,977 L437,977 L437,955 L387,955 L387,975 L387,983 L393.028476,977 Z" id="Combined-Shape">
                </path>
            </g>
        </g>
    </svg>
    <span class="oneself-take-text">
      <slot name="tag-text">自提</slot>
    </span>
  </span>
</template>

<script>

export default {
  name: 'gz-tag-oneselfTake-cart'
}
</script>

<style lang="less">
  .tag-oneself-take-cart {
    display: inline-block !important;
    width: 50px !important;
    height: 28px !important;
    color: #fff !important;
    font-size: 14px !important;
    margin: 0 5px !important;
    position: relative;
    .oneself-take-text {
      display: inline-block;
      width: 100%;
      height: 20px;
      line-height: 22px;
      position: absolute;
      top: 0;
      left: 0;
      text-align: center !important;
    }
  }
</style>
