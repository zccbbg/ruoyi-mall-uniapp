<!-- 优惠券详情  -->
<template>
  <s-layout title="优惠券详情">
    <view class="bg-white">
      <!-- 详情卡片 -->
      <view class="detail-wrap ss-p-20">
        <view class="detail-box">
          <view class="tag-box ss-flex ss-col-center ss-row-center">
            <image
              class="tag-image"
              :src="sheep.$url.static('/static/img/shop/app/coupon_icon.png')"
              mode="aspectFit"
            ></image>
          </view>
          <view class="top ss-flex-col ss-col-center">
            <view class="title ss-m-t-50 ss-m-b-20 ss-m-x-20">{{ state.coupon.title }}</view>
            <view class="subtitle ss-m-b-50" v-if="state.coupon.minAmount">满{{ state.coupon.minAmount }}元，优惠{{state.coupon.couponAmount}}元</view>
            <view class="subtitle ss-m-b-50" v-else>无门槛，优惠{{state.coupon.couponAmount}}元</view>
            <button
              class="ss-reset-button ss-m-b-30"
              :class="
                state.coupon.canGet
                  ? 'use-btn'
                  : 'disable-btn'
              "
              :disabled="
                !state.coupon.canGet ||
                state.userCouponId
              "
              @click="getCoupon"
            >
              {{  !state.coupon.canGet || state.userCouponId ? '已领取': '立即领取' }}
            </button>
            <view
              class="time ss-m-y-30"
              v-if="state.couponId">
              领取时间：{{ state.coupon.beginTime }}至{{ state.coupon.endTime }}
            </view>
            <view class="time ss-m-y-30" v-else>
              有效期：{{ state.coupon.beginTime }}至{{ state.coupon.endTime }}
            </view>
            <view class="coupon-line ss-m-t-14"></view>
          </view>
          <view class="bottom">
            <view class="type ss-flex ss-col-center ss-row-between ss-p-x-30">
              <view>领取方式</view>
              <view>{{ state.coupon.couponType === 1 ? '免费领取':'积分兑换' }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 适用商品 -->
      <view
        class="all-user ss-flex ss-row-center ss-col-center"
        v-if="state.coupon.useScope == 1"
      >
        全场通用
      </view>

      <su-sticky v-else bgColor="#fff">
        <view class="goods-title ss-p-20">{{ state.coupon.useScope === 2 ? '指定商品可用':'指定商品不可用' }}</view>
      </su-sticky>
      <view class="goods-block" v-if="state.coupon.useScope !== 1 && state.coupon.productIds && goodsCard">
        <s-goods-card :data="goodsCard.data" :styles="goodsCard.style" />
      </view>
    </view>
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import { onLoad, onReachBottom } from '@dcloudio/uni-app';
  import {reactive, ref} from 'vue';

  const state = reactive({
    coupon: {},
    activityId: 0,
    userCouponId: 0,
    tabMaps: [],
    loadStatus: '',
  });

  const goodsCard = ref(null)

  const initGoodsCard = {
    "data": {
      "mode": 2,
      "goodsFields": {
        "title": {
          "show": 1,
        },
        "subtitle": {
          "show": 1,
        },
        "price": {
          "show": 1,
        },
        "original_price": {
          "show": 1,
        },
        "sales": {
          "show": 1,
        },
        "stock": {
          "show": 0,
        }
      },
      "buyNowStyle": {

      },
      "tagStyle": {
        "show": 0,
        "src": ""
      },
      params: {
        ids: []
      },
      "borderRadiusTop": 6,
      "borderRadiusBottom": 6,
      "space": 8
    },
    "style": {
      "background": {
        "type": "color",
        "bgImage": "",
        "bgColor": ""
      },
      "marginLeft": 8,
      "marginRight": 8,
      "marginTop": 0,
      "marginBottom": 10,
      "borderRadiusTop": 0,
      "borderRadiusBottom": 0,
      "padding": 0
    }
  }

  // 接收参数
  const props = defineProps({
    includes: {
      type: Array,
      default() {
        return [];
      },
    },
    list: {
      type: Array,
      default: () => [],
    },
    goodsFieldsStyle: {
      type: Object,
      default() {},
    },
    buyData: {
      type: Object,
      default() {},
    },
  });

  async function getCoupon() {
    const res = await sheep.$api.coupon.get(state.activityId);
    if (res) {
      uni.showToast({
        title: '领取成功',
      });
      setTimeout(() => {
        getCouponContent(state.activityId, state.userCouponId);
      }, 1000);
    }
  }
  async function getCouponContent(id, userCouponId) {
    let res;
    if (id) {
      //查活动的
      res = await sheep.$api.coupon.activityDetail(id);
    }
    if ([2,3].includes(res.useScope) && res.productIds) {
      const val = {...initGoodsCard}
      val.data.params.ids = res.productIds.split(",")
      goodsCard.value = val;
    }
    state.coupon = res
  }


  onLoad((options) => {
    state.activityId = options.id;
    state.userCouponId = options.user_coupon_id;
    getCouponContent(state.activityId, state.userCouponId);
  });


</script>

<style lang="scss" scoped>
  .goods-block {
    margin: 0 20rpx 10rpx 20rpx;
  }
  .goods-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #333333;
  }

  .detail-wrap {
    background: linear-gradient(
      180deg,
      var(--ui-BG-Main),
      var(--ui-BG-Main-gradient),
      var(--ui-BG-Main),
      #fff
    );
  }

  .detail-box {
    // background-color: var(--ui-BG);
    border-radius: 6rpx;
    position: relative;
    margin-top: 100rpx;
    .tag-box {
      width: 140rpx;
      height: 140rpx;
      background: var(--ui-BG);
      border-radius: 50%;
      position: absolute;
      top: -70rpx;
      left: 50%;
      z-index: 6;
      transform: translateX(-50%);

      .tag-image {
        width: 104rpx;
        height: 104rpx;
        border-radius: 50%;
      }
    }

    .top {
      background-color: #fff;
      border-radius: 20rpx 20rpx 0 0;
      -webkit-mask: radial-gradient(circle at 16rpx 100%, #0000 16rpx, red 0) -16rpx;
      padding: 110rpx 0 0 0;
      position: relative;
      z-index: 5;

      .title {
        font-size: 40rpx;
        color: #333;
        font-weight: bold;
      }

      .subtitle {
        font-size: 28rpx;
        color: #333333;
      }

      .use-btn {
        width: 386rpx;
        height: 80rpx;
        line-height: 80rpx;
        background: linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
        border-radius: 40rpx;
        color: $white;
      }

      .disable-btn {
        width: 386rpx;
        height: 80rpx;
        line-height: 80rpx;
        background: #e5e5e5;
        border-radius: 40rpx;
        color: $white;
      }

      .time {
        font-size: 26rpx;
        font-weight: 400;
        color: #999999;
      }

      .coupon-line {
        width: 95%;
        border-bottom: 2rpx solid #eeeeee;
      }
    }

    .bottom {
      background-color: #fff;
      border-radius: 0 0 20rpx 20rpx;
      -webkit-mask: radial-gradient(circle at 16rpx 0%, #0000 16rpx, red 0) -16rpx;
      padding: 40rpx 30rpx;

      .type {
        height: 96rpx;
        border-bottom: 2rpx solid #eeeeee;
      }
    }

    .des {
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
    }
  }

  .all-user {
    width: 100%;
    height: 300rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: #333333;
  }
</style>
