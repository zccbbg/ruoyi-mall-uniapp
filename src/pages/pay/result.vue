<!-- 支付结果页面 -->
<template>
  <s-layout title="支付结果" :bgStyle="{ color: '#FFF' }">
    <view class="pay-result-box ss-flex-col ss-row-center ss-col-center">
      <view class="pay-waiting ss-m-b-30" v-if="payResult === 'waiting'"> </view>
      <image
        class="pay-img ss-m-b-30"
        v-if="payResult === 'success'"
        :src="sheep.$url.static('/static/img/shop/order/order_pay_success.gif')"
      ></image>
      <image
        class="pay-img ss-m-b-30"
        v-if="['failed', 'closed'].includes(payResult)"
        :src="sheep.$url.static('/static/img/shop/order/order_paty_fail.gif')"
      ></image>
      <view class="tip-text ss-m-b-30" v-if="payResult == 'success'">{{
        state.orderInfo.pay_mode === 'offline' ? '下单成功' : '支付成功'
      }}</view>
      <view class="tip-text ss-m-b-30" v-if="payResult == 'failed'">支付失败</view>
      <view class="tip-text ss-m-b-30" v-if="payResult == 'closed'">该订单已关闭</view>
      <view class="tip-text ss-m-b-30" v-if="payResult == 'waiting'">检测支付结果...</view>
      <view class="pay-total-num ss-flex" v-if="payResult === 'success' && state.orderType !== 'memberConsumer'">
          <view>{{ state.totalAmount }}</view>
      </view>
      <view class="btn-box ss-flex ss-row-center ss-m-t-50">
        <button class="back-btn ss-reset-button" @tap="sheep.$router.go('/pages/index/index')">
          返回首页
        </button>
<!--        <button-->
<!--          class="check-btn ss-reset-button"-->
<!--          v-if="payResult === 'failed'"-->
<!--          @tap="sheep.$router.redirect('/pages/pay/index', { orderSN: state.orderId })"-->
<!--        >-->
<!--          重新支付-->
<!--        </button>-->
        <button
          class="check-btn ss-reset-button"
          v-if="payResult === 'success'"
          @tap="sheep.$router.redirect('/pages/order/list')"
        >
          查看订单
        </button>
      </view>
    </view>
  </s-layout>
</template>

<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { reactive, computed } from 'vue';
  import sheep from '@/sheep';

  const state = reactive({
    mode: '支付成功',
    orderId: 0,
    orderType: 'memberConsumer',
    result: 'unpaid', // 支付状态
    orderInfo: {}, // 订单详情
    counter: 0, // 获取结果次数
  });

  const payResult = computed(() => {
    if (state.result === 'unpaid') {
      return 'waiting';
    }
    if (state.result === 'paid') {
      return 'success';
    }
    if (state.result === 'failed') {
      return 'failed';
    }

    if (state.result === 'closed') {
      return 'closed';
    }
  });
  async function getOrderInfo(orderId) {
    //直接设置支付成功
    state.result = "paid"
    return
    let checkPayResult;
    state.counter++;
    if (state.orderType === 'recharge') {
      checkPayResult = sheep.$api.trade.order;
    } else {
      checkPayResult = sheep.$api.order.detail;
    }
    const { data, error } = await checkPayResult(orderId);
    if (error === 0) {
      state.orderInfo = data;
      if (state.orderInfo.status === 'closed') {
        state.result = 'closed';
        return;
      }
      if (state.orderInfo.status !== 'unpaid') {
        state.result = 'paid';
        // #ifdef MP
        subscribeMessage();
        // #endif
        return;
      }
    }
    if (state.counter < 3 && state.result === 'unpaid') {
      setTimeout(() => {
        getOrderInfo(orderId);
      }, 1000);
    }
    // 超过三次检测才判断为支付失败
    if (state.counter >= 3) {
      state.result = 'failed';
    }
  }

  // #ifdef MP
  function subscribeMessage() {
    let event = ['order_dispatched'];
    if (['groupon', 'groupon_ladder'].includes(state.orderInfo.activity_type)) {
      event.push('groupon_finish');
      event.push('groupon_fail');
    }
    sheep.$platform.useProvider('wechat').subscribeMessage(event);
  }
  // #endif

  onLoad(async (options) => {
    let id = '';
    // 支付订单号
    if (options.orderSN) {
      id = options.orderSN;
    }
    if (options.orderType === 'recharge') {
      state.orderType = 'recharge';
    }
    if (options.id) {
      id = options.id;
    }
    state.orderId = id;
    // 支付结果传值过来是失败，则直接显示失败界面
    if (options.payState === 'fail') {
      state.result = 'failed';
    } else {
      // 轮询三次检测订单支付结果
      getOrderInfo(id);
    }
  });
</script>

<style lang="scss" scoped>
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .score-img {
    width: 36rpx;
    height: 36rpx;
    margin: 0 4rpx;
  }

  .pay-result-box {
    padding: 60rpx 0;
    .pay-waiting {
      margin-top: 20rpx;
      width: 60rpx;
      height: 60rpx;
      border: 10rpx solid rgb(233, 231, 231);
      border-bottom-color: rgb(204, 204, 204);
      border-radius: 50%;
      display: inline-block;
      // -webkit-animation: rotation 1s linear infinite;
      animation: rotation 1s linear infinite;
    }
    .pay-img {
      width: 130rpx;
      height: 130rpx;
    }

    .tip-text {
      font-size: 30rpx;
      font-weight: bold;
      color: #333333;
    }

    .pay-total-num {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      font-family: OPPOSANS;
    }
    .btn-box {
      width: 100%;
      .back-btn {
        width: 190rpx;
        height: 70rpx;
        font-size: 28rpx;
        border: 2rpx solid #dfdfdf;
        border-radius: 35rpx;
        font-weight: 400;
        color: #595959;
      }
      .check-btn {
        width: 190rpx;
        height: 70rpx;
        font-size: 28rpx;
        border: 2rpx solid #dfdfdf;
        border-radius: 35rpx;
        font-weight: 400;
        color: #595959;
        margin-left: 32rpx;
      }
    }
    .subscribe-box {
      .subscribe-img {
        width: 44rpx;
        height: 44rpx;
      }
      .subscribe-title {
        font-weight: 500;
        font-size: 32rpx;
        line-height: 36rpx;
        color: #434343;
      }
      .subscribe-start {
        color: var(--ui-BG-Main);
        font-weight: 700;
        font-size: 32rpx;
        line-height: 36rpx;
      }
    }
  }
</style>
