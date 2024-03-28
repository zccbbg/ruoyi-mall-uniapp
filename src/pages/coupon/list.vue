<!-- 优惠券中心  -->
<template>
  <s-layout title="优惠券" :bgStyle="{ color: '#f2f2f2' }">
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
      icon="/static/coupon-empty.png"
      text="暂无优惠券"
    ></s-empty>
    <!-- 活动 -->
    <template v-if="state.currentTab == '0'">
      <view v-for="item in state.pagination.data" :key="item.id">
        <s-coupon-list
          :data="item"
          @tap="
            sheep.$router.go('/pages/coupon/detail', {
              id: item.id
            })
          "
        >
          <template #default>
            <button
              class="ss-reset-button card-btn ss-flex ss-row-center ss-col-center"
              :class="!item.canGet ? 'border-btn' : ''"
              @click.stop="getBuy(item.id)"
              :disabled="!item.canGet"
            >
              {{ item.canGet ? '立即领取':'已领取' }}
            </button>
          </template>
        </s-coupon-list>
      </view>
    </template>
    <template v-else>
      <view v-for="item in state.pagination.data" :key="item.id">
        <s-coupon-list
          :data="item"
          type="user"
          @tap="
            sheep.$router.go('/pages/coupon/detail', {
              id: item.couponActivityId,
              user_coupon_id: item.id,
            })
          "
        >
        </s-coupon-list>
      </view>
    </template>

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
  import sheep from '@/sheep';
  import { onLoad, onReachBottom } from '@dcloudio/uni-app';
  import { computed, reactive } from 'vue';
  import _, {clone} from 'lodash';

  const pagination = {
    data: [],
    page: 1,
    total: 0,
    size: 10
  };
  // 数据
  const state = reactive({
    currentTab: 0,
    pagination: clone(pagination),
    loadStatus: '',
    type: '',
  });

  const tabMaps = [
    {
      name: '领券中心',
      value: 'all',
    },
    {
      name: '已领取',
      value: 'geted',
    },
    {
      name: '已使用',
      value: 'used',
    },
    {
      name: '已失效',
      value: 'expired',
    },
  ];
  function onTabsChange(e) {
    state.pagination = clone(pagination)
    state.currentTab = e.index;
    state.type = e.value;
    if (state.currentTab == 0) {
      getActivity();
    } else {
      getCoupon();
    }
  }
  async function getActivity() {
    state.loadStatus = "loading";
    const res = await sheep.$api.coupon.list({ page: state.pagination.page - 1, size: state.pagination.size });
    const { content, totalElements, totalPages } = res;
    state.pagination.data = _.concat(state.pagination.data, content);
    state.pagination.total = totalElements;
    if (state.pagination.page < totalPages) {
      state.loadStatus = "more";
    } else {
      state.loadStatus = "noMore";
    }
  }

  async function getCoupon() {
    state.loadStatus = 'loading';
    let res = await sheep.$api.coupon.userCoupon({type: state.currentTab},{ page: state.pagination.page - 1, size: state.pagination.size });
    const { content, totalElements, totalPages } = res;
    state.pagination.data = _.concat(state.pagination.data, content);
    state.pagination.total = totalElements;
    if (state.pagination.page < totalPages) {
      state.loadStatus = "more";
    } else {
      state.loadStatus = "noMore";
    }
  }
  async function getBuy(id) {
    const res = await sheep.$api.coupon.get(id);
    if (res) {
      uni.showToast({
        title: '领取成功',
      });
      setTimeout(() => {
        state.pagination.data = []
        getActivity();
      }, 1000);
    }
  }

  // 加载更多
  function loadmore() {
    if (state.loadStatus !== 'noMore') {
      state.pagination.page++;
      if (state.currentTab == 0) {
        getActivity();
      } else {
        getCoupon();
      }
    }
  }
  onLoad((Option) => {
    if (Option.type === 'all' || !Option.type) {
      getActivity();
    } else {
      state.type = Option.type;
      Option.type === 'geted'
        ? (state.currentTab = 1)
        : Option.type === 'used'
        ? (state.currentTab = 2)
        : (state.currentTab = 3);
      getCoupon();
    }
  });
  onReachBottom(() => {
    loadmore();
  });
</script>
<style lang="scss" scoped>
  .card-btn {
    // width: 144rpx;
    padding: 0 16rpx;
    height: 50rpx;
    border-radius: 40rpx;
    background: linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
  }
  .border-btn {
    background: linear-gradient(90deg, var(--ui-BG-Main-opacity-4), var(--ui-BG-Main-light));
    color: #fff !important;
  }
  .disabled-btn {
    background: #cccccc;
    background-color: #cccccc !important;
    color: #fff !important;
  }
</style>
