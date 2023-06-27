<template>
  <s-layout title="收货地址" :bgStyle="{ color: '#FFF' }">
    <view v-if="state.list.length">
      <s-address-item
          hasBorderBottom
          v-for="item in state.list"
          :key="item.id"
          :item="item"
          @tap="onSelect(item)"
      >
      </s-address-item>
    </view>

    <su-fixed bottom placeholder>
      <view class="footer-box ss-flex ss-row-between ss-p-20">
        <button
            class="add-btn ss-reset-button ui-Shadow-Main"
            @tap="sheep.$router.go('/pages/user/address/edit')"
        >
          新增收货地址
        </button>
      </view>
    </su-fixed>
    <s-empty
        v-if="state.list.length === 0 && !state.loading"
        text="暂无收货地址"
        icon="/static/data-empty.png"
    />
  </s-layout>
</template>

<script setup>
  import { reactive, onBeforeMount } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import sheep from '@/sheep';
  import { isEmpty } from 'lodash';

  const state = reactive({
    list: [],
    loading: true,
  });

  // 选择收货地址
  const onSelect = (addressInfo) => {
    uni.$emit('SELECT_ADDRESS', {
      addressInfo,
    });
    sheep.$router.back();
  };

  onShow(async () => {
    const res = await sheep.$api.user.address.list();
    state.list = res
    console.log('res:', res)
    state.loading = false;
  });

  onBeforeMount(() => {
    if (!!uni.getStorageSync('areaData')) {
      return;
    }
    // 提前加载省市区数据
    sheep.$api.data.area().then((res) => {
      uni.setStorageSync('areaData', res.data);
    });
  });
</script>

<style lang="scss" scoped>
  .footer-box {
    .add-btn {
      flex: 1;
      background: linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
      border-radius: 80rpx;
      font-size: 30rpx;
      font-weight: 500;
      line-height: 80rpx;
      color: $white;
      position: relative;
      z-index: 1;
    }

    .sync-wxaddress {
      flex: 1;
      line-height: 80rpx;
      background: $white;
      border-radius: 80rpx;
      font-size: 30rpx;
      font-weight: 500;
      color: $dark-6;
      margin-right: 18rpx;
    }
  }
</style>
