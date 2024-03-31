<!-- 订单详情 -->
<template>
  <s-layout title="订单详情" class="index-wrap">
    <view class="order-address-box ss-mb-40" >
      <!-- 订单状态 -->
      <view class="state-box ss-flex-col ss-col-center ss-row-right">
        <view class="ss-flex ss-m-t-32 ss-m-b-20">
          <!--          <image-->
          <!--            v-if="[0,1].includes(state.status)"-->
          <!--            class="state-img"-->
          <!--            :src="sheep.$url.static('/static/img/shop/order/order_loading.png')"-->
          <!--          >-->
          <!--          </image>-->
          <!--          <image-->
          <!--            v-if="state.status === 3"-->
          <!--            class="state-img"-->
          <!--            :src="sheep.$url.static('/static/img/shop/order/order_success.png')"-->
          <!--          >-->
          <!--          </image>-->
          <!--          <image-->
          <!--            v-if="[4,5].includes(state.status)"-->
          <!--            class="state-img"-->
          <!--            :src="sheep.$url.static('/static/img/shop/order/order_close.png')"-->
          <!--          >-->
          <!--          </image>-->
          <!--          <image-->
          <!--            v-if="state.status===2"-->
          <!--            class="state-img"-->
          <!--            :src="sheep.$url.static('/static/img/shop/order/order_express.png')"-->
          <!--          >-->
          <!--          </image>-->
          <view class="ss-font-30" :class="formatOrderColor(state.status)">{{ getOrderStatusName(state.status) }}</view>
        </view>
        <view class="ss-font-26" v-if="minute > 0 && second > 0">{{ minute }} : {{ second }}</view>
      </view>
      <!-- 收货地址 -->
      <view v-if="state.address">
        <view class="ss-flex ss-col-center">
          <text class="address-username">
            {{ state.address.receiverName }}
          </text>
          <text class="address-phone">{{ state.address.receiverPhone }}</text>
        </view>
        <view class="address-detail">{{ state.address.fullAddress }}</view>
      </view>
    </view>

    <view class="detail-goods">
      <!-- 订单信息 -->
      <view class="border-bottom" v-for="item in state.orderInfo.orderItemList" :key="item.id">
<!--        <view class="order-card">-->
          <s-goods-item
              :img="item.pic"
              :title="item.productName"
              :skuText="item.spDataValue"
              :price="item.salePrice"
              :num="item.quantity"
          >
<!--            <template #tool>-->
<!--              <view class="ss-flex">-->
<!--                <button-->
<!--                    class="ss-reset-button apply-btn"-->
<!--                    v-if="state.orderInfo.unpaid && state.orderInfo.children.length > 1"-->
<!--                    @tap.stop="onCancel([order.id])">-->
<!--                  取消订单-->
<!--                </button>-->
<!--              </view>-->
<!--            </template>-->
<!--            <template #priceSuffix>-->
<!--              <button class="ss-reset-button tag-btn" v-if="order.status_text">-->
<!--                {{ order.status_text }}-->
<!--              </button>-->
<!--            </template>-->
          </s-goods-item>
<!--        </view>-->
      </view>
    </view>
    <!-- 订单信息  -->
    <view class="notice-box">
      <view class="notice-box__content">
        <view class="notice-item--center">
          <view class="ss-flex ss-flex-1">
            <!--            <text class="title">{{state.orderInfo.unpaid ? '交易单号':'订单编号'}}：</text>-->
            <text class="title">{{ '订单号：' }}</text>
            <text class="detail">{{ state.orderInfo.orderSn }}</text>
          </view>
          <button class="ss-reset-button copy-btn" @tap="onCopy(state.status === 0 ? state.orderInfo.payId : state.orderInfo.orderSn)">复制</button>
        </view>
        <view class="notice-item">
          <text class="title">下单时间：</text>
          <text class="detail">{{ state.orderInfo.createTime }}</text>
        </view>
        <view class="notice-item" v-if="state.orderInfo.paymentTime">
          <text class="title">支付时间：</text>
          <text class="detail">{{ state.orderInfo.paymentTime}}</text>
        </view>
<!--        <view class="notice-item" v-if="firstOrder.paymentTime">-->
<!--          <text class="title">支付方式：</text>-->
<!--          <text class="detail">微信支付</text>-->
<!--        </view>-->
        <view class="notice-item" v-if="state.orderInfo.deliverySn">
          <text class="title">快递单号：</text>
          <text class="detail">{{state.orderInfo.deliverySn}}</text>
        </view>
      </view>
    </view>
    <!--  价格信息  -->
    <view class="order-price-box">
      <view class="notice-item ss-flex ss-row-between">
        <text class="title">商品总额</text>
        <view class="ss-flex">
          <text class="detail">￥{{ state.orderInfo.totalAmount }}</text>
        </view>
      </view>
<!--      <view class="notice-item ss-flex ss-row-between" v-if="totalFreightAmount > 0">-->
<!--        <text class="title">运费</text>-->
<!--        <text class="detail">+￥{{ totalFreightAmount }}</text>-->
<!--      </view>-->
      <view
          class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.couponAmount">
        <text class="title">优惠券</text>
        <text class="detail all-price">-¥{{ state.orderInfo.couponAmount }}</text>
      </view>
      <view class="notice-item all-rpice-item ss-flex ss-m-t-20">
        <text class="title">{{ [1,2,3].includes(state.status) ? '已付款：' : '需付款：'}}</text>
        <text class="detail all-price">￥{{ state.orderInfo.payAmount }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <su-fixed bottom placeholder bg="bg-white" v-if="![3,4].includes(state.status)">
      <view class="footer-box ss-flex ss-col-center ss-row-right">
        <button class="ss-reset-button apply-btn" v-if="state.status === 0" @tap="onCancel(state.orderId)">
          取消订单
        </button>
        <button class="ss-reset-button pay-btn ui-BG-Main-Gradient" v-if="state.status === 0" @tap="onPay({orderSn: state.orderInfo.payId, totalAmount: state.orderInfo.totalAmount})">
          继续支付
        </button>
        <button
            v-if="[1,2,3].includes(state.status) && state.orderInfo.aftersaleStatus === 1" class="delete-btn ss-reset-button"
            @tap="onRefund(state.orderInfo)">
          申请退款
        </button>
<!--        <button class="ss-reset-button apply-btn" v-if="firstOrder.aftersaleStatus > 1"-->
<!--                @tap.stop="sheep.$router.go('/pages/order/aftersale/detail', {id: firstOrder.id })">-->
<!--          售后详情-->
<!--        </button>-->
<!--        <button class="ss-reset-button apply-btn" v-if="firstOrder.status === 2 && firstOrder.aftersaleStatus === 1"-->
<!--                @tap="onExpress(firstOrder.id)">-->
<!--          查看物流-->
<!--        </button>-->
        <button class="ss-reset-button apply-btn ui-BG-Main-Gradient" v-if="state.status === 2 && state.orderInfo.aftersaleStatus === 1"
                @tap="onConfirm(state.orderId)">
          确认收货
        </button>
<!--        <button v-if="firstOrder.status === 1 && firstOrder.deliveryType === 2 && firstOrder.aftersaleStatus === 1"-->
<!--                class="ss-reset-button apply-btn" @tap="showCode(firstOrder.id)">-->
<!--          自提码-->
<!--        </button>-->
<!--        <button class="ss-reset-button apply-btn" v-if="state.status === 3 && state.orderInfo.aftersaleStatus === 1"-->
<!--                @tap.stop="sheep.$router.go('/pages/goods/index', {id: firstOrder?.items[0].productId})">-->
<!--          再次购买-->
<!--        </button>-->
        <!--        <button-->
        <!--          class="ss-reset-button cancel-btn"-->
        <!--          v-if="state.orderInfo.btns?.includes('comment')"-->
        <!--          @tap="onComment(state.orderInfo.order_sn)"-->
        <!--          >评价晒单</button-->
        <!--        >-->
        <!--        </button>-->
      </view>
    </su-fixed>
<!--    <su-popup :show="show" @close="show = false" type="center" class="popup-box">-->
<!--      <view class="QRCodeBox">-->
<!--        <view class="QRCode">-->
<!--          <image class="QRimg" :src="qr"></image>-->
<!--        </view>-->
<!--      </view>-->
<!--    </su-popup>-->
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import { onLoad } from '@dcloudio/uni-app';
  import { formatOrderColor,getOrderStatusName } from '@/sheep/hooks/useGoods';
  import { computed, reactive, ref } from 'vue';
  import {clone} from "lodash";

  const minute = ref(0)
  const second = ref(0)
  function time(endTime) {
    let date = new Date(); //现在时间
    let now = date.getTime(); //现在时间戳
    let allTime = endTime - now
    let m, s;
    if (allTime > 0) {
      m = Math.floor(allTime / 1000 / 60 % 60);
      s = Math.floor(allTime / 1000 % 60);
      minute.value = m < 10 ? '0' + m : m
      second.value = s < 10 ? '0' + s : s
      setTimeout(() => {
        time(endTime)
      }, 1000);
    }
  }

  const statusBarHeight = sheep.$platform.device.statusBarHeight * 2;
  const headerBg = sheep.$url.css('/static/img/shop/order/order_bg.png');
  const state = reactive({
    orderInfo: {},
    orderId: null,
    address: {},
    status: null
  });

  const addressText = computed(() => {
    let data = state.orderInfo.address;
    if (data) {
      return `${data.province_name} ${data.city_name} ${data.district_name} ${data.address}`;
    }
    return '';
  });

  // 复制
  const onCopy = (data) => {
    sheep.$helper.copyText(data);
  };
  //退款总额
  const refundFee = computed(() => {
    let refundFee = 0;
    state.orderInfo.items?.forEach((i) => {
      refundFee += Number(i.refund_fee);
    });
    return refundFee;
  });
  // 去支付
  function onPay(data) {
    console.log('data',data)
    sheep.$router.go('/pages/pay/index', {
      orderSN:data.orderSn,
      totalAmount: data.totalAmount,
      orderType: 'memberConsumer'
    });
  }

  function onGoodsDetail(id) {
    sheep.$router.go('/pages/goods/index', { id });
  }

  // 取消订单
  async function onCancel(orderId) {
    uni.showModal({
      title: '提示',
      content: '确定要取消订单吗?',
      success: async function (res) {
        if (res.confirm) {
          const idList = [orderId]
          const res = await sheep.$api.order.cancel({idList});
          if (res) {
            sheep.$helper.toast('取消成功')
            getOrderDetail(state.orderId)
          }
        }
      },
    });
  }

  // 申请退款
  async function onRefund(order) {
    sheep.$router.go('/pages/order/aftersale/apply',{item:JSON.stringify(order)})
  }

  // 查看物流
  async function onExpress(orderId) {
    sheep.$router.go('/pages/order/express/list', {
      orderId,
    });
  }

  // 确认收货
  async function onConfirm(orderId) {
    const res = await sheep.$api.order.confirm(orderId);
    if (res) {
      sheep.$helper.toast('收货成功')
      getOrderDetail(state.orderId);
    }
  }

  // 查看发票
  function onOrderInvoice(invoiceId) {
    sheep.$router.go('/pages/order/invoice', {
      invoiceId,
    });
  }

  // 配送方式详情
  function onDetail(item) {
    sheep.$router.go('/pages/order/dispatch/content', {
      id: item.order_id,
      item_id: item.id,
    });
  }

  // 评价
  function onComment(orderSN) {
    uni.$once('SELECT_INVOICE', (e) => {
      state.invoiceInfo = e.invoiceInfo;
    });
    sheep.$router.go('/pages/goods/comment/add', {
      orderSN,
    });
  }
  async function getOrderDetail(id) {
    const res = await sheep.$api.order.detail({orderId: id});
    res.orderItemList.forEach(item => {
      let str = "";
      const obj = JSON.parse(item.spData);
      Object.keys(obj).forEach((key) => {
        str += key + "：" + obj[key] + " ";
      });
      item.spDataValue = str;
    })
    state.orderInfo = res;
    state.orderId = res.orderId
    // if (state.timeToPay) {
    //   state.status = 0
    //   time(res.timeToPay)
    // } else {
    state.status = res.status
    // }
    if (res.status === 0 && res.timeToPay){
      time(res.timeToPay)
    }
    const {receiverName, receiverPhone, receiverProvince, receiverCity, receiverDistrict, receiverDetailAddress} = res
    state.address = {
      receiverName, receiverPhone,
      fullAddress: receiverProvince + ' ' + receiverCity + ' ' + receiverDistrict + ' ' + getHiddenDetailAddress(receiverDetailAddress)
    }
  }

  function getHiddenDetailAddress(data){
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    if (!data || data.length === 0){
      return ''
    }
    let tempResult = data.replace((/\d/g),'*')
    let result = ''
    for(let i=0;i<tempResult.length;i++){
      if (chineseNumbers.includes(tempResult[i])){
        result += '*'
      }else {
        result += tempResult[i]
      }
    }
    return result
  }

  onLoad(async (options) => {
    let id = '';
    // if (options.orderSN) {
    //   id = options.orderSN;
    // }
    if (options.id) {
      id = options.id;
    }
    getOrderDetail(id);
  });
</script>

<style lang="scss" scoped>
.score-img {
  width: 36rpx;
  height: 36rpx;
  margin: 0 4rpx;
}
.delete-btn {
  width: 160rpx;
  height: 55rpx;
  color: #ff3000;
  background: white;
  border-radius: 30rpx;
  font-size: 26rpx;
  line-height: normal;
  margin-right: 10rpx;
  border: 1rpx solid #ff3000;
  &:last-of-type {
    margin-right: 0;
  }
}
.apply-btn {
  width: 160rpx;
  height: 55rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
  border: 2rpx solid #dcdcdc;
  line-height: normal;
  margin-right: 10rpx;

  &:last-of-type {
    margin-right: 0;
  }
}
.state-box {
  //color: rgba(#fff, 0.9);
  width: 100%;
  background-size: 100% 100%;
  box-sizing: border-box;
  .state-img {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
  }
}
.warning-color {
  color: #faad14;
}
.danger-color {
  color: #ff3000;
}
.success-color {
  color: #52c41a;
}
.info-color {
  color: #999999;
}


.order-address-box {
  background-color: #fff;
  border-radius: 10rpx;
  margin: -50rpx 20rpx 16rpx 20rpx;
  padding: 44rpx 34rpx 42rpx 20rpx;
  font-size: 30rpx;
  box-sizing: border-box;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);

  .address-username {
    margin-right: 20rpx;
  }

  .address-detail {
    font-size: 26rpx;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    margin-top: 20rpx;
  }
}

.detail-goods {
  border-radius: 10rpx;
  margin: 0 20rpx 20rpx 20rpx;

  .order-list {
    margin-bottom: 20rpx;
    background-color: #fff;

    .order-card {
      //padding: 20rpx 0;

      .order-sku {
        font-size: 24rpx;

        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        width: 450rpx;
        margin-bottom: 20rpx;

        .order-num {
          margin-right: 10rpx;
        }
      }
      .tag-btn {
        margin-left: 16rpx;
        font-size: 24rpx;
        height: 36rpx;
        color: var(--ui-BG-Main);
        border: 2rpx solid var(--ui-BG-Main);
        border-radius: 14rpx;
        padding: 0 4rpx;
      }
    }
  }
}

// 订单信息。
.notice-box {
  background: #fff;
  border-radius: 10rpx;
  margin: 0 20rpx 20rpx 20rpx;

  .notice-box__head {
    font-size: 30rpx;

    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 80rpx;
    border-bottom: 1rpx solid #dfdfdf;
    padding: 0 25rpx;
  }

  .notice-box__content {
    padding: 20rpx;

    .self-pickup-box {
      width: 100%;

      .self-pickup--img {
        width: 200rpx;
        height: 200rpx;
        margin: 40rpx 0;
      }
    }
  }



  .notice-item,
  .notice-item--center {
    display: flex;
    align-items: center;
    line-height: normal;
    margin-bottom: 24rpx;

    .title {
      font-size: 28rpx;
      color: #999;
    }

    .detail {
      font-size: 28rpx;
      color: #333;
      flex: 1;
    }
  }
}
.copy-btn {
  width: 100rpx;
  line-height: 50rpx;
  border-radius: 25rpx;
  padding: 0;
  background: rgba(238, 238, 238, 1);
  font-size: 22rpx;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

// 订单价格信息
.order-price-box {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin: 0 20rpx 20rpx 20rpx;

  .notice-item {
    line-height: 70rpx;

    .title {
      font-size: 28rpx;
      color: #999;
    }

    .detail {
      font-size: 28rpx;
      color: #333;
      font-family: OPPOSANS;
    }
  }

  .all-rpice-item {
    justify-content: flex-end;
    align-items: center;

    .title {
      font-size: 26rpx;
      font-weight: 500;
      color: #333333;
      line-height: normal;
    }
  }

  .all-price {
    font-size: 26rpx;
    font-family: OPPOSANS;
    line-height: normal;
    color: $red !important;
  }
}

// 底部
.footer-box {
  height: 100rpx;
  width: 100%;
  box-sizing: border-box;
  border-radius: 10rpx;
  padding-right: 20rpx;

  .cancel-btn {
    width: 160rpx;
    height: 60rpx;
    background: #eeeeee;
    border-radius: 30rpx;
    margin-right: 20rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
  }

  .pay-btn {
    width: 160rpx;
    height: 60rpx;
    font-size: 26rpx;
    border-radius: 30rpx;
    font-weight: 500;
    color: #fff;
  }
}
</style>
