<template>
  <uni-grid :showBorder="Boolean(data.border)" :column="data.col">
    <uni-grid-item
        v-for="(item, index) in data.list"
        :key="index"
        @tap="handleGo(item)"
    >
      <view class="grid-item-box ss-flex ss-flex-col ss-row-center ss-col-center">
        <view class="img-box">
          <view
              class="tag-box"
              v-if="item.badge.show"
              :style="[{ background: item.badge.bgColor, color: item.badge.color }]"
          >
            {{ item.badge.text }}
          </view>
          <image class="menu-image" :src="item.src"></image>
        </view>

        <view class="title-box ss-flex ss-flex-col ss-row-center ss-col-center">
          <view class="grid-text" :style="[{ color: item.title.color }]">
            {{ item.title.text }}
          </view>
          <view class="grid-tip" :style="[{ color: item.tip.color }]">
            {{ item.tip.text }}
          </view>
        </view>
      </view>
    </uni-grid-item>
  </uni-grid>
</template>

<script setup>
import sheep from '@/sheep';
import { showAuthModal } from '@/sheep/hooks/useModal';

const props = defineProps({
  data: {
    type: Object,
    default() {
    },
  },
});

const handleGo = (item) => {
  console.log('item:', item)
  if (item.title.text === '清空缓存') {
    sheep.$store('user').resetUserData()
    uni.showToast({
      title: '缓存清除成功',
    });
  } else if (item.title.text === '联系客服') {
    showAuthModal('contact','center')
  } else if ((item.finish)) {
    sheep.$router.go(item.url)
  } else {
    sheep.$helper.toast('功能暂未开发')
  }
}

</script>

<style lang="scss" scoped>
.menu-image {
  width: 24px;
  height: 24px;
}

.grid-item-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .img-box {
    position: relative;

    .tag-box {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 0;
      font-size: 2em;
      line-height: 1;
      padding: 0.4em 0.6em 0.3em;
      transform: scale(0.4) translateX(0.5em) translatey(-0.6em);
      transform-origin: 100% 0;
      border-radius: 200rpx;
      white-space: nowrap;
    }
  }

  .title-box {
    .grid-tip {
      font-size: 24rpx;
      white-space: nowrap;
      text-align: center;
    }
  }
}
</style>
