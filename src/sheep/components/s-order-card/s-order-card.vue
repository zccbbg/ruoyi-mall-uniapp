<template>
  <view class="ss-order-menu-wrap ss-flex ss-col-center">
    <view
      class="menu-item ss-flex-1 ss-flex-col ss-row-center ss-col-center"
      v-for="item in orderMap"
      :key="item.title"
      @tap="sheep.$router.go(item.path, { type: item.value })"
    >
      <uni-badge
        class="uni-badge-left-margin"
        :text="numData[item.type]"
        absolute="rightTop"
        size="small"
      >
        <image class="item-icon" :src="sheep.$url.static(item.icon)" mode="aspectFit"></image>
      </uni-badge>
      <view class="menu-title ss-m-t-28">{{ item.title }}</view>
    </view>
  </view>
</template>

<script setup>
  /**
   * 装修组件 - 订单菜单组
   */
  import sheep from '@/sheep';
  import { computed } from 'vue';

  const orderMap = [
    {
      title: '待付款',
      value: '1',
      icon: 'https://git-open.oss-cn-shenzhen.aliyuncs.com/ruoyi-mall/uniapp/icons/no_pay.png',
      path: '/pages/order/list',
      type: 'unpaid',
    },
    {
      title: '待发货',
      value: '2',
      icon: 'https://git-open.oss-cn-shenzhen.aliyuncs.com/ruoyi-mall/uniapp/icons/no_comment.png',
      path: '/pages/order/list',
      type: 'nosend',
    },
    {
      title: '待收货',
      value: '3',
      icon: 'https://git-open.oss-cn-shenzhen.aliyuncs.com/ruoyi-mall/uniapp/icons/no_take.png',
      path: '/pages/order/list',
      type: 'noget',
    },
    // {
    //   title: '待评价',
    //   value: '4',
    //   icon: '/static/img/shop/order/no_comment.png',
    //   path: '/pages/order/list',
    //   type: 'nocomment',
    // },
    {
      title: '售后单',
      value: '4',
      icon: 'https://git-open.oss-cn-shenzhen.aliyuncs.com/ruoyi-mall/uniapp/icons/change_order.png',
      path: '/pages/order/list',
      type: 'aftersale',
    },
    {
      title: '全部订单',
      value: '0',
      icon: 'https://git-open.oss-cn-shenzhen.aliyuncs.com/ruoyi-mall/uniapp/icons/all_order.png',
      path: '/pages/order/list',
    },
  ];

  const numData = computed(() => sheep.$store('user').numData);
</script>

<style lang="scss" scoped>
  .ss-order-menu-wrap {
    .menu-item {
      height: 160rpx;
      position: relative;
      z-index: 10;
      .menu-title {
        font-size: 24rpx;
        line-height: 24rpx;
        color: #333333;
      }
      .item-icon {
        width: 44rpx;
        height: 44rpx;
      }
      .num-icon {
        position: absolute;
        right: 18rpx;
        top: 18rpx;
        // width: 40rpx;
        padding: 0 8rpx;
        height: 26rpx;
        background: #ff4d4f;
        border-radius: 13rpx;
        color: #fefefe;
        display: flex;
        align-items: center;
        .num {
          font-size: 24rpx;
          transform: scale(0.8);
        }
      }
    }
  }
</style>
