<template>
  <s-layout class="set-wrap" :title="state.title" :bgStyle="{ color: '#FFF' }">
    <view class="ss-p-30"><mp-html class="richtext" :content="state.content"></mp-html></view>
  </s-layout>
</template>

<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { reactive } from 'vue';
  import sheep from '@/sheep';

  const state = reactive({
    title: '',
    content: '',
  });

  async function getRichTextContent(configKey) {
    const res = await sheep.$api.data.getSysConfig({configKey});
    console.log(res)
    if (res.data) {
      state.content = res.data;
    }
  }
  onLoad((options) => {
    if (options.title) {
      state.title = options.title;
      uni.setNavigationBarTitle({
        title: state.title,
      });
    }
    getRichTextContent(options.key);
  });
</script>

<style lang="scss" scoped>
  .set-title {
    margin: 0 30rpx;
  }

  .richtext {
  }
</style>
