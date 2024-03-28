<template>
  <s-layout class="wallet-wrap" title="积分记录">
    <!-- 钱包卡片 -->
    <view class="header-box ss-flex ss-row-center ss-col-center">
      <view class="card-box ui-BG-Main ui-Shadow-Main">
        <view class="card-head ss-flex ss-col-center">
          <view class="card-title ss-m-r-10">积分</view>
          <view
            @tap="changeShow"
            class="ss-eye-icon"
            :class="state.showMoney ? 'cicon-eye' : 'cicon-eye-off'"
          ></view>
        </view>
        <view class="ss-flex ss-row-between ss-col-center ss-m-t-30">
          <view class="money-num">{{ state.showMoney ? state.amountObj?.balance || 0 : '*****' }}</view>
        </view>
      </view>
    </view>
    <su-sticky>
      <!-- 统计 -->
      <view class="filter-box ss-p-x-30 ss-flex ss-col-center ss-row-between">
        <uni-datetime-picker
          v-model="state.data"
          type="daterange"
          @change="onChangeTime"
          :end="state.today"
        >
          <button class="ss-reset-button date-btn">
            <text>{{ dateFilterText }}</text>
            <text class="cicon-drop-down ss-seldate-icon"></text>
          </button>
        </uni-datetime-picker>

        <view class="total-box">
          <view class="ss-m-b-10">收入￥{{ state.amountObj.income || 0  }}</view>
          <view>支出￥{{ state.amountObj.expenditure || 0 }}</view>
        </view>
      </view>
      <su-tabs
        :list="tabMaps"
        @change="onChangeTab"
        :scrollable="false"
        :current="state.currentTab"
      ></su-tabs>
    </su-sticky>
    <s-empty
      v-if="state.pagination.total === 0"
      icon="/static/data-empty.png"
      text="暂无数据"
    ></s-empty>
    <!-- 转余额弹框 -->
    <su-popup
      :show="state.showModal"
      type="bottom"
      round="20"
      @close="state.showModal = false"
      showClose
    >
      <view class="ss-p-x-20 ss-p-y-30">
        <view class="model-title ss-m-b-30 ss-m-l-20">转余额</view>
        <view class="model-subtitle ss-m-b-100 ss-m-l-20">将您的佣金转到余额中继续消费</view>
        <view class="input-box ss-flex ss-col-center border-bottom ss-m-b-70 ss-m-x-20">
          <view class="unit">￥</view>
          <uni-easyinput
            :inputBorder="false"
            class="ss-flex-1 ss-p-l-10"
            v-model="state.amount"
            type="number"
            placeholder="请输入提现金额"
          />
        </view>
        <button
          class="ss-reset-button model-btn ui-BG-Main-Gradient ui-Shadow-Main"
          @tap="onConfirm"
        >
          确定
        </button>
      </view>
    </su-popup>
    <!-- 钱包记录 -->
    <view v-if="state.pagination.total > 0">
      <view
        class="wallet-list ss-flex border-bottom"
        v-for="item in state.pagination.data"
        :key="item.id"
      >
        <view class="list-content">
          <view class="title-box ss-flex ss-row-between ss-m-b-20">
            <view class="flex-center">
              <view class="title ss-line-1" v-html="getStatusDesc(item)"></view>
            </view>
            <view class="money">
              <text v-if="[1,3].includes(item.opType)" :class="[16,17,31].includes(item.subOpType)?'add':''">+{{ item.amount }}</text>
              <text v-else class="minus">-{{ item.amount }}</text>
            </view>
          </view>
          <view class="time">
            {{getDesc(item)}}
          </view>
          <text class="time">{{ item.createTime }}</text>
        </view>
      </view>
    </view>

    <!-- <u-gap></u-gap> -->
    <uni-load-more
      v-if="state.pagination.total > 0"
      :status="state.loadStatus"
      @tap="loadmore"
      :content-text="{
        contentdown: '上拉加载更多',
      }"
    />
  </s-layout>
</template>

<script setup>
  import { computed, reactive } from 'vue';
  import { onLoad, onReachBottom } from '@dcloudio/uni-app';
  import sheep from '@/sheep';
  import dayjs from 'dayjs';
  import _, { clone } from "lodash";
  import { numSub } from "@/sheep/hooks/useGoods";

  function changeShow(){
    state.showMoney = !state.showMoney
    uni.setStorageSync('showMoney',state.showMoney)
  }

  // 数据
  const pagination = {
    data: [],
    page: 1,
    total: 0,
    size: 10
  };
  const state = reactive({
    showMoney: uni.getStorageSync("showMoney") === '' ? true : uni.getStorageSync("showMoney"),
    date: [],
    currentTab: 1,
    pagination: clone(pagination),
    loadStatus: '',
    showModal: false,
    today: '',
    amountObj: {},
    params: {
      start: '',
      end: ''
    },
  });

  const tabMaps = [
    {
      name: '全部',
      value: 0,
    },
    {
      name: '收入',
      value: 1,
    },
    {
      name: '支出',
      value: 2,
    },
  ];
  const dateFilterText = computed(() => {
    if (state.date[0] === state.date[1]) {
      return state.date[0];
    } else {
      return state.date.join('~');
    }
  });

  async function getLogList() {
    state.loadStatus = "loading";
    const params = { ...state.params }
    if (state.currentTab) {
      params.opType = tabMaps[state.currentTab].value
    }
    const res = await sheep.$api.data.integralHistoryList(params, { page: state.pagination.page - 1, size: state.pagination.size });
    const { content, totalElements, totalPages } = res;
    state.pagination.data = _.concat(state.pagination.data, content);
    state.pagination.total = totalElements;
    if (state.pagination.page < totalPages) {
      state.loadStatus = "more";
    } else {
      state.loadStatus = "noMore";
    }
  }
  function getStatusDesc(item) {
    switch (item.subOpType) {
      case 11:
        return '签到得积分'
      case 12:
        return '消费得积分'
      case 21:
        return '退款扣积分'
      case 22:
        return '优惠券兑换'
      default:
        return ''
    }
  }

  function getDesc(item) {
    switch (item.subOpType) {
      case 12:
        return `消费${item.orderAmount}元、获得积分${item.amount}`
      case 21:
        return `订单退款${item.orderAmount}元、扣除积分${item.amount}`
      case 22:
        return `兑换${item.orderAmount}元优惠券、扣除积分${item.amount}`
      default:
        return ''
    }
  }

  function statConsumption(){
    sheep.$api.data.getIntegralBalance(state.params)
      .then(res=>{
        state.amountObj = res;
      })
  }

  function onChangeTab(e) {
    state.pagination = clone(pagination);
    state.currentTab = e.index;
    getLogList();
  }

  function onChangeTime(e) {
    state.date[0] = e[0];
    state.date[1] = e[e.length - 1];
    state.pagination = clone(pagination);
    appendTimeHMS();
    Promise.all([statConsumption(),getLogList()])
  }

  function appendTimeHMS() {
    const [begin, end] = state.date;
    state.params = {
      start: begin + ' 00:00:00',
      end: end + ' 23:59:59'
    }
  }

  // 确认操作
  async function onConfirm() {
    if (state.amount <= 0) {
      sheep.$helper.toast('请输入正确的金额');
      return;
    }
    uni.showModal({
      title: '提示',
      content: '确认把您的佣金转入到余额钱包中？',
      success: async function (res) {
        if (res.confirm) {
          const { error } = await sheep.$api.commission.transfer({
            amount: state.amount,
          });
          if (error === 0) {
            state.showModal = false;
            sheep.$store('user').getInfo();
            onChangeTab({ index: 0 });
          }
        }
      },
    });
  }

  onLoad(async (options) => {
    state.today = dayjs().format('YYYY-MM-DD');
    state.date = [dayjs().subtract(30, 'day').format('YYYY-MM-DD'), state.today];
    appendTimeHMS();
    Promise.all([statConsumption(),getLogList()])
  });

  // 加载更多
  function loadmore() {
    if (state.loadStatus !== "noMore") {
      state.pagination.page++;
      getLogList();
    }
  }

  onReachBottom(() => {
    loadmore();
  });
</script>

<style lang="scss" scoped>
  // 钱包
  .header-box {
    background-color: $white;
    padding: 30rpx;

    .card-box {
      width: 100%;
      min-height: 300rpx;
      padding: 40rpx;
      background-size: 100% 100%;
      border-radius: 30rpx;
      overflow: hidden;
      position: relative;
      z-index: 1;
      box-sizing: border-box;

      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .card-head {
        color: $white;
        font-size: 24rpx;
      }

      .ss-eye-icon {
        font-size: 40rpx;
        color: $white;
      }

      .money-num {
        font-size: 40rpx;
        line-height: normal;
        font-weight: 500;
        color: $white;
        font-family: OPPOSANS;
      }

      .reduce-num {
        font-size: 26rpx;
        font-weight: 400;
        color: $white;
      }

      .withdraw-btn {
        width: 120rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 30px;
        font-size: 24rpx;
        font-weight: 500;
        background-color: $white;
        color: var(--ui-BG-Main);
      }

      .balance-btn {
        width: 120rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 30px;
        font-size: 24rpx;
        font-weight: 500;
        color: $white;
        border: 1px solid $white;
      }
    }
  }

  .loading-money {
    margin-top: 56rpx;
    .loading-money-title {
      font-size: 24rpx;
      font-weight: 400;
      color: #ffffff;
      line-height: normal;
      margin-bottom: 30rpx;
    }

    .loading-money-num {
      font-size: 30rpx;
      font-family: OPPOSANS;
      font-weight: 500;
      color: #fefefe;
    }
  }

  // 筛选

  .filter-box {
    height: 120rpx;
    padding: 0 30rpx;
    background-color: $bg-page;

    .total-box {
      font-size: 24rpx;
      font-weight: 500;
      color: $dark-9;
    }

    .date-btn {
      background-color: $white;
      line-height: 54rpx;
      border-radius: 27rpx;
      padding: 0 20rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: $dark-6;

      .ss-seldate-icon {
        font-size: 50rpx;
        color: $dark-9;
      }
    }
  }

  // tab
  .wallet-tab-card {
    .tab-item {
      height: 80rpx;
      position: relative;

      .tab-title {
        font-size: 30rpx;
      }

      .cur-tab-title {
        font-weight: $font-weight-bold;
      }

      .tab-line {
        width: 60rpx;
        height: 6rpx;
        border-radius: 6rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 2rpx;
        background-color: var(--ui-BG-Main);
      }
    }
  }

  // 钱包记录
  .wallet-list {
    padding: 30rpx 30rpx 30rpx 40rpx;
    background-color: #ffff;

    .head-img {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      background: $gray-c;
    }

    .list-content {
      justify-content: space-between;
      align-items: flex-start;
      flex: 1;

      .title {
        font-size: 28rpx;
        color: $dark-3;
        //width: 400rpx;
      }

      .time {
        color: $gray-c;
        font-size: 24rpx;
      }
    }

    .money {
      font-size: 28rpx;
      font-weight: bold;
      font-family: OPPOSANS;

      .add {
        color: var(--ui-BG-Main);
      }

      .minus {
        color: $dark-3;
      }
    }
  }

  .model-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
  }

  .model-subtitle {
    font-size: 26rpx;
    color: #c2c7cf;
  }

  .model-btn {
    width: 100%;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: normal;
  }

  .input-box {
    height: 100rpx;

    .unit {
      font-size: 48rpx;
      color: #333;
      font-weight: 500;
      line-height: normal;
    }

    .uni-easyinput__placeholder-class {
      font-size: 30rpx;
      height: 40rpx;
      line-height: normal;
    }
  }
</style>
