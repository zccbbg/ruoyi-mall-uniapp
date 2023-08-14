<!-- 页面 -->
<template>
  <s-layout title="我的订单" >
    <su-sticky bgColor="#fff">
      <su-tabs
        :list="tabMaps"
        :scrollable="false"
        @change="onTabsChange"
        :current="state.currentTab"
      ></su-tabs>
    </su-sticky>
    <s-empty
      v-if="state.pagination.total === 0"
      icon="/static/order-empty.png"
      text="暂无订单"
    ></s-empty>
    <view v-if="state.pagination.total > 0">
      <view
        class="bg-white order-list-card-box ss-r-10 ss-m-t-14 ss-m-20"
        v-for="order in state.pagination.data"
        :key="order.id"
      >
        <view class="order-card-header ss-flex ss-col-center ss-row-between ss-p-x-20">
          <view class="order-no">{{ '订单号：' + order.orderSn }}</view>
          <view class="order-state ss-font-26" :class="formatOrderColor(order.status)">
            <text>{{getOrderStatusName(order.status) }}</text>
            <text v-if="order.aftersaleStatus > 1" class="danger-color">（{{getOrderAfterSaleStatusName(order.aftersaleStatus) }}）</text>
          </view>
        </view>
        <view class="border-bottom" v-for="item in order.orderItemList" :key="item.id">
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
<!--                  class="ss-reset-button apply-btn"-->
<!--                  v-if="item.btns.includes('aftersale')"-->
<!--                  @tap.stop="-->
<!--                    sheep.$router.go('/pages/order/aftersale/apply', {-->
<!--                      item: JSON.stringify(item),-->
<!--                    })-->
<!--                  "-->
<!--                >-->
<!--                  申请售后-->
<!--                </button>-->
<!--                <button-->
<!--                  class="ss-reset-button apply-btn"-->
<!--                  v-if="item.btns.includes('re_aftersale')"-->
<!--                  @tap.stop="-->
<!--                    sheep.$router.go('/pages/order/aftersale/apply', {-->
<!--                      item: JSON.stringify(item),-->
<!--                    })-->
<!--                  "-->
<!--                >-->
<!--                  重新售后-->
<!--                </button>-->

<!--                <button-->
<!--                  class="ss-reset-button apply-btn"-->
<!--                  v-if="item.btns.includes('aftersale_info')"-->
<!--                  @tap.stop="-->
<!--                    sheep.$router.go('/pages/order/aftersale/detail', {-->
<!--                      id: item.ext.aftersale_id,-->
<!--                    })-->
<!--                  "-->
<!--                >-->
<!--                  售后详情-->
<!--                </button>-->
<!--                <button-->
<!--                  class="ss-reset-button apply-btn"-->
<!--                  v-if="item.btns.includes('buy_again')"-->
<!--                  @tap.stop="-->
<!--                    sheep.$router.go('/pages/goods/index', {-->
<!--                      id: item.goods_id,-->
<!--                    })-->
<!--                  "-->
<!--                >-->
<!--                  再次购买-->
<!--                </button>-->
<!--              </view>-->
<!--            </template>-->
          </s-goods-item>
        </view>
        <view class="pay-box ss-m-t-30 ss-flex ss-row-right ss-p-r-20">
          <view class="ss-flex ss-col-center">
            <view class="discounts-title pay-color">共{{calcGoodsCount(order.orderItemList)}}件商品， </view>
            <view class="discounts-title pay-color">实付：</view>
            <view class="discounts-money pay-color">￥{{ order.payAmount.toFixed(2) }}</view>
          </view>
        </view>
        <view
          class="order-card-footer ss-flex ss-col-center ss-p-x-20"
        >
          <!-- <su-popover>
            <button class="more-btn ss-reset-button" @click.stop>更多</button>
            <template #content>
              <view class="more-item-box">
                <view class="more-item ss-flex ss-col-center ss-reset-button">
                  <view class="item-title">删除订单</view>
                </view>
                <view class="more-item ss-flex ss-col-center ss-reset-button">
                  <view class="item-title">查看发票</view>
                </view>
                <view class="more-item ss-flex ss-col-center ss-reset-button">
                  <view class="item-title">评价晒单</view>
                </view>
              </view>
            </template>
          </su-popover> -->
          <view class="ss-flex ss-col-center ml-auto">
            <button class="apply-btn ss-reset-button" v-if="order.aftersaleStatus === 1" @tap.stop="onOrderDetail(order.orderId,'orderId')">
              查看详情
            </button>
<!--            <button v-if="order.status === 2 && order.aftersaleStatus === 1" class="apply-btn ss-reset-button"-->
<!--                    @tap.stop="onExpress(order.orderId)">-->
<!--              查看物流-->
<!--            </button>-->
            <button v-if="order.status === 2 && order.aftersaleStatus === 1" class="tool-btn ss-reset-button ui-BG-Main-Gradient"
                    @tap.stop="onConfirm(order.orderId)">
              确认收货
            </button>
            <button
                v-if="[1,2,3].includes(order.status) && order.aftersaleStatus === 1" class="delete-btn ss-reset-button"
                @tap.stop="onRefund(order)">
              申请退款
            </button>
            <button v-if="order.status === 0" class="apply-btn ss-reset-button" @tap.stop="onCancel(order.orderId)">
              取消订单
            </button>
<!--            &lt;!&ndash;                <button&ndash;&gt;-->
<!--            &lt;!&ndash;                  v-if="[0,4,5].includes(order.status)"&ndash;&gt;-->
<!--            &lt;!&ndash;                  class="delete-btn ss-reset-button"&ndash;&gt;-->
<!--            &lt;!&ndash;                  @tap.stop="onDelete(order.id)"&ndash;&gt;-->
<!--            &lt;!&ndash;                >&ndash;&gt;-->
<!--            &lt;!&ndash;                  删除订单&ndash;&gt;-->
<!--            &lt;!&ndash;                </button>&ndash;&gt;-->
            <button v-if="order.status === 0" class="tool-btn ss-reset-button ui-BG-Main-Gradient" @tap.stop="onPay({orderSn:order.payId,totalAmount: order.totalAmount})">
              继续支付
            </button>
            <button class="ss-reset-button apply-btn" v-if="order.aftersaleStatus > 1"
                    @tap.stop="sheep.$router.go('/pages/order/aftersale/detail', {id: order.orderId })">
              售后详情
            </button>
            <button class="ss-reset-button apply-btn" v-if="[2,5].includes(order.aftersaleStatus)"
                    @tap.stop="cancelRefund(order.orderId)">
              取消售后
            </button>
<!--            <button class="ss-reset-button apply-btn" v-if="order.status === 3 && order.aftersaleStatus === 1"-->
<!--                    @tap.stop="sheep.$router.go('/pages/goods/index', {id: order.items[0].productId})">-->
<!--              再次购买-->
<!--            </button>-->
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <uni-load-more
      v-if="state.pagination.total > 0"
      :status="state.loadStatus"
      :content-text="{
        contentdown: '上拉加载更多',
      }"
      @tap="loadmore"
    />
  </s-layout>
</template>

<script setup>
  import { computed, reactive } from 'vue';
  import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
  import { formatOrderColor, getOrderStatusName, getOrderAfterSaleStatusName } from '@/sheep/hooks/useGoods';
  import sheep from '@/sheep';
  import _, {clone} from 'lodash';

  const pagination = {
    data: [],
    page: 1,
    total: 0,
    size: 5
  };
  // 数据
  const state = reactive({
    currentTab: 0,
    pagination: {
      data: [],
      page: 1,
      total: 0,
      size: 5
    },
    loadStatus: '',
    deleteOrderId: 0,
    error: 0,
  });

  const tabMaps = [
    {
      name: '全部',
      value: '-1',
    },
    {
      name: '待付款',
      value: '0',
    },
    {
      name: '待发货',
      value: '1',
    },
    {
      name: '待收货',
      value: '2',
    },
    {
      name: '售后单',
      value: '-2',
    },
  ];

  // 切换选项卡
  function onTabsChange(e) {
    if (state.currentTab === e.index) return;

    state.pagination = clone(pagination);
    state.currentTab = e.index;
    state.pagination.data = []
    getOrderList();
  }

  // 订单详情
  function onOrderDetail(id) {
    sheep.$router.go('/pages/order/detail', {
      id,
    });
  }

  // 分享拼团
  function onOrderGroupon(order) {
    sheep.$router.go('/pages/activity/groupon/detail', {
      id: order.ext.groupon_id,
    });
  }

  // 查看发票
  function onOrderInvoice(invoiceId) {
    sheep.$router.go('/pages/order/invoice', {
      invoiceId,
    });
  }

  // 继续支付
  function onPay(data) {
    console.log('data',data)
    sheep.$router.go('/pages/pay/index', {
      orderSN:data.orderSn,
      totalAmount: data.totalAmount,
      orderType: 'memberConsumer'
    });
  }

  // 评价
  function onComment(orderSN) {
    sheep.$router.go('/pages/goods/comment/add', {
      orderSN,
    });
  }

  // 确认收货
  async function onConfirm(orderId) {
    uni.showModal({
      title: '提示',
      content: '请确认包裹全部到达后再确认收货',
      success: async function (res) {
        if (res.confirm) {
          const res = await sheep.$api.order.confirm(orderId);
          if (res) {
            sheep.$helper.toast('收货成功')
            state.pagination = clone(pagination)
            getOrderList()
          }
        }
      },
    });
  }

  // 查看物流
  async function onExpress(orderId) {
    return
    sheep.$router.go('/pages/order/express/list', {
      orderId,
    });
  }

  // 计算商品数量
  function calcGoodsCount(data){
    let sum = 0
    data.forEach(it => {
      sum += it.quantity
    })
    return sum
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
            state.pagination = clone(pagination)
            getOrderList()
          }
        }
      },
    });
  }

  // 删除订单
  function onDelete(orderId) {
    uni.showModal({
      title: '提示',
      content: '确定要删除订单吗?',
      success: async function (res) {
        if (res.confirm) {
          const { error, data } = await sheep.$api.order.delete(orderId);
          if (error === 0) {
            let index = state.pagination.data.findIndex((order) => order.id === orderId);
            state.pagination.data.splice(index, 1);
          }
        }
      },
    });
  }

  // 申请退款
  async function onRefund(order) {
    sheep.$router.go('/pages/order/aftersale/apply',{item:JSON.stringify(order)})
  }

  async function cancelRefund(id) {
    uni.showModal({
      title: '提示',
      content: '确定要取消售后吗?',
      success: async function (res) {
        if (res.confirm) {
          await sheep.$api.order.aftersale.cancel(id);
          sheep.$helper.toast('取消成功')
          reloadData();
        }
      },
    });
  }

  // 获取订单列表
  async function getOrderList() {
    state.loadStatus = 'loading';
    console.log('size:', state.pagination)
    let res = await sheep.$api.order.list({
      page: state.pagination.page - 1,
      size: state.pagination.size,
      status: tabMaps[state.currentTab].value
    });
    const {content, totalElements, totalPages} = res;
    content.forEach(it => {
      it.orderItemList.forEach(item => {
        let str = "";
        const obj = JSON.parse(item.spData);
        Object.keys(obj).forEach((key) => {
          str += key + "：" + obj[key] + " ";
        });
        item.spDataValue = str;
      })
    })
    state.pagination.data = _.concat(state.pagination.data, content);
    state.pagination.total = totalElements
    if (state.pagination.page < totalPages) {
      state.loadStatus = 'more';
    } else {
      state.loadStatus = 'noMore';
    }
  }

  onLoad(async (options) => {
    if (options.type) {
      state.currentTab = options.type;
    }
    getOrderList();
  });

  // 加载更多
  function loadmore() {
    if (state.loadStatus !== 'noMore') {
      state.pagination.page++
      getOrderList();
    }
  }

  // 上拉加载更多
  onReachBottom(() => {
    loadmore();
  });

  //下拉刷新
  onPullDownRefresh(() => {
    state.pagination = clone(pagination);
    getOrderList();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 800);
  });

  function reloadData(){
    state.pagination = clone(pagination)
    getOrderList()
  }
</script>

<style lang="scss" scoped>
  .score-img {
    width: 36rpx;
    height: 36rpx;
    margin: 0 4rpx;
  }
  .tool-btn {
    width: 160rpx;
    height: 55rpx;
    background: white;
    font-size: 26rpx;
    border-radius: 30rpx;
    margin-right: 10rpx;

    &:last-of-type {
      margin-right: 0;
    }
  }
  .delete-btn {
    width: 160rpx;
    height: 55rpx;
    color: #ff3000;
    background: #fee;
    border-radius: 30rpx;
    font-size: 26rpx;
    margin-right: 10rpx;
    line-height: normal;
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
    margin-left: 10rpx;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .swiper-box {
    flex: 1;

    .swiper-item {
      height: 100%;
      width: 100%;
    }
  }

  .order-list-card-box {
    .order-card-header {
      height: 80rpx;

      .order-no {
        font-size: 26rpx;
        font-weight: 500;
      }

      .order-state {
      }
    }

    .pay-box {
      .discounts-title {
        font-size: 24rpx;
        line-height: normal;
        color: #999999;
      }

      .discounts-money {
        font-size: 24rpx;
        line-height: normal;
        color: #999;
        font-family: OPPOSANS;
      }

      .pay-color {
        color: #333;
      }
    }

    .order-card-footer {
      height: 100rpx;

      .more-item-box {
        padding: 20rpx;

        .more-item {
          height: 60rpx;

          .title {
            font-size: 26rpx;
          }
        }
      }

      .more-btn {
        color: $dark-9;
        font-size: 24rpx;
      }

      .content {
        width: 154rpx;
        color: #333333;
        font-size: 26rpx;
        font-weight: 500;
      }
    }
  }

  :deep(.uni-tooltip-popup) {
    background: var(--ui-BG);
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
</style>
